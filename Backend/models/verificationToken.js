import mongoose from "mongoose";

// Note: All verification codes (email, phone, password reset, 2FA) are now in Redis
// This schema is only for rare, long-lived secure tokens

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
      unique: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "account_recovery", // Long account recovery process
        "delete_account", // Account deletion confirmation  
        "data_export", // GDPR data export tokens
        "admin_override", // Emergency admin access tokens
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

    // Additional security fields
    ipAddress: {
      type: String,
      index: true
    },

    userAgent: {
      type: String
    },

    isUsed: {
      type: Boolean,
      default: false,
      index: true
    },

    usedAt: {
      type: Date
    },

    // Extra security for sensitive operations
    requiresAdminApproval: {
      type: Boolean,
      default: false
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

// Compound indexes
verificationTokenSchema.index({ userId: 1, type: 1 });
verificationTokenSchema.index({ token: 1, type: 1 });
verificationTokenSchema.index({ userId: 1, isUsed: 1 });

// Static method to generate secure token
verificationTokenSchema.statics.generateToken = function (type) {
  const crypto = require("crypto");
  // All tokens are secure 64-character hex strings
  return crypto.randomBytes(32).toString("hex");
};

// Static method to create token with expiry
verificationTokenSchema.statics.createToken = async function (data) {
  const { userId, email, phone, type, ipAddress, userAgent } = data;
  
  // Set appropriate expiry based on type
  let expiresAt;
  switch (type) {
    case "account_recovery":
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      break;
    case "delete_account":
      expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      break;
    case "data_export":
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      break;
    case "admin_override":
      expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      break;
    default:
      expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  }

  // Remove any existing unused tokens of same type for user
  await this.deleteMany({ 
    userId, 
    type, 
    isUsed: false 
  });

  return this.create({
    userId,
    email,
    phone,
    token: this.generateToken(type),
    type,
    expiresAt,
    ipAddress,
    userAgent,
    requiresAdminApproval: type === 'admin_override'
  });
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

// Method to mark as used
verificationTokenSchema.methods.markAsUsed = async function () {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

// Static method to verify and use token
verificationTokenSchema.statics.verifyAndUse = async function (token, type, userId = null) {
  const query = { 
    token, 
    type, 
    isUsed: false,
    expiresAt: { $gt: new Date() }
  };
  
  if (userId) {
    query.userId = userId;
  }

  const tokenDoc = await this.findOne(query);
  
  if (!tokenDoc) {
    return { success: false, error: 'Invalid or expired token' };
  }

  if (tokenDoc.attempts >= 3) {
    return { success: false, error: 'Too many attempts' };
  }

  // Check admin approval if required
  if (tokenDoc.requiresAdminApproval && !tokenDoc.approvedBy) {
    return { success: false, error: 'Requires admin approval' };
  }

  // Mark as used
  await tokenDoc.markAsUsed();
  
  return { 
    success: true, 
    userId: tokenDoc.userId,
    email: tokenDoc.email,
    phone: tokenDoc.phone 
  };
};

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken ;






// import mongoose from "mongoose";

// const verificationTokenSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     email: {
//       type: String,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     token: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     type: {
//       type: String,
//       required: true,
//       enum: [
//         "email_verification",
//         "phone_verification",
//         "password_reset",
//         "two_factor",
//       ],
//       index: true,
//     },

//     attempts: {
//       type: Number,
//       default: 0,
//       max: 3,
//     },

//     expiresAt: {
//       type: Date,
//       required: true,
//       index: { expireAfterSeconds: 0 },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compound indexes
// verificationTokenSchema.index({ userId: 1, type: 1 });
// verificationTokenSchema.index({ token: 1, type: 1 });

// // Static method to generate token
// verificationTokenSchema.statics.generateToken = function (type) {
//   const crypto = require("crypto");
//   switch (type) {
//     case "email_verification":
//     case "two_factor":
//     case "password_reset":
//       return crypto.randomInt(100000, 999999).toString(); // 6-digit code
//     case "phone_verification":
//       return crypto.randomInt(1000, 9999).toString(); // 4-digit code
//     default:
//       return crypto.randomBytes(32).toString("hex");
//   }
// };

// // Method to check if token is expired
// verificationTokenSchema.methods.isExpired = function () {
//   return Date.now() > this.expiresAt;
// };

// // Method to increment attempts
// verificationTokenSchema.methods.incrementAttempts = async function () {
//   this.attempts += 1;
//   return this.save();
// };

// const VerificationToken = mongoose.model(
//   "VerificationToken",
//   verificationTokenSchema
// );

// export default VerificationToken;
