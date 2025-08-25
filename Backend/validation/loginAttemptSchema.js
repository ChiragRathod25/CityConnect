import {z} from 'zod';

const LoginAttemptZodSchema = z.object({
  identifier: z.string().min(1, "Email or username required"),
  ip: z.string().ip("Invalid IP address"),
  userAgent: z.string().optional(),
  success: z.boolean().default(false),
  reason: z.string().optional()
});

export default LoginAttemptZodSchema;