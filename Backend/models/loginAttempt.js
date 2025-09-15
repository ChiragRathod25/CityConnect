// import mongoose from "mongoose";

// // Login Attempt Schema - Updated for Redis rate limiting
// const loginAttemptSchema = new mongoose.Schema(
//   {
//     identifier: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     ip: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     userAgent: {
//       type: String,
//     },

//     success: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     reason: {
//       type: String,
//       enum: [
//         "invalid_credentials",
//         "account_locked",
//         "account_blocked",
//         "email_not_verified",
//         "phone_not_verified",
//         "two_factor_required",
//         "two_factor_failed",
//         "rate_limit_exceeded",
//         "success",
//       ],
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       index: true,
//     },

//     // Additional tracking fields
//     deviceInfo: {
//       browser: String,
//       os: String,
//       device: String,
//     },

//     location: {
//       country: String,
//       city: String,
//       timezone: String,
//     },

//     riskLevel: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'critical'],
//       default: 'low',
//       index: true
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compound indexes for performance
// loginAttemptSchema.index({ ip: 1, createdAt: -1 });
// loginAttemptSchema.index({ identifier: 1, success: 1, createdAt: -1 });
// loginAttemptSchema.index({ userId: 1, success: 1, createdAt: -1 });

// // Auto-delete after 30 days
// loginAttemptSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 30 * 24 * 60 * 60 }
// );

// // Note: IP rate limiting is now handled by Redis, not this schema
// // This schema is only for logging and analytics purposes

// // Static method to log attempt (main purpose of this schema)
// loginAttemptSchema.statics.logAttempt = async function (data) {
//   return this.create({
//     identifier: data.identifier,
//     ip: data.ip,
//     userAgent: data.userAgent,
//     success: data.success,
//     reason: data.reason,
//     userId: data.userId || null,
//     deviceInfo: data.deviceInfo || {},
//     location: data.location || {},
//     riskLevel: data.riskLevel || 'low'
//   });
// };

// // Static method to get user login history
// loginAttemptSchema.statics.getUserLoginHistory = async function (userId, limit = 50) {
//   return this.find({ userId })
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .select('ip success reason createdAt deviceInfo location');
// };

// // Static method to get suspicious activities
// loginAttemptSchema.statics.getSuspiciousActivities = async function (timeWindow = 24 * 60 * 60 * 1000) {
//   return this.aggregate([
//     {
//       $match: {
//         createdAt: { $gt: new Date(Date.now() - timeWindow) },
//         success: false
//       }
//     },
//     {
//       $group: {
//         _id: "$ip",
//         failedAttempts: { $sum: 1 },
//         lastAttempt: { $max: "$createdAt" },
//         reasons: { $addToSet: "$reason" },
//         userIds: { $addToSet: "$userId" }
//       }
//     },
//     {
//       $match: {
//         failedAttempts: { $gte: 10 } // IPs with 10+ failed attempts
//       }
//     },
//     {
//       $sort: { failedAttempts: -1 }
//     }
//   ]);
// };

// // Static method to get login statistics
// loginAttemptSchema.statics.getLoginStats = async function (timeWindow = 24 * 60 * 60 * 1000) {
//   return this.aggregate([
//     {
//       $match: {
//         createdAt: { $gt: new Date(Date.now() - timeWindow) }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalAttempts: { $sum: 1 },
//         successfulLogins: {
//           $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] }
//         },
//         failedLogins: {
//           $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] }
//         },
//         uniqueIPs: { $addToSet: "$ip" },
//         uniqueUsers: { $addToSet: "$userId" }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         totalAttempts: 1,
//         successfulLogins: 1,
//         failedLogins: 1,
//         successRate: {
//           $multiply: [
//             { $divide: ["$successfulLogins", "$totalAttempts"] },
//             100
//           ]
//         },
//         uniqueIPCount: { $size: "$uniqueIPs" },
//         uniqueUserCount: { $size: "$uniqueUsers" }
//       }
//     }
//   ]);
// };

// const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);

// export default LoginAttempt ;









// // import mongoose from "mongoose";

// // const loginAttemptSchema = new mongoose.Schema(
// //   {
// //     identifier: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       index: true,
// //     },

// //     ip: {
// //       type: String,
// //       required: true,
// //       index: true,
// //     },

// //     userAgent: {
// //       type: String,
// //     },

// //     success: {
// //       type: Boolean,
// //       default: false,
// //       index: true,
// //     },

// //     reason: {
// //       type: String,
// //       enum: [
// //         "invalid_credentials",
// //         "account_locked",
// //         "account_blocked",
// //         "email_not_verified",
// //         "two_factor_required",
// //         "success",
// //       ],
// //     },

// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       index: true,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // // Compound indexes for performance
// // loginAttemptSchema.index({ ip: 1, createdAt: -1 });
// // loginAttemptSchema.index({ identifier: 1, success: 1, createdAt: -1 });

// // // Auto-delete after 30 days
// // loginAttemptSchema.index(
// //   { createdAt: 1 },
// //   { expireAfterSeconds: 30 * 24 * 60 * 60 }
// // );

// // // Static method to check IP rate limiting
// // loginAttemptSchema.statics.checkIPRateLimit = async function (
// //   ip,
// //   timeWindow = 15 * 60 * 1000
// // ) {
// //   const recentAttempts = await this.countDocuments({
// //     ip: ip,
// //     success: false,
// //     createdAt: { $gt: new Date(Date.now() - timeWindow) },
// //   });

// //   return recentAttempts >= 5; // Block IP after 5 failed attempts in 15 minutes
// // };

// // // Static method to log attempt
// // loginAttemptSchema.statics.logAttempt = async function (data) {
// //   return this.create({
// //     identifier: data.identifier,
// //     ip: data.ip,
// //     userAgent: data.userAgent,
// //     success: data.success,
// //     reason: data.reason,
// //     userId: data.userId || null,
// //   });
// // };

// // const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);

// // export default LoginAttempt;