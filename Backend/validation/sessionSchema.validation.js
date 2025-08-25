import { z } from "zod";

const SessionZodSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  accessToken: z.string().min(1, "Access token is required"),
  refreshToken: z.string().min(1, "Refresh token is required"),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
  deviceInfo: z
    .object({
      userAgent: z.string().optional(),
      ip: z.string().ip().optional(),
      browser: z.string().optional(),
      os: z.string().optional(),
      device: z.string().optional(),
      location: z
        .object({
          country: z.string().optional(),
          city: z.string().optional(),
          timezone: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
  lastAccessedAt: z.date().optional(),
});

export default SessionZodSchema;
