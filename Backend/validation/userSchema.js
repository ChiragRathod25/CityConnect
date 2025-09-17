import { z } from "zod";

const UserZodSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters long"),

  role: z.enum(["user", "business", "admin"]).default("user"),

  image: z.string().url("Invalid image URL").optional(),

  phoneNumber: z.string().regex(/^\d{10}$/, "phoneNumber number must be exactly 10 digits"),


  dateOfBirth: z.date().optional(),

  status: z.enum(["pending_verification", "active", "suspended", "blocked"]).default("pending_verification"),

  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
   emailVerifiedAt: z.date().optional(),
  phoneVerifiedAt: z.date().optional(),

  lastLoginAt: z.date().optional(),
  failedLoginAttempts: z.number().min(0).max(3).default(0),
  lockUntil: z.date().optional(),
  isLocked: z.boolean().default(false)
});

export const SignupSchema = UserZodSchema.pick({
  username: true,
  phoneNumber: true,
  email: true,
  password: true,
  role: true,
});

export const LoginSchema = UserZodSchema.pick({
  email: true,
  password: true,
});

export default UserZodSchema;
