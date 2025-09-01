import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    refreshTokenExpiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },

    deviceInfo: {
      deviceId: {
        type: String,
        required: true,
        index: true, // For logout all devices functionality
      },
      userAgent: String,
      ip: {
        type: String,
        required: true,
        index: true,
      },
      browser: String,
      os: String,
      device: String,
      location: {
        country: String,
        city: String,
        timezone: String,
        latitude: Number,
        longitude: Number,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    //   // Additional security fields
    //   loginMethod: {
    //     type: String,
    //     enum: ['password', '2fa', 'social'],
    //     required: true
    //   },

    //   riskScore: {
    //     type: Number,
    //     min: 0,
    //     max: 100,
    //     default: 0
    //   },

    //   // Track if this session was created after 2FA
    //   is2FAVerified: {
    //     type: Boolean,
    //     default: false
    //   }
  },
  { timestamps: true }
);


// Method to deactivate session
sessionSchema.methods.deactivate = async function() {
  this.isActive = false;
  return this.save();
};


// Static method to cleanup expired sessions
sessionSchema.statics.cleanupExpired = async function() {
  return this.deleteMany({
    $or: [
      { refreshTokenExpiresAt: { $lt: new Date() } },
      { isActive: false, updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Remove inactive sessions after 7 days
    ]
  });
};


// Static method to get user's active sessions
sessionSchema.statics.getUserActiveSessions = async function(userId) {
  return this.find({
    userId,
    isActive: true,
    refreshTokenExpiresAt: { $gt: new Date() }
  }).sort({ lastAccessedAt: -1 });
};


// Static method to logout all devices for a user
sessionSchema.statics.logoutAllDevices = async function(userId) {
  return this.updateMany(
    { userId, isActive: true },
    { 
      $set: { 
        isActive: false,
        updatedAt: new Date()
      }
    }
  );
};

export const Session = mongoose.model("Session", sessionSchema);



