// // ================== MONGODB SCHEMAS ==================

// // 1. USER SCHEMA (Main user collection)
// const userSchema = {
//   _id: ObjectId,
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true // bcrypt hashed
//   },
//   role: {
//     type: String,
//     enum: ['user', 'seller', 'admin'],
//     default: 'user'
//   },
//   status: {
//     type: String,
//     enum: ['active', 'blocked', 'suspended'],
//     default: 'active'
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false
//   },
//   isPhoneVerified: {
//     type: Boolean,
//     default: false
//   },
//   is2FAEnabled: {
//     type: Boolean,
//     default: false
//   },
//   twoFactorMethod: {
//     type: String,
//     enum: ['email', 'phone', 'both'],
//     default: 'both'
//   },
//   // Security tracking
//   loginAttempts: {
//     type: Number,
//     default: 0
//   },
//   lockedUntil: Date,
//   lastLogin: Date,
//   lastLoginIP: String,
//   // Admin controls
//   blockedBy: {
//     type: ObjectId,
//     ref: 'User'
//   },
//   blockedAt: Date,
//   blockReason: String,
//   // Timestamps
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// };

// // 2. REGISTRATION DATA SCHEMA (Redis - temporary during verification)
// // Key: `registration:${email}` - Store registration data until both verifications complete
// const registrationDataRedis = {
//   key: "registration:user@example.com",
//   value: {
//     email: "user@example.com",
//     phone: "+1234567890",
//     name: "User Name",
//     password: "bcrypt_hashed_password",
//     role: "user|seller",
//     registrationIP: "ip_address",
//     userAgent: "user_agent",
//     emailVerified: false,
//     phoneVerified: false,
//     createdAt: "timestamp"
//   },
//   ttl: 1800 // 30 minutes to complete both verifications
// };

