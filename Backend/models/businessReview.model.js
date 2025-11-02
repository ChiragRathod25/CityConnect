import mongoose from "mongoose";
const businessReviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    images:{
      type: [String],
    }
  },
  { timestamps: true }
);

export const BusinessReview = mongoose.model(
  "BusinessReview",
  businessReviewSchema
);
