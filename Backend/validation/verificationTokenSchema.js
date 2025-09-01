import {z} from 'zod';

const VerificationTokenZodSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  token: z.string().min(4, "Token must be at least 4 characters"),
  type: z.enum(['email_verification', 'phone_verification', 'password_reset', 'two_factor']),
  attempts: z.number().min(0).max(3).default(0),
  expiresAt: z.date()
});

export default VerificationTokenZodSchema;