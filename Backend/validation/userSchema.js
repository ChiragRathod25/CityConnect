import { z } from "zod";

const UserZodSchema = z.object({
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
  
  role: z.enum(['user', 'businessman', 'admin']).default('user'),
  
  image: z.string().url("Invalid image URL").optional(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  
  dateOfBirth: z.date().optional(),
  
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  isTwoFactorEnabled: z.boolean().default(false),
  isBlocked: z.boolean().default(false),
  
  lastLogin: z.date().optional(),
  failedLoginAttempts: z.number().min(0).max(5).default(0),
  lockUntil: z.date().optional()
});

export default UserZodSchema;
