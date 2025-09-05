import mongoose from "mongoose";

const businessContactSchema = new mongoose.Schema(
  {
    businessid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    socialMedia: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      youtube: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const BusinessContact = mongoose.model(
  "BusinessContact",
  businessContactSchema
);
