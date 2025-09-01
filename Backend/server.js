const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const redisClient = require('./config/redis');
const User = require('./models/User');

// Import validation schemas
const {
  registrationSchema,
  loginSchema,
  otpVerificationSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  changePasswordSchema,
  refreshTokenSchema,
  twoFASetupSchema,
  twoFAVerifySchema,
  profileUpdateSchema,
  emailChangeRequestSchema,
  phoneChangeRequestSchema,
  userBlockSchema,
  userUnblockSchema,
  paginationSchema,
  auditLogFilterSchema,
  userSearchSchema,
  validateRequest
} = require('./validation/schemas');

// Import all controllers
const {
  registerController,
  verifyEmailController,
  verifyPhoneController,
  loginController,
  verify2FAController,
  refreshTokenController,
  logoutController,
  logoutAllDevicesController,
  passwordResetRequestController,
  passwordResetConfirmController,
  changePasswordController,
  setup2FAController,
  disable2FAController,
  updateProfileController,
  requestEmailChangeController,
  confirmEmailChangeController,
  requestPhoneChangeController,
  confirmPhoneChangeController,
  getUsersController,
  blockUserController,
  unblockUserController,
  getUserSessionsController,
  getAuditLogsController,
  resendOTPController,
  getCurrentUserController,
  terminateSessionController,
  exportUserDataController,
  healthCheckController
} = require('./controllers/authControllers');

const app = express();

// ================== MIDDLEWARE CONFIGURATION ==================

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Global rate limiting
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalRateLimit);

// Auth rate limiting (stricter)
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

// ================== AUTHENTICATION MIDDLEWARE ==================

// JWT Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Check if token exists in Redis
    const accessKey = `access_token:${decoded.userId}:${decoded.deviceId}`;
    const tokenData = await redisClient.get(accessKey);
    
    if (!tokenData) {
      return res.status(401).json({
        success: false,
        message: 'Token not found or expired'
      });
    }
    
    const parsedTokenData = JSON.parse(tokenData);
    
    // Verify token matches
    if (parsedTokenData.token !== token) {
      return res.status(401).json({
        success: false,
        message: 'Token mismatch'
      });
    }
    
    // Check if token is blacklisted
    const blacklistKey = `blacklist:${token}`;
    const isBlacklisted = await redisClient.get(blacklistKey);
    
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }
    
    // Get user and check status
    const user = await User.findById(decoded.userId);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User not found or account inactive'
      });
    }
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      deviceId: decoded.deviceId,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

// Optional auth middleware (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authMiddleware(req, res, next);
    }
    
    next();
  } catch (error) {
    next();
  }
};

// ================== PUBLIC ROUTES (No Authentication Required) ==================

// Health check
app.get('/api/health', healthCheckController);

// ================== AUTHENTICATION ROUTES ==================

// Registration flow
app.post('/api/auth/register', 
  authRateLimit,
  validateRequest(registrationSchema),
  registerController
);

app.post('/api/auth/verify-email',
  authRateLimit,
  validateRequest(otpVerificationSchema),
  verifyEmailController
);

app.post('/api/auth/verify-phone',
  authRateLimit,
  validateRequest(otpVerificationSchema),
  verifyPhoneController
);

// Login flow
app.post('/api/auth/login',
  authRateLimit,
  validateRequest(loginSchema),
  loginController
);

app.post('/api/auth/verify-2fa',
  authRateLimit,
  validateRequest(twoFAVerifySchema),
  verify2FAController
);

// Token management
app.post('/api/auth/refresh',
  authRateLimit,
  validateRequest(refreshTokenSchema),
  refreshTokenController
);

app.post('/api/auth/logout',
  authMiddleware,
  logoutController
);

app.post('/api/auth/logout-all',
  authMiddleware,
  logoutAllDevicesController
);

// ================== PASSWORD MANAGEMENT ROUTES ==================

// Password reset flow
app.post('/api/auth/password-reset/request',
  authRateLimit,
  validateRequest(passwordResetRequestSchema),
  passwordResetRequestController
);

app.post('/api/auth/password-reset/confirm',
  authRateLimit,
  validateRequest(passwordResetConfirmSchema),
  passwordResetConfirmController
);

// Change password (requires authentication)
app.post('/api/auth/password/change',
  authMiddleware,
  validateRequest(changePasswordSchema),
  changePasswordController
);

// ================== 2FA MANAGEMENT ROUTES ==================

app.post('/api/auth/2fa/setup',
  authMiddleware,
  validateRequest(twoFASetupSchema),
  setup2FAController
);

app.post('/api/auth/2fa/disable',
  authMiddleware,
  validateRequest(changePasswordSchema), // Reuse password validation
  disable2FAController
);

// ================== PROFILE MANAGEMENT ROUTES ==================

// Get current user
app.get('/api/auth/me',
  authMiddleware,
  getCurrentUserController
);

// Update profile
app.put('/api/auth/profile',
  authMiddleware,
  validateRequest(profileUpdateSchema),
  updateProfileController
);

// Email change flow
app.post('/api/auth/email/change-request',
  authMiddleware,
  authRateLimit,
  validateRequest(emailChangeRequestSchema),
  requestEmailChangeController
);

app.post('/api/auth/email/change-confirm',
  authMiddleware,
  validateRequest(otpVerificationSchema),
  confirmEmailChangeController
);

// Phone change flow
app.post('/api/auth/phone/change-request',
  authMiddleware,
  authRateLimit,
  validateRequest(phoneChangeRequestSchema),
  requestPhoneChangeController
);

app.post('/api/auth/phone/change-confirm',
  authMiddleware,
  validateRequest(otpVerificationSchema),
  confirmPhoneChangeController
);

// ================== SESSION MANAGEMENT ROUTES ==================

// Get user sessions
app.get('/api/auth/sessions',
  authMiddleware,
  getUserSessionsController
);

// Terminate specific session
app.delete('/api/auth/sessions/:sessionId',
  authMiddleware,
  terminateSessionController
);

// ================== UTILITY ROUTES ==================

// Resend OTP
app.post('/api/auth/otp/resend',
  authRateLimit,
  validateRequest(otpVerificationSchema),
  resendOTPController
);

// Export user data (GDPR)
app.get('/api/auth/export',
  authMiddleware,
  exportUserDataController
);

// ================== ADMIN ROUTES ==================

// Get users (Admin/Seller only)
app.get('/api/admin/users',
  authMiddleware,
  requireRole(['admin', 'seller']),
  validateRequest(userSearchSchema, 'query'),
  getUsersController
);

// Block user (Admin/Seller only)
app.post('/api/admin/users/block',
  authMiddleware,
  requireRole(['admin', 'seller']),
  validateRequest(userBlockSchema),
  blockUserController
);

// Unblock user (Admin/Seller only)
app.post('/api/admin/users/unblock',
  authMiddleware,
  requireRole(['admin', 'seller']),
  validateRequest(userUnblockSchema),
  unblockUserController
);

// Get audit logs
app.get('/api/admin/audit-logs',
  authMiddleware,
  requireRole(['admin']), // Only admins can view all audit logs
  validateRequest(auditLogFilterSchema, 'query'),
  getAuditLogsController
);

// Get personal audit logs (all authenticated users)
app.get('/api/auth/audit-logs',
  authMiddleware,
  validateRequest(auditLogFilterSchema, 'query'),
  getAuditLogsController
);

// ================== SELLER ROUTES ==================

// Sellers can access user management but with restricted permissions
app.get('/api/seller/users',
  authMiddleware,
  requireRole(['seller']),
  validateRequest(userSearchSchema, 'query'),
  getUsersController
);

app.post('/api/seller/users/block',
  authMiddleware,
  requireRole(['seller']),
  validateRequest(userBlockSchema),
  blockUserController
);

app.post('/api/seller/users/unblock',
  authMiddleware,
  requireRole(['seller']),
  validateRequest(userUnblockSchema),
  unblockUserController
);

// ================== ERROR HANDLING MIDDLEWARE ==================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // Rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// ================== SERVER STARTUP ==================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started Successfully!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server gracefully...');
  
  try {
    // Close Redis connection
    if (redisClient && redisClient.disconnect) {
      await redisClient.disconnect();
      console.log('✅ Redis connection closed');
    }
    
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
