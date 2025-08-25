import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  accessToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  refreshToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  accessTokenExpiresAt: {
    type: Date,
    required: true,
    index: true
  },
  
  refreshTokenExpiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  
  deviceInfo: {
    userAgent: String,
    ip: {
      type: String,
      required: true,
      index: true
    },
    browser: String,
    os: String,
    device: String,
    location: {
        country: String,
        city: String,
        timezone: String,
      },
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

//! Index for faster queries
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
