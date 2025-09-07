import mongoose from "mongoose";
import { User } from "./user.model.js";

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["product", "service", "both"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "restaurant",
        "cafe",
        "gym",
        "salon",
        "transport",
        "education",
        "medical",
        "shopping",
        "entertainment",
        "services",
        "other",
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    
    //media
    logo: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
   

    //business details
    establishedYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear(),
    },
    numberOfEmployees: {
        type: Number,
        min: 1,
    },
    annualRevenue: {
        type: Number,
        min: 0,
    },
    
    //business status
    status: {
        type: String,
        enum: ["pending", "active", "suspended", "closed"],
        default: "pending",
        index: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    verifiedAt: {
        type: Date,
    },
    rejectedReason: {
        type: String,
        default: null,
    },
   

  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
