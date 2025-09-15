import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Generate session ID for temporary storage
export const generateSessionId = () => {
  return `temp_reg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Store temporary registration data
export const storeTempData = async (sessionId, data, ttl = 600) => { // 10 minutes TTL
  const key = `temp_registration:${sessionId}`;
  await redis.set(key, JSON.stringify(data), { ex: ttl });
  return sessionId;
};

// Get temporary registration data
export const getTempData = async (sessionId) => {
  const key = `temp_registration:${sessionId}`;
  const rawData = await redis.get(key);
  
  if (!rawData) return null;
  
  // Check if it's already an object (auto-parsed by Redis client)
  if (typeof rawData === 'object') {
    return rawData;
  }
  
  // Only parse if it's a string
  if (typeof rawData === 'string') {
    return JSON.parse(rawData);
  }
  
  return rawData;
};

// Update verification status in temp data
export const updateVerificationStatus = async (sessionId, field, value) => {
  const tempData = await getTempData(sessionId);
  if (!tempData) return null;
  
  tempData.verificationStatus = {
    ...tempData.verificationStatus,
    [field]: value
  };
  
  await storeTempData(sessionId, tempData);
  return tempData;
};

// Check if both verifications are complete
export const isFullyVerified = async (sessionId) => {
  const tempData = await getTempData(sessionId);
  if (!tempData) return false;
  
  const { verificationStatus } = tempData;
  return verificationStatus?.emailVerified && verificationStatus?.phoneVerified;
};

// Clean up temporary data
export const cleanupTempData = async (sessionId) => {
  const key = `temp_registration:${sessionId}`;
  await redis.del(key);
};

// Store OTP with session ID instead of user ID
export const storeOTP = async (sessionId, otp, type, ttl = 120) => { // 120 seconds
  const key = `otp:${sessionId}:${type}`;
  await redis.set(key, otp, { ex: ttl });
};

// Verify OTP for session
export const verifyOTP = async (sessionId, providedOtp, type) => {
  const key = `otp:${sessionId}:${type}`;
  const storedOtp = await redis.get(key);
  
  if (!storedOtp || JSON.stringify(storedOtp) !== providedOtp) {
    return false;
  }
  
  // Delete used OTP
  await redis.del(key);
  return true;
};

// Check rate limiting for OTP requests
export const checkRateLimit = async (sessionId, type) => {
  const key = `rate_limit:${sessionId}:${type}`;
  const exists = await redis.exists(key);
  
  if (exists) {
    const ttl = await redis.ttl(key);
    return { limited: true, remainingTime: ttl };
  }
  
  // Set rate limit (120 seconds)
  await redis.set(key, '1', { ex: 120 });
  return { limited: false, remainingTime: 0 };
};

export default redis;