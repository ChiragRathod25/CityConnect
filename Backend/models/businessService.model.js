import mongoose from "mongoose";

const { Schema } = mongoose;
const BusinessServiceSchema = new Schema(
  
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String, // e.g. "30 mins", "2 hours"
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ["onsite", "offsite", "remote"],
      default: "onsite",
    },
    availability: {
      type: String, // e.g. "Mon–Fri 9AM–6PM"
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    
    warrantyDays: {
      type: Number,
      enum: [0, 7, 15, 30],
      default: 0,
    },
    cancellationPolicy: {
      type: String,
      enum: ["no-cancel", "24hr", "48hr", "flexible"],
      default: "flexible",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const BusinessService = mongoose.model(
  "BusinessService",
  BusinessServiceSchema
);
