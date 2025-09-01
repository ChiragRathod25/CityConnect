import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["email_verification", "phone_verification", "password_reset"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index to auto-delete expired OTPs
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

// Static method to create and save a new OTP
OTPSchema.statics.createOTP = async function (userId, otp, purpose, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const otpEntry = new this({ userId, otp, purpose, expiresAt });
    return await otpEntry.save();
  };
    
    // Static method to verify an OTP
OTPSchema.statics.verifyOTP = async function (userId, otp, purpose) {
    const otpEntry = await this.findOne({ userId, otp, purpose, isUsed: false });
    if (!otpEntry) {
      return false;
    }
    if (otpEntry.expiresAt < new Date()) {
      return false;
    }
    otpEntry.isUsed = true;
    await otpEntry.save();
    return true;
  }
;

export const OTP = mongoose.model("OTP", OTPSchema);