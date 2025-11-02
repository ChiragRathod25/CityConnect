import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { BusinessReview } from "../models/businessReview.model.js";
import mongoose from "mongoose";

const registerBusiness = asyncHandler(async (req, res, next) => {
  const { name, type, category, description } = req.body;

  if (!name || !type || !category || !description) {
    return next(new ApiError("All fields are required", 400));
  }

  console.log("Registering business for user:", req.user);
  // Check if the user already has a business profile
  // const existingBusiness = await Business.findOne({ ownerId: req.user._id });

  // if (existingBusiness) {
  //   throw new ApiError(400, "User already has a business profile");
  // }

  const business = await Business.create({
    ownerId: req.user._id,
    name,
    type,
    category,
    description,
  });

  if (!business) {
    throw new ApiError(500, "Failed to create business profile");
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, "Business profile created successfully", business)
    );
});

const getBusinessProfileById = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(businessId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $lookup: {
        from: "businesslocations",
        localField: "_id",
        foreignField: "businessId",
        as: "locationDetails",
      },
    },
    { $unwind: "$locationDetails" },
    {
      $lookup: {
        from: "businesscontacts",
        localField: "_id",
        foreignField: "businessId",
        as: "contactDetails",
      },
    },
    { $unwind: "$contactDetails" },
    {
      $lookup: {
        from: "businesshours",
        localField: "_id",
        foreignField: "businessId",
        as: "workingHoursDetails",
      },
    },
    { $unwind: "$workingHoursDetails" },
  ]);

  const allreviews=await BusinessReview.find({businessId:businessId});
  console.log("All Reviews:", allreviews);
  const ratings = await BusinessReview.aggregate([
    ({
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
      },
    },
    {
      $group: {
        _id: "$business",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    })
  ]);
  console.log("Ratings:", ratings);
  if (ratings.length > 0) {
    business[0].averageRating = ratings[0].averageRating;
    business[0].reviewCount = ratings[0].reviewCount;
  } else {
    business[0].averageRating = 0;
    business[0].reviewCount = 0;
  }

  const businessProfile = business[0];

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Business profile fetched successfully",
        businessProfile
      )
    );
});

const updateBusinessProfileById = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  const {
    name,
    type,
    category,
    description,
    establishedYear,
    numberOfEmployees,
    annualRevenue,
  } = req.body;

  business.name = name || business.name;
  business.type = type || business.type;
  business.category = category || business.category;
  business.description = description || business.description;
  business.establishedYear = establishedYear || business.establishedYear;
  business.numberOfEmployees = numberOfEmployees || business.numberOfEmployees;
  business.annualRevenue = annualRevenue || business.annualRevenue;

  await business.save({
    validateBeforeSave: true,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Business profile updated successfully", business)
    );
});

const deleteBusinessProfileById = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }
  await business.remove();
  res
    .status(200)
    .json(new ApiResponse(200, "Business profile deleted successfully", null));
});

const getAllBusinessProfiles = asyncHandler(async (req, res, next) => {
  //use agregation pipeline to include the details of the owner and other business related information from the other models
  //look up for user details, location details,
  const businesses = await Business.aggregate([
    {
      $match: { status: "active" },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Active business profiles fetched successfully",
        businesses
      )
    );
});

const searchBusinessProfiles = asyncHandler(async (req, res, next) => {
  const { name, type, category, isVerified, status } = req.query;
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" }; // case-insensitive regex search
  }
  if (type) {
    filter.type = { $regex: type, $options: "i" };
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }
  if (isVerified !== undefined) {
    filter.isVerified = isVerified === "true";
  }
  if (status) {
    filter.status = status;
  }

  const businesses = await Business.find(filter);

  if (!businesses || businesses.length === 0) {
    throw new ApiError(404, "No business profiles found matching the criteria");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Business profiles fetched successfully", businesses)
    );
});

const verifyBusinessProfile = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  const { isVerified, rejectedReason } = req.body;

  if (isVerified === undefined) {
    throw new ApiError(400, "isVerified field is required");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  business.isVerified = isVerified;
  business.verifiedAt = isVerified ? new Date() : null;
  business.rejectedReason = !isVerified ? rejectedReason : null;

  await business.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Business profile verification status updated successfully",
        business
      )
    );
});

const updateBusinessStatus = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status field is required");
  }
  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  business.status = status;

  await business.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Business profile status updated successfully",
        business
      )
    );
});

const updateBusinessLogo = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  // Assuming req.file contains the uploaded logo file information
  if (!req.file) {
    throw new ApiError(400, "Logo file is required");
  }

  try {
    // Upload the logo to Cloudinary
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload logo");
    }

    // Update the business profile with the new logo URL
    business.logo = uploadResult.secure_url;
    await business.save({ validateBeforeSave: true });

    res
      .status(200)
      .json(
        new ApiResponse(200, "Business logo updated successfully", business)
      );
  } catch (error) {
    throw new ApiError(500, "Failed to update business logo");
  }
});

const removeBusinessLogo = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  business.logo = null;
  await business.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(new ApiResponse(200, "Business logo removed successfully", business));
});

const addBusinessImages = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  // Assuming req.files contains the uploaded image files information
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image file is required");
  }

  const uploadResults = [];
  for (const file of req.files) {
    try {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult) {
        uploadResults.push(uploadResult.secure_url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new ApiError(500, "Failed to upload one or more images");
    }
  }

  business.images = business.images.concat(uploadResults);
  await business.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(new ApiResponse(200, "Business images added successfully", business));
});

const removeBusinessImage = asyncHandler(async (req, res, next) => {
  const businessId = req.params.id;
  const { imageUrl } = req.body;

  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  if (!imageUrl) {
    throw new ApiError(400, "Image URL is required");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business profile not found");
  }

  const imageIndex = business.images.indexOf(imageUrl);
  if (imageIndex === -1) {
    throw new ApiError(404, "Image not found in business profile");
  }

  business.images.splice(imageIndex, 1);
  await business.save({ validateBeforeSave: true });

  //delete from cloudinary
  try {
    await deleteFromCloudinary(imageUrl);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    if (process.env.NODE_ENV === "development") {
      throw new ApiError(500, "Failed to delete image from Cloudinary");
    }
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Business image removed successfully", business)
    );
});

const getBusinessByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  //include city, state from location model using aggregation pipeline
  //include owner details from user model

  const businesses = await Business.aggregate([
    {
      $match: { category: "restaurant" },
    },
    {
      $lookup: {
        from: "businesslocations",
        localField: "_id",
        foreignField: "businessId",
        as: "locationDetails",
      },
    },
    { $unwind: "$locationDetails" },
  ]);

  if (!businesses || businesses.length === 0) {
    throw new ApiError(404, "No business profiles found in this category");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Business profiles fetched successfully", businesses)
    );
});

const getAllBusinessesByUserId = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const businesses = await Business.find({ ownerId: userId });

  if (!businesses || businesses.length === 0) {
    throw new ApiError(404, "No business profiles found for this user");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Business profiles fetched successfully", businesses)
    );
});

export {
  registerBusiness,
  getBusinessProfileById,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  getAllBusinessProfiles,
  searchBusinessProfiles,
  verifyBusinessProfile,
  updateBusinessStatus,
  updateBusinessLogo,
  removeBusinessLogo,
  addBusinessImages,
  removeBusinessImage,
  getBusinessByCategory,
  getAllBusinessesByUserId,
};
