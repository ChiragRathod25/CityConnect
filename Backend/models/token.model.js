import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  deviceInfo: {
    userAgent: String,
    ip: String,
    deviceId: String,
    platform: String,
    browser: String
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for auto-cleanup
  }
}, {
  timestamps: true
});

// Indexes for better performance
tokenSchema.index({ userId: 1, isActive: 1 });
// tokenSchema.index({ refreshToken: 1 });
// tokenSchema.index({ sessionId: 1 });
// tokenSchema.index({ expiresAt: 1 });

// Clean up expired tokens
tokenSchema.statics.cleanExpiredTokens = async function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Get active sessions for a user
tokenSchema.statics.getActiveSessions = async function(userId) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).select('deviceInfo sessionId lastUsed createdAt');
};

// Revoke all sessions for a user
tokenSchema.statics.revokeAllSessions = async function(userId) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

// Revoke specific session
tokenSchema.statics.revokeSession = async function(sessionId) {
  return this.updateOne(
    { sessionId, isActive: true },
    { isActive: false }
  );
};

export const Token = mongoose.model('Token', tokenSchema);