import mongoose from "mongoose";
import { Business } from "./business.model";

const businessLocationSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    street: {
      type: String,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
  },
  { timestamps: true }
);

businessLocationSchema.index({ lat: 1, lng: 1 }, { type: "2dsphere" });

export const BusinessLocation = mongoose.model(
  "BusinessLocation",
  businessLocationSchema
);
