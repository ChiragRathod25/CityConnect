// middleware/auth.js

import { User } from "../models/user.model.js";
import { sessionService } from "../services/sessionService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Verify JWT token and session
export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    // Validate access token and session
    const tokenData = await sessionService.validateAccessToken(token);
    
    // Get user data
    const user = await User.findById(tokenData.userId).select('-password');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Check if user account is active
    if (!user.isEmailVerified || !user.isPhoneVerified) {
      throw new ApiError(403, 'Account not verified');
    }

    if (['suspended', 'blocked', 'inactive'].includes(user.status)) {
      throw new ApiError(403, `Account ${user.status}`);
    }

    // Attach user and session data to request
    req.user = user;
    req.sessionId = tokenData.sessionId;
    req.deviceInfo = tokenData.deviceInfo;

    next();
  } catch (error) {
    throw new ApiError(401, error.message || 'Invalid authentication');
  }
});

// Optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      const tokenData = await sessionService.validateAccessToken(token);
      const user = await User.findById(tokenData.userId).select('-password');
      
      if (user && user.status === 'active') {
        req.user = user;
        req.sessionId = tokenData.sessionId;
        req.deviceInfo = tokenData.deviceInfo;
      }
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue
    next();
  }
});

// Role-based authorization
export const requireRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  });
};

// Session validation middleware
export const validateSession = asyncHandler(async (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.sessionId;
  
  if (!sessionId) {
    throw new ApiError(400, 'Session ID required');
  }

  const session = await sessionService.validateSession(sessionId);
  if (!session) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  req.validatedSession = session;
  next();
});

// Rate limiting middleware (can be enhanced with Redis)
export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return asyncHandler(async (req, res, next) => {
    const identifier = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(identifier)) {
      const userRequests = requests.get(identifier);
      const recentRequests = userRequests.filter(time => time > windowStart);
      requests.set(identifier, recentRequests);
    }

    const currentRequests = requests.get(identifier) || [];
    
    if (currentRequests.length >= maxRequests) {
      throw new ApiError(429, 'Too many requests. Please try again later.');
    }

    currentRequests.push(now);
    requests.set(identifier, currentRequests);

    next();
  });
};

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // if admin is already logged in then no need to verify the user
    if (req.admin) {
      return next();
    }

    // console.log("Verifying JWT token...",req.cookies);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
   
    if (!token) throw new ApiError(401, `Token is required`);
    const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log("Decoded Token:", decodeToken);
    const user = await User.findById(decodeToken?.userId).select(
      "-password -refreshToken"
    );
    if (!user) throw new ApiError(401, `Invalid access token`);

    req.user = user;
    next();
  } catch (error) {
    console.error(`verifyJWT Error`, error);
    throw new ApiError(401, `Error while validating user`, error);
  }
});