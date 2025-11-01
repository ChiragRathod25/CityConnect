import mongoose from "mongoose";

const businessHourSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    openTime: {
      type: String, // Format: "HH:MM"
    },
    closeTime: {
      type: String, // Format: "HH:MM"
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const BusinessHour = mongoose.model("BusinessHour", businessHourSchema);