// // 3. REFRESH TOKEN SCHEMA (30 days)
// const refreshTokenSchema = {
//   _id: ObjectId,
//   userId: {
//     type: ObjectId,
//     ref: 'User',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   deviceInfo: {
//     userAgent: String,
//     platform: String,
//     browser: String,
//     version: String,
//     mobile: Boolean
//   },
//   ipAddress: {
//     type: String,
//     required: true
//   },
//   location: {
//     country: String,
//     city: String,
//     region: String
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastUsed: {
//     type: Date,
//     default: Date.now
//   },
//   // TTL - Auto delete after 30 days
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     expires: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// };

// // 4. RATE LIMITING SCHEMA (IP based)
// const rateLimitSchema = {
//   _id: ObjectId,
//   ipAddress: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   attempts: [{
//     timestamp: {
//       type: Date,
//       default: Date.now
//     },
//     endpoint: String,
//     userAgent: String,
//     success: Boolean
//   }],
//   blockedUntil: Date,
//   // TTL - Auto cleanup old records
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
//     expires: 0
//   }
// };

// // 5. AUDIT LOG SCHEMA
// const auditLogSchema = {
//   _id: ObjectId,
//   userId: {
//     type: ObjectId,
//     ref: 'User'
//   },
//   action: {
//     type: String,
//     required: true,
//     enum: [
//       'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'LOGOUT_ALL',
//       'REGISTER', 'EMAIL_VERIFY', 'PHONE_VERIFY',
//       'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS',
//       '2FA_ENABLE', '2FA_DISABLE', '2FA_VERIFY_SUCCESS', '2FA_VERIFY_FAILED',
//       'ACCOUNT_BLOCKED', 'ACCOUNT_UNBLOCKED',
//       'TOKEN_REFRESH', 'TOKEN_REVOKED',
//       'PROFILE_UPDATE', 'PASSWORD_CHANGE'
//     ]
//   },
//   details: {
//     type: Object,
//     default: {}
//   },
//   ipAddress: String,
//   userAgent: String,
//   deviceInfo: Object,
//   success: {
//     type: Boolean,
//     default: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   },
//   // TTL - Keep logs for 90 days
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//     expires: 0
//   }
// };

// // 6. USER SESSIONS SCHEMA (Active login sessions)
// const userSessionSchema = {
//   _id: ObjectId,
//   userId: {
//     type: ObjectId,
//     ref: 'User',
//     required: true
//   },
//   refreshTokenId: {
//     type: ObjectId,
//     ref: 'RefreshToken',
//     required: true
//   },
//   deviceInfo: {
//     userAgent: String,
//     platform: String,
//     browser: String,
//     version: String,
//     mobile: Boolean
//   },
//   ipAddress: String,
//   location: {
//     country: String,
//     city: String,
//     region: String
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastActivity: {
//     type: Date,
//     default: Date.now
//   },
//   loginAt: {
//     type: Date,
//     default: Date.now
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// };

// // ================== REDIS SCHEMAS (Key-Value Structure) ==================

// // 1. ACCESS TOKENS (15 minutes TTL)
// // Key: `access_token:${userId}:${deviceId}`
// // Value: JSON string
// const accessTokenRedis = {
//   key: "access_token:userId:deviceId",
//   value: {
//     token: "jwt_access_token",
//     userId: "user_id",
//     deviceId: "unique_device_id",
//     ipAddress: "ip_address",
//     expiresAt: "timestamp",
//     createdAt: "timestamp"
//   },
//   ttl: 900 // 15 minutes
// };

// // 3. OTP CODES (Email/Phone verification - 5 minutes TTL)
// // Key: `otp:${type}:${identifier}` (type: email/phone, identifier: email/phone)
// const otpRedis = {
//   key: "otp:email:user@example.com", // or "otp:phone:+1234567890"
//   value: {
//     code: "123456",
//     attempts: 0,
//     maxAttempts: 3,
//     createdAt: "timestamp",
//     purpose: "registration|login|password_reset|2fa" // Purpose of OTP
//   },
//   ttl: 300 // 5 minutes
// };

// // 4. PASSWORD RESET TOKENS (15 minutes TTL)
// // Key: `password_reset:${userId}`
// const passwordResetRedis = {
//   key: "password_reset:userId",
//   value: {
//     token: "reset_token_hash",
//     email: "user@example.com",
//     ipAddress: "ip_address",
//     createdAt: "timestamp"
//   },
//   ttl: 900 // 15 minutes
// };

// // 5. RATE LIMITING (Per IP - 15 minutes TTL)
// // Key: `rate_limit:${ipAddress}:${endpoint}`
// const rateLimitRedis = {
//   key: "rate_limit:192.168.1.1:login",
//   value: {
//     attempts: 3,
//     firstAttempt: "timestamp",
//     lastAttempt: "timestamp",
//     blockedUntil: "timestamp|null"
//   },
//   ttl: 900 // 15 minutes
// };

// // 6. 2FA PENDING VERIFICATION (5 minutes TTL)
// // Key: `2fa_pending:${userId}:${sessionId}`
// const twoFAPendingRedis = {
//   key: "2fa_pending:userId:sessionId",
//   value: {
//     userId: "user_id",
//     tempToken: "temporary_token",
//     method: "email|phone|both",
//     emailVerified: false,
//     phoneVerified: false,
//     ipAddress: "ip_address",
//     deviceInfo: "device_info",
//     createdAt: "timestamp"
//   },
//   ttl: 300 // 5 minutes
// };

// // 7. ACCOUNT LOCKOUT (2 hours TTL)
// // Key: `lockout:${userId}`
// const lockoutRedis = {
//   key: "lockout:userId",
//   value: {
//     attempts: 3,
//     lockedAt: "timestamp",
//     unlockAt: "timestamp",
//     ipAddresses: ["ip1", "ip2", "ip3"]
//   },
//   ttl: 7200 // 2 hours
// };

// // 8. ACTIVE USER SESSIONS (For quick session validation)
// // Key: `user_sessions:${userId}`
// const userSessionsRedis = {
//   key: "user_sessions:userId",
//   value: {
//     activeSessions: [
//       {
//         deviceId: "device_id",
//         refreshTokenId: "refresh_token_id",
//         ipAddress: "ip_address",
//         lastActivity: "timestamp",
//         deviceInfo: "device_info"
//       }
//     ],
//     totalSessions: 3,
//     lastUpdated: "timestamp"
//   },
//   ttl: 2592000 // 30 days (same as refresh token)
// };

// // 9. BLACKLISTED TOKENS (For logout functionality)
// // Key: `blacklist:${tokenId}`
// const blacklistedTokenRedis = {
//   key: "blacklist:tokenId",
//   value: {
//     userId: "user_id",
//     tokenType: "access|refresh",
//     blacklistedAt: "timestamp",
//     reason: "logout|security|admin_action"
//   },
//   ttl: 1800 // 30 minutes (longer than access token TTL)
// };

// // ================== INDEX CONFIGURATIONS ==================

// // MongoDB Indexes
// const mongoIndexes = {
//   // Users collection
//   users: [
//     { email: 1 }, // unique
//     { phone: 1 }, // unique
//     { status: 1 },
//     { lockedUntil: 1 },
//     { createdAt: 1 }
//   ],
  
//   // RefreshTokens collection
//   refreshTokens: [
//     { userId: 1 },
//     { token: 1 }, // unique
//     { expiresAt: 1 }, // TTL index
//     { ipAddress: 1 },
//     { isActive: 1 },
//     { userId: 1, isActive: 1 } // compound
//   ],
  
//   // RateLimit collection
//   rateLimits: [
//     { ipAddress: 1 }, // unique
//     { expiresAt: 1 }, // TTL index
//     { "attempts.timestamp": 1 }
//   ],
  
//   // AuditLogs collection
//   auditLogs: [
//     { userId: 1 },
//     { action: 1 },
//     { timestamp: -1 }, // descending
//     { expiresAt: 1 }, // TTL index
//     { userId: 1, timestamp: -1 }, // compound
//     { ipAddress: 1 }
//   ],
  
//   // UserSessions collection
//   userSessions: [
//     { userId: 1 },
//     { refreshTokenId: 1 },
//     { isActive: 1 },
//     { userId: 1, isActive: 1 }, // compound
//     { lastActivity: 1 }
//   ]
// };

// // Redis Key Naming Convention
// const redisKeyPatterns = {
//   registrationData: "registration:{email}",
//   accessToken: "access_token:{userId}:{deviceId}",
//   otp: "otp:{type}:{identifier}", // type: email/phone
//   passwordReset: "password_reset:{userId}",
//   rateLimit: "rate_limit:{ipAddress}:{endpoint}",
//   twoFAPending: "2fa_pending:{userId}:{sessionId}",
//   lockout: "lockout:{userId}",
//   userSessions: "user_sessions:{userId}",
//   blacklist: "blacklist:{tokenId}"
// };

// export default {
//   // MongoDB Schemas
//   userSchema,
//   refreshTokenSchema,
//   rateLimitSchema,
//   auditLogSchema,
//   userSessionSchema,
  
//   // Redis Schemas
//   registrationDataRedis,
//   accessTokenRedis,
//   otpRedis,
//   passwordResetRedis,
//   rateLimitRedis,
//   twoFAPendingRedis,
//   lockoutRedis,
//   userSessionsRedis,
//   blacklistedTokenRedis,
  
//   // Indexes and Patterns
//   mongoIndexes,
//   redisKeyPatterns
// };