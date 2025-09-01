const { z } = require('zod');

const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must not exceed 254 characters')
  .toLowerCase()
  .trim();

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in international format (+1234567890)')
  .min(8, 'Phone number too short')
  .max(16, 'Phone number too long');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one number')
  .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?])/, 'Password must contain at least one special character');

const nameSchema = z
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')
  .trim();

const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only numbers');

const roleSchema = z
  .enum(['user', 'seller', 'admin'], {
    errorMap: () => ({ message: 'Role must be user, seller, or admin' })
  });

const ipAddressSchema = z
  .string()
  .regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, 'Invalid IP address format');

// ================== AUTHENTICATION SCHEMAS ==================

// 1. REGISTRATION SCHEMA
const registrationSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  name: nameSchema,
  password: passwordSchema,
  role: roleSchema.optional().default('user')
}).strict();

// 2. LOGIN SCHEMA
const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, 'Email or phone required')
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password too long')
}).strict()
.refine(
  (data) => {
    // Check if identifier is email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return emailRegex.test(data.identifier) || phoneRegex.test(data.identifier);
  },
  {
    message: 'Identifier must be a valid email or phone number in international format',
    path: ['identifier']
  }
);

// 3. OTP VERIFICATION SCHEMA
const otpVerificationSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or phone is required'),
  otp: otpSchema,
  type: z
    .enum(['registration', 'login', 'password_reset', '2fa'], {
      errorMap: () => ({ message: 'Invalid OTP type' })
    })
}).strict()
.refine(
  (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return emailRegex.test(data.identifier) || phoneRegex.test(data.identifier);
  },
  {
    message: 'Identifier must be a valid email or phone number',
    path: ['identifier']
  }
);

// 4. PASSWORD RESET REQUEST SCHEMA
const passwordResetRequestSchema = z.object({
  email: emailSchema
}).strict();

// 5. PASSWORD RESET CONFIRM SCHEMA
const passwordResetConfirmSchema = z.object({
  token: z
    .string()
    .min(1, 'Reset token is required')
    .max(256, 'Invalid token format'),
  newPassword: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, 'Password confirmation is required')
}).strict()
.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

// 6. CHANGE PASSWORD SCHEMA
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required')
    .max(128, 'Password too long'),
  newPassword: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, 'Password confirmation is required')
}).strict()
.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'New passwords do not match',
    path: ['confirmPassword']
  }
)
.refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'New password must be different from current password',
    path: ['newPassword']
  }
);

// 7. REFRESH TOKEN SCHEMA
const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
    .max(512, 'Invalid token format')
}).strict();

// 8. DEVICE INFO SCHEMA
const deviceInfoSchema = z.object({
  userAgent: z
    .string()
    .max(512, 'User agent too long')
    .optional(),
  platform: z
    .string()
    .max(50, 'Platform name too long')
    .optional(),
  browser: z
    .string()
    .max(50, 'Browser name too long')
    .optional(),
  version: z
    .string()
    .max(20, 'Version too long')
    .optional(),
  mobile: z
    .boolean()
    .optional()
}).optional();

// ================== ADMIN/SELLER CONTROL SCHEMAS ==================

// 9. USER BLOCK SCHEMA
const userBlockSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  reason: z
    .string()
    .min(10, 'Block reason must be at least 10 characters')
    .max(500, 'Block reason must not exceed 500 characters')
    .trim(),
  duration: z
    .enum(['temporary', 'permanent'], {
      errorMap: () => ({ message: 'Duration must be temporary or permanent' })
    }).optional().default('permanent')
}).strict();

// 10. USER UNBLOCK SCHEMA
const userUnblockSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  reason: z
    .string()
    .min(5, 'Unblock reason must be at least 5 characters')
    .max(500, 'Unblock reason must not exceed 500 characters')
    .trim()
}).strict();

// ================== PROFILE UPDATE SCHEMAS ==================

// 11. PROFILE UPDATE SCHEMA
const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  // Note: Email and phone changes require separate verification flows
}).strict();

// 12. EMAIL CHANGE REQUEST SCHEMA
const emailChangeRequestSchema = z.object({
  newEmail: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required for email change')
    .max(128, 'Password too long')
}).strict();

// 13. PHONE CHANGE REQUEST SCHEMA
const phoneChangeRequestSchema = z.object({
  newPhone: phoneSchema,
  password: z
    .string()
    .min(1, 'Password is required for phone change')
    .max(128, 'Password too long')
}).strict();

// ================== 2FA SCHEMAS ==================

// 14. 2FA SETUP SCHEMA
const twoFASetupSchema = z.object({
  method: z
    .enum(['email', 'phone', 'both'], {
      errorMap: () => ({ message: '2FA method must be email, phone, or both' })
    }),
  password: z
    .string()
    .min(1, 'Password is required for 2FA setup')
    .max(128, 'Password too long')
}).strict();

// 15. 2FA VERIFY SCHEMA
const twoFAVerifySchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(128, 'Invalid session ID format'),
  emailOTP: otpSchema.optional(),
  phoneOTP: otpSchema.optional()
}).strict()
.refine(
  (data) => data.emailOTP || data.phoneOTP,
  {
    message: 'At least one OTP (email or phone) is required',
    path: ['emailOTP']
  }
);

// ================== QUERY VALIDATION SCHEMAS ==================

// 16. PAGINATION SCHEMA
const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('20')
});

// 17. AUDIT LOG FILTER SCHEMA
const auditLogFilterSchema = z.object({
  action: z
    .enum([
      'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'LOGOUT_ALL',
      'REGISTER', 'EMAIL_VERIFY', 'PHONE_VERIFY',
      'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS',
      '2FA_ENABLE', '2FA_DISABLE', '2FA_VERIFY_SUCCESS', '2FA_VERIFY_FAILED',
      'ACCOUNT_BLOCKED', 'ACCOUNT_UNBLOCKED',
      'TOKEN_REFRESH', 'TOKEN_REVOKED',
      'PROFILE_UPDATE', 'PASSWORD_CHANGE'
    ])
    .optional(),
  startDate: z
    .string()
    .datetime('Invalid start date format')
    .optional(),
  endDate: z
    .string()
    .datetime('Invalid end date format')
    .optional(),
  ipAddress: ipAddressSchema.optional()
}).merge(paginationSchema);

// 18. USER SEARCH SCHEMA
const userSearchSchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query too long')
    .optional(),
  role: roleSchema.optional(),
  status: z
    .enum(['active', 'blocked', 'suspended'])
    .optional(),
  verified: z
    .string()
    .regex(/^(true|false)$/, 'Verified must be true or false')
    .transform(val => val === 'true')
    .optional()
}).merge(paginationSchema);

// ================== MIDDLEWARE VALIDATION HELPERS ==================

// Validation middleware wrapper
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : 
                   source === 'params' ? req.params :
                   source === 'query' ? req.query : req[source];
      
      const result = schema.safeParse(data);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      
      // Replace the original data with validated data
      if (source === 'body') req.body = result.data;
      else if (source === 'params') req.params = result.data;
      else if (source === 'query') req.query = result.data;
      else req[source] = result.data;
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
  };
};

// Custom validation for MongoDB ObjectId
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// JWT Token validation
const jwtTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Invalid JWT token format');

export default  {
  // Common validators
  emailSchema,
  phoneSchema,
  passwordSchema,
  nameSchema,
  otpSchema,
  roleSchema,
  ipAddressSchema,
  objectIdSchema,
  jwtTokenSchema,
  
  // Authentication schemas
  registrationSchema,
  loginSchema,
  otpVerificationSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  changePasswordSchema,
  refreshTokenSchema,
  deviceInfoSchema,
  
  // Admin/Seller control schemas
  userBlockSchema,
  userUnblockSchema,
  
  // Profile update schemas
  profileUpdateSchema,
  emailChangeRequestSchema,
  phoneChangeRequestSchema,
  
  // 2FA schemas
  twoFASetupSchema,
  twoFAVerifySchema,
  
  // Query validation schemas
  paginationSchema,
  auditLogFilterSchema,
  userSearchSchema,
  
  // Middleware helper
  validateRequest
};