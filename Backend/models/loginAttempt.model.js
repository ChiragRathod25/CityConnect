import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    ip: {
      type: String,
      required: true,
      index: true,
    },

    userAgent: {
      type: String,
    },

    success: {
      type: Boolean,
      default: false,
      index: true,
    },

    reason: {
      type: String,
      enum: [
        "invalid_credentials",
        "account_locked",
        "account_blocked",
        "email_not_verified",
        "two_factor_required",
        "success",
      ],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performance
loginAttemptSchema.index({ ip: 1, createdAt: -1 });
loginAttemptSchema.index({ identifier: 1, success: 1, createdAt: -1 });

// Auto-delete after 30 days
loginAttemptSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

// Static method to check IP rate limiting
loginAttemptSchema.statics.checkIPRateLimit = async function (
  ip,
  timeWindow = 15 * 60 * 1000
) {
  const recentAttempts = await this.countDocuments({
    ip: ip,
    success: false,
    createdAt: { $gt: new Date(Date.now() - timeWindow) },
  });

  return recentAttempts >= 5; // Block IP after 5 failed attempts in 15 minutes
};

// Static method to log attempt
loginAttemptSchema.statics.logAttempt = async function (data) {
  return this.create({
    identifier: data.identifier,
    ip: data.ip,
    userAgent: data.userAgent,
    success: data.success,
    reason: data.reason,
    userId: data.userId || null,
  });
};

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;