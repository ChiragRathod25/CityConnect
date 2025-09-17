import {z} from "zod"

// Registration validation schema
const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  email: z.string()
    .email("Invalid email format")
    .toLowerCase(),
  
  password: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits"),
  
  confirmPassword: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits"),
  
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  role: z.enum(['user', 'business']).default('user'),
  
  dateOfBirth: z.string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  
  agreeToTerms: z.boolean()
    .refine(val => val === true, "You must agree to the terms and conditions")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Login validation schema
const loginSchema = z.object({
  identifier: z.string()
    .min(1, "Email or username is required")
    .trim(),
  
  password: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits")
});

// Email verification schema
const emailVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
  token: z.string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers")
});

// Phone verification schema
const phoneVerificationSchema = z.object({
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  token: z.string()
    .length(4, "Verification code must be 4 digits")
    .regex(/^\d{4}$/, "Verification code must contain only numbers")
});

// Two-factor authentication schema
const twoFactorSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  token: z.string()
    .length(6, "Two-factor code must be 6 digits")
    .regex(/^\d{6}$/, "Two-factor code must contain only numbers")
});

// Password reset request schema
const forgotPasswordSchema = z.object({
  identifier: z.string()
    .min(1, "Email or phone number is required")
    .trim(),
  method: z.enum(['email', 'phone']).default('email')
});

// Password reset verification schema
const resetPasswordSchema = z.object({
  token: z.string()
    .length(6, "Reset code must be 6 digits")
    .regex(/^\d{6}$/, "Reset code must contain only numbers"),
  
  identifier: z.string()
    .min(1, "Email or phone is required"),
  
  password: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits"),
  
  confirmPassword: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string()
    .length(6, "Current password must be 6 digits")
    .regex(/^\d{6}$/, "Current password must contain only 6 digits"),
  
  newPassword: z.string()
    .length(6, "New password must be exactly 6 digits")
    .regex(/^\d{6}$/, "New password must contain only 6 digits"),
  
  confirmPassword: z.string()
    .length(6, "Password must be exactly 6 digits")
    .regex(/^\d{6}$/, "Password must contain only 6 digits")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Update profile schema
const updateProfileSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim()
    .optional(),
  
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim()
    .optional(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  dateOfBirth: z.string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  
  image: z.string().url("Invalid image URL").optional()
});

// Refresh token schema
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

// Resend verification schema
const resendVerificationSchema = z.object({
  type: z.enum(['email', 'phone']),
  identifier: z.string().min(1, "Email or phone number is required")
});

// Admin schemas for user management
const blockUserSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  reason: z.string().min(1, "Block reason is required").optional()
});

const unblockUserSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
});

// MongoDB ObjectId validation schema
const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
});

export {
    loginSchema,
    registerSchema,
    emailVerificationSchema,
    phoneVerificationSchema,
    twoFactorSchema,

    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
    refreshTokenSchema,
    resendVerificationSchema,
    
    blockUserSchema,
    unblockUserSchema,
    objectIdSchema
}