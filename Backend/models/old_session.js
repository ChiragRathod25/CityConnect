// import mongoose from "mongoose";

// // Session Schema - Updated for hybrid JWT + Session approach
// const sessionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
  
//   // Remove accessToken from DB since it's stored in Redis
//   // accessToken stored in Redis as: "access_token:{userId}:{deviceId}"
  
//   refreshToken: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
  
//   // Remove accessTokenExpiresAt since Redis handles TTL automatically
  
//   refreshTokenExpiresAt: {
//     type: Date,
//     required: true,
//     index: { expireAfterSeconds: 0 } // MongoDB TTL index
//   },
  
//   deviceInfo: {
//     deviceId: {
//       type: String,
//       required: true,
//       index: true // For logout all devices functionality
//     },
//     userAgent: String,
//     ip: {
//       type: String,
//       required: true,
//       index: true
//     },
//     browser: String,
//     os: String,
//     device: String,
//     location: {
//       country: String,
//       city: String,
//       timezone: String,
//       latitude: Number,
//       longitude: Number
//     },
//   },
  
 
  
  
  
  
// }, {
//   timestamps: true
// });

// // Compound indexes for better performance
// sessionSchema.index({ userId: 1, isActive: 1 });
// sessionSchema.index({ userId: 1, 'deviceInfo.deviceId': 1 });
// sessionSchema.index({ refreshTokenExpiresAt: 1 }); // For cleanup









// const Session = mongoose.model("Session", sessionSchema);

// // Audit Log Schema for security tracking
// const auditLogSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     index: true
//   },
  
//   action: {
//     type: String,
//     required: true,
//     enum: [
//       'login_attempt',
//       'login_success',
//       'login_failed',
//       'logout',
//       'logout_all_devices',
//       'password_change',
//       'password_reset_request',
//       'password_reset_success',
//       'email_verification_sent',
//       'email_verification_success',
//       'phone_verification_sent',
//       'phone_verification_success',
//       '2fa_enabled',
//       '2fa_disabled',
//       '2fa_attempt',
//       '2fa_success',
//       '2fa_failed',
//       'account_blocked',
//       'account_unblocked',
//       'profile_updated',
//       'refresh_token_used',
//       'suspicious_activity',
//       'data_export_request'
//     ],
//     index: true
//   },
  
//   ipAddress: {
//     type: String,
//     required: true,
//     index: true
//   },
  
//   userAgent: {
//     type: String
//   },
  
//   deviceId: {
//     type: String,
//     index: true
//   },
  
//   success: {
//     type: Boolean,
//     required: true,
//     index: true
//   },
  
//   details: {
//     type: mongoose.Schema.Types.Mixed
//   },
  
//   riskLevel: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'critical'],
//     default: 'low',
//     index: true
//   },
  
//   location: {
//     country: String,
//     city: String,
//     latitude: Number,
//     longitude: Number
//   }
// }, {
//   timestamps: true
// });

// // TTL index to auto-delete old audit logs after 90 days
// auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// // Email Template Schema for customizable emails
// const emailTemplateSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     required: true,
//     unique: true,
//     enum: [
//       'email_verification',
//       'phone_verification',
//       'password_reset',
//       '2fa_code',
//       'login_alert',
//       'account_locked',
//       'suspicious_activity',
//       'welcome'
//     ]
//   },
  
//   subject: {
//     type: String,
//     required: true
//   },
  
//   htmlTemplate: {
//     type: String,
//     required: true
//   },
  
//   textTemplate: {
//     type: String,
//     required: true
//   },
  
//   variables: [{
//     name: String,
//     description: String,
//     required: Boolean
//   }],
  
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

// // Security Settings Schema for global configuration
// const securitySettingsSchema = new mongoose.Schema({
//   key: {
//     type: String,
//     required: true,
//     unique: true
//   },
  
//   value: {
//     type: mongoose.Schema.Types.Mixed,
//     required: true
//   },
  
//   description: {
//     type: String
//   },
  
//   category: {
//     type: String,
//     enum: ['auth', 'rate_limiting', 'security', 'email', 'sms', 'general'],
//     default: 'general'
//   }
// }, {
//   timestamps: true
// });

// const SecuritySettings = mongoose.model('SecuritySettings', securitySettingsSchema);

// // Admin Activity Log Schema
// const adminActivitySchema = new mongoose.Schema({
//   adminId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
  
//   targetUserId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     index: true
//   },
  
//   action: {
//     type: String,
//     required: true,
//     enum: [
//       'block_user',
//       'unblock_user',
//       'reset_password',
//       'force_logout',
//       'view_audit_logs',
//       'export_user_data',
//       'update_security_settings',
//       'view_user_profile',
//       'delete_user_data'
//     ],
//     index: true
//   },
  
//   ipAddress: {
//     type: String,
//     required: true
//   },
  
//   userAgent: {
//     type: String
//   },
  
//   details: {
//     type: mongoose.Schema.Types.Mixed
//   },
  
//   success: {
//     type: Boolean,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// // TTL index to auto-delete old admin logs after 1 year
// adminActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // 1 year

// const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);

// export {
//   Session,
//   AuditLog,
//   EmailTemplate,
//   SecuritySettings,
//   AdminActivity
// };






// // import mongoose from "mongoose";

// // const sessionSchema = new mongoose.Schema({
// //   userId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true,
// //     index: true
// //   },
  
// //   accessToken: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     index: true
// //   },
  
// //   refreshToken: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     index: true
// //   },
  
// //   accessTokenExpiresAt: {
// //     type: Date,
// //     required: true,
// //     index: true
// //   },
  
// //   refreshTokenExpiresAt: {
// //     type: Date,
// //     required: true,
// //     index: { expireAfterSeconds: 0 }
// //   },
  
// //   deviceInfo: {
// //     userAgent: String,
// //     ip: {
// //       type: String,
// //       required: true,
// //       index: true
// //     },
// //     browser: String,
// //     os: String,
// //     device: String,
// //     location: {
// //         country: String,
// //         city: String,
// //         timezone: String,
// //       },
// //   },
  
// //   isActive: {
// //     type: Boolean,
// //     default: true,
// //     index: true
// //   },
  
// //   lastAccessedAt: {
// //     type: Date,
// //     default: Date.now,
// //     index: true
// //   }
// // }, {
// //   timestamps: true
// // });

// // //! Index for faster queries
// // sessionSchema.index({ userId: 1, isActive: 1 });
// // sessionSchema.index({ refreshToken: 1 });

// // const Session = mongoose.model("Session", sessionSchema);

// // export default Session;