import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { BusinessProduct } from "../models/businessProduct.model.js";
import { BusinessService } from "../models/businessService.model.js";
import { Business } from "../models/business.model.js";

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  //get datafrom various models from mongodb through API call

  const stats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: "count" }],
        totalBusinessmen: [
          { $match: { role: "businessman" } },
          { $count: "count" },
        ],
        emailVerified: [
          { $match: { isEmailVerified: true } },
          { $count: "count" },
        ],
        phoneVerified: [
          { $match: { isPhoneVerified: true } },
          { $count: "count" },
        ],
      },
    },
  ]);
  const totalProducts = await BusinessProduct.countDocuments();
  const totalServices = await BusinessService.countDocuments();

  const responseData = {
    totalProducts,
    totalServices,
    totalUsers: stats[0].totalUsers[0] ? stats[0].totalUsers[0].count : 0,
    totalBusinessmen: stats[0].totalBusinessmen[0]
      ? stats[0].totalBusinessmen[0].count
      : 0,
    emailVerified: stats[0].emailVerified[0]
      ? stats[0].emailVerified[0].count
      : 0,
    phoneVerified: stats[0].phoneVerified[0]
      ? stats[0].phoneVerified[0].count
      : 0,
  };

  console.log("Admin Dashboard Stats:", responseData);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Admin dashboard stats retrieved successfully",
        responseData
      )
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -__v")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, "All users retrieved successfully", users));
});

const allBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find().sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "All businesses retrieved successfully", businesses)
    );
});

const updateUserStatus = asyncHandler(async (req, res) => {
  console.log("Update User Status Request Body:", req.body);
  const { userId } = req.params;

  const { status } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.status = status;
  await user.save({
    validateBeforeSave: false,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "User status updated successfully", user));
});

const getAllBusinessesWithAllDetails = asyncHandler(async (req, res) => {

  //fetch details using aggreegate
 
  const detailedBusinesses = await Business.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $lookup: {
        from: "businesslocations",
        localField: "_id",
        foreignField: "businessId",
        as: "locationDetails",
      },
    },
    {
      $lookup: {
        from: "businesscontacts",
        localField: "_id",
        foreignField: "businessId",
        as: "contactDetails",
      },
    },
    {
      $lookup: {
        from: "businesshours",
        localField: "_id",
        foreignField: "businessId",
        as: "workingHoursDetails",
      },
    },
  ]);

  console.log(
    "Detailed Businesses with all details:",
    detailedBusinesses
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All businesses with details retrieved successfully",
        detailedBusinesses
      )
    );
});

const updateBusinessStatus = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { status } = req.body;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  business.status = status;
  await business.save({
    validateBeforeSave: false,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Business status updated successfully", business));
});

export {
  getAdminDashboardStats,
  getAllUsers,
  allBusinesses,
  updateUserStatus,
  getAllBusinessesWithAllDetails,
  updateBusinessStatus,
};
