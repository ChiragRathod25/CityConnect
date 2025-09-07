import mongoose from "mongoose";

const businessProductSchema = new mongoose.Schema(
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
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String, // e.g. Electronics, Food, Clothing
    },
    images: [
      {
        type: String, // URL or path to the image
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BusinessProduct = mongoose.model(
  "BusinessProduct",
  businessProductSchema
);
export default BusinessProduct;
