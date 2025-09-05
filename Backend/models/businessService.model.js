import mongoose from "mongoose";

const businessServiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number, // in minutes (optional)
    },
    category: {
      type: String, // e.g. Haircare, Fitness, Consultation
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BusinessService = mongoose.model(
  "BusinessService",
  businessServiceSchema
);

export default BusinessService;
