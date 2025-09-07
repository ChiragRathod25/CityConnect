import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BusinessReview } from "../models/businessReview.model.js";
import { Business } from "../models/business.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addReview = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;
  const { rating, comment, images } = req.body;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const existingReview = await BusinessReview.findOne({
    business: businessId,
    user: req.user._id,
  });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this business");
  }

  const review = await BusinessReview.create({
    business: businessId,
    user: req.user._id,
    rating,
    comment,
  });

  // If images are provided, upload them to Cloudinary
  if (images && images.length > 0) {
    const uploadedImageUrls = [];
    try {
      for (const file of req.files) {
        const uploadResult = await uploadOnCloudinary(file.path);
        if (uploadResult && uploadResult.secure_url) {
          uploadedImageUrls.push(uploadResult.secure_url);
        }
      }
      review.images = uploadedImageUrls;
      await review.save();
    } catch (error) {
      throw new ApiError(500, "Error uploading images");
    }
  }

  res
    .status(201)
    .json(new ApiResponce(201, "Review added successfully", review));
});

const getAllReviews = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  const reviews = await BusinessReview.find({ business: businessId }).sort(
    "-createdAt"
  );

  if (reviews.length === 0) {
    return res.status(200).json(new ApiResponce(200, "No reviews found", []));
  }
  res
    .status(200)
    .json(new ApiResponce(200, "Reviews fetched successfully", reviews));
});

const getReviewById = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await BusinessReview.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }
    res
      .status(200)
      .json(new ApiResponce(200, "Review fetched successfully", review));
});

const updateReviewById = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, comment, images } = req.body;

    let review = await BusinessReview.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }
    if(rating) review.rating = rating;
    if(comment) review.comment = comment;
    
    // If new images are provided, upload them to Cloudinary
    const uploadedImageUrls = [];
    try {
        for (const file of req.files) {
            const uploadResult = await uploadOnCloudinary(file.path);
            if (uploadResult && uploadResult.secure_url) {
                uploadedImageUrls.push(uploadResult.secure_url);
            }
        }
      // do not delete old images, just append new images
      review.images = review.images.concat(uploadedImageUrls);
      await review.save();
      res
        .status(200)
        .json(new ApiResponce(200, "Review updated successfully", review));  

    } catch (error) {
      throw new ApiError(500, "Error updating review");
    }

});

const deleteReviewById = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await BusinessReview.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Delete images from Cloudinary
    try {
      for (const imageUrl of review.images) {
        await deleteFromCloudinary(imageUrl);
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }

    await review.remove();
    res
      .status(200)
      .json(new ApiResponce(200, "Review deleted successfully", null));
});

export {
  addReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
