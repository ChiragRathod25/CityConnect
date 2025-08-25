import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    token: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "email_verification",
        "phone_verification",
        "password_reset",
        "two_factor",
      ],
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
verificationTokenSchema.index({ userId: 1, type: 1 });
verificationTokenSchema.index({ token: 1, type: 1 });

// Static method to generate token
verificationTokenSchema.statics.generateToken = function (type) {
  const crypto = require("crypto");
  switch (type) {
    case "email_verification":
    case "two_factor":
    case "password_reset":
      return crypto.randomInt(100000, 999999).toString(); // 6-digit code
    case "phone_verification":
      return crypto.randomInt(1000, 9999).toString(); // 4-digit code
    default:
      return crypto.randomBytes(32).toString("hex");
  }
};

// Method to check if token is expired
verificationTokenSchema.methods.isExpired = function () {
  return Date.now() > this.expiresAt;
};

// Method to increment attempts
verificationTokenSchema.methods.incrementAttempts = async function () {
  this.attempts += 1;
  return this.save();
};

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
