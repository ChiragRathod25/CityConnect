const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AuditLog = require('../models/AuditLog');
const UserSession = require('../models/UserSession');
const RateLimit = require('../models/RateLimit');
const redisClient = require('../config/redis');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const deviceParser = require('ua-parser-js');

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
  objectIdSchema
} = require('../validation/schemas');

// Sanitization middleware function
const sanitizeInput = (data) => {
  return mongoSanitize.sanitize(data, {
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized key: ${key} in request`);
    }
  });
};

// Validation and sanitization wrapper
const validateAndSanitize = (schema, data) => {
  // First sanitize the data
  const sanitizedData = sanitizeInput(data);
  
  // Then validate with Zod
  const result = schema.safeParse(sanitizedData);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));
    
    throw new Error(JSON.stringify({
      type: 'validation',
      errors
    }));
  }
  
  return result.data;
};

// ================== HELPER FUNCTIONS ==================
const generateDeviceId = (userAgent, ipAddress) => {
  return crypto.createHash('sha256')
    .update(userAgent + ipAddress)
    .digest('hex')
    .substring(0, 16);
};

// Parse device info
const parseDeviceInfo = (userAgent) => {
  const parser = new deviceParser(userAgent);
  return {
    userAgent,
    platform: parser.getOS().name,
    browser: parser.getBrowser().name,
    version: parser.getBrowser().version,
    mobile: parser.getDevice().type === 'mobile'
  };
};

// Generate JWT tokens
const generateTokens = (userId, deviceId) => {
  const accessToken = jwt.sign(
    { userId, deviceId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, deviceId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
};

// Check rate limiting
const checkRateLimit = async (ipAddress, endpoint, maxAttempts = 3) => {
  const key = `rate_limit:${ipAddress}:${endpoint}`;
  const data = await redisClient.get(key);
  
  if (data) {
    const rateData = JSON.parse(data);
    if (rateData.attempts >= maxAttempts) {
      return {
        blocked: true,
        resetTime: new Date(rateData.firstAttempt + 15 * 60 * 1000)
      };
    }
    
    rateData.attempts++;
    rateData.lastAttempt = Date.now();
    await redisClient.setex(key, 900, JSON.stringify(rateData));
    
    return { blocked: false, attempts: rateData.attempts };
  } else {
    const rateData = {
      attempts: 1,
      firstAttempt: Date.now(),
      lastAttempt: Date.now()
    };
    await redisClient.setex(key, 900, JSON.stringify(rateData));
    return { blocked: false, attempts: 1 };
  }
};

// Log audit activity
const logAuditActivity = async (userId, action, details, req) => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceInfo: parseDeviceInfo(req.get('User-Agent')),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

// Send OTP
const sendOTP = async (type, identifier, purpose) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const key = `otp:${type}:${identifier}`;
  
  const otpData = {
    code: otp,
    attempts: 0,
    maxAttempts: 3,
    createdAt: Date.now(),
    purpose
  };
  
  await redisClient.setex(key, 300, JSON.stringify(otpData)); // 5 minutes
  
  if (type === 'email') {
    await emailService.sendOTP(identifier, otp, purpose);
  } else if (type === 'phone') {
    await smsService.sendOTP(identifier, otp, purpose);
  }
  
  return otp;
};

// Verify OTP
const verifyOTP = async (type, identifier, inputOTP) => {
  const key = `otp:${type}:${identifier}`;
  const data = await redisClient.get(key);
  
  if (!data) {
    return { success: false, message: 'OTP expired or not found' };
  }
  
  const otpData = JSON.parse(data);
  
  if (otpData.attempts >= otpData.maxAttempts) {
    await redisClient.del(key);
    return { success: false, message: 'Too many attempts. Please request a new OTP' };
  }
  
  if (otpData.code !== inputOTP) {
    otpData.attempts++;
    await redisClient.setex(key, 300, JSON.stringify(otpData));
    return { success: false, message: 'Invalid OTP' };
  }
  
  await redisClient.del(key);
  return { success: true, message: 'OTP verified successfully' };
};

// ================== AUTHENTICATION CONTROLLERS ==================

// 1. REGISTRATION CONTROLLER
const registerController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(registrationSchema, req.body);
    const { email, phone, name, password, role } = validatedData;
    const ipAddress = req.ip;
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(ipAddress, 'register');
    if (rateLimitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: 'Too many registration attempts. Please try again later.',
        resetTime: rateLimitCheck.resetTime
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      await logAuditActivity(null, 'REGISTER', { 
        email, phone, success: false, reason: 'User already exists' 
      }, req);
      
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Store registration data in Redis
    const registrationData = {
      email,
      phone,
      name,
      password: hashedPassword,
      role: role || 'user',
      registrationIP: ipAddress,
      userAgent: req.get('User-Agent'),
      emailVerified: false,
      phoneVerified: false,
      createdAt: Date.now()
    };
    
    const regKey = `registration:${email}`;
    await redisClient.setex(regKey, 1800, JSON.stringify(registrationData)); // 30 minutes
    
    // Send email OTP
    await sendOTP('email', email, 'registration');
    
    await logAuditActivity(null, 'REGISTER', { 
      email, phone, step: 'email_verification_sent' 
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'Registration initiated. Please verify your email first.',
      nextStep: 'email_verification',
      identifier: email
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// 2. VERIFY EMAIL CONTROLLER (Registration step 1)
const verifyEmailController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(otpVerificationSchema, req.body);
    const { identifier, otp } = validatedData;
    
    // Verify email OTP
    const otpResult = await verifyOTP('email', identifier, otp);
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }
    
    // Get registration data
    const regKey = `registration:${identifier}`;
    const regData = await redisClient.get(regKey);
    
    if (!regData) {
      return res.status(400).json({
        success: false,
        message: 'Registration session expired. Please start again.'
      });
    }
    
    const registrationData = JSON.parse(regData);
    registrationData.emailVerified = true;
    
    // Update registration data
    await redisClient.setex(regKey, 1800, JSON.stringify(registrationData));
    
    // Send phone OTP
    await sendOTP('phone', registrationData.phone, 'registration');
    
    await logAuditActivity(null, 'EMAIL_VERIFY', { 
      email: identifier, step: 'phone_verification_sent' 
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'Email verified. Please verify your phone number.',
      nextStep: 'phone_verification',
      identifier: registrationData.phone
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

// 3. VERIFY PHONE CONTROLLER (Registration step 2)
const verifyPhoneController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(otpVerificationSchema, req.body);
    const { identifier, otp } = validatedData;
    
    // Verify phone OTP
    const otpResult = await verifyOTP('phone', identifier, otp);
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }
    
    // Find registration data by phone
    const keys = await redisClient.keys('registration:*');
    let registrationData = null;
    let regKey = null;
    
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.phone === identifier) {
          registrationData = parsed;
          regKey = key;
          break;
        }
      }
    }
    
    if (!registrationData || !registrationData.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Registration session not found or email not verified'
      });
    }
    
    // Create user in database
    const user = await User.create({
      email: registrationData.email,
      phone: registrationData.phone,
      name: registrationData.name,
      password: registrationData.password,
      role: registrationData.role,
      isEmailVerified: true,
      isPhoneVerified: true,
      lastLoginIP: req.ip,
      lastLogin: new Date()
    });
    
    // Generate device info and tokens
    const deviceInfo = parseDeviceInfo(req.get('User-Agent'));
    const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
    const { accessToken, refreshToken } = generateTokens(user._id, deviceId);
    
    // Store refresh token in database
    const refreshTokenDoc = await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      deviceInfo,
      ipAddress: req.ip,
      location: {}, // Add geolocation service if needed
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // Store access token in Redis
    const accessKey = `access_token:${user._id}:${deviceId}`;
    const accessData = {
      token: accessToken,
      userId: user._id.toString(),
      deviceId,
      ipAddress: req.ip,
      expiresAt: Date.now() + 15 * 60 * 1000,
      createdAt: Date.now()
    };
    await redisClient.setex(accessKey, 900, JSON.stringify(accessData));
    
    // Create user session
    await UserSession.create({
      userId: user._id,
      refreshTokenId: refreshTokenDoc._id,
      deviceInfo,
      ipAddress: req.ip,
      location: {}
    });
    
    // Clean up registration data
    await redisClient.del(regKey);
    
    await logAuditActivity(user._id, 'REGISTER', { 
      email: user.email, phone: user.phone, success: true 
    }, req);
    
    res.status(201).json({
      success: true,
      message: 'Registration completed successfully',
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 minutes
      }
    });
    
  } catch (error) {
    console.error('Phone verification error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Phone verification failed'
    });
  }
};

// 4. LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(loginSchema, req.body);
    const { identifier, password } = validatedData;
    const ipAddress = req.ip;
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(ipAddress, 'login');
    if (rateLimitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
        resetTime: rateLimitCheck.resetTime
      });
    }
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
      status: 'active'
    });
    
    if (!user) {
      await logAuditActivity(null, 'LOGIN_FAILED', { 
        identifier, reason: 'User not found' 
      }, req);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await logAuditActivity(user._id, 'LOGIN_FAILED', { 
        identifier, reason: 'Account locked' 
      }, req);
      
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.',
        lockedUntil: user.lockedUntil
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 3 failed attempts
      if (user.loginAttempts >= 3) {
        user.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        user.loginAttempts = 0;
      }
      
      await user.save();
      
      await logAuditActivity(user._id, 'LOGIN_FAILED', { 
        identifier, attempts: user.loginAttempts 
      }, req);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsLeft: 3 - (user.loginAttempts || 0)
      });
    }
    
    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockedUntil = undefined;
    }
    
    user.lastLogin = new Date();
    user.lastLoginIP = ipAddress;
    await user.save();
    
    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
      const sessionId = crypto.randomBytes(32).toString('hex');
      const tempToken = jwt.sign(
        { userId: user._id, sessionId, type: 'temp' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '5m' }
      );
      
      // Store 2FA pending session
      const twoFAKey = `2fa_pending:${user._id}:${sessionId}`;
      const twoFAData = {
        userId: user._id.toString(),
        tempToken,
        method: user.twoFactorMethod,
        emailVerified: false,
        phoneVerified: false,
        ipAddress,
        deviceInfo: parseDeviceInfo(req.get('User-Agent')),
        createdAt: Date.now()
      };
      
      await redisClient.setex(twoFAKey, 300, JSON.stringify(twoFAData));
      
      // Send OTP based on user's 2FA method
      if (user.twoFactorMethod === 'email' || user.twoFactorMethod === 'both') {
        await sendOTP('email', user.email, '2fa');
      }
      if (user.twoFactorMethod === 'phone' || user.twoFactorMethod === 'both') {
        await sendOTP('phone', user.phone, '2fa');
      }
      
      await logAuditActivity(user._id, 'LOGIN_SUCCESS', { 
        identifier, twoFA: 'pending' 
      }, req);
      
      return res.status(200).json({
        success: true,
        message: '2FA verification required',
        requiresTwoFA: true,
        sessionId,
        tempToken,
        method: user.twoFactorMethod
      });
    }
    
    // Generate tokens for direct login (no 2FA)
    const deviceInfo = parseDeviceInfo(req.get('User-Agent'));
    const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
    const { accessToken, refreshToken } = generateTokens(user._id, deviceId);
    
    // Store refresh token
    const refreshTokenDoc = await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      deviceInfo,
      ipAddress: req.ip,
      location: {}
    });
    
    // Store access token in Redis
    const accessKey = `access_token:${user._id}:${deviceId}`;
    const accessData = {
      token: accessToken,
      userId: user._id.toString(),
      deviceId,
      ipAddress: req.ip,
      expiresAt: Date.now() + 15 * 60 * 1000,
      createdAt: Date.now()
    };
    await redisClient.setex(accessKey, 900, JSON.stringify(accessData));
    
    // Create user session
    await UserSession.create({
      userId: user._id,
      refreshTokenId: refreshTokenDoc._id,
      deviceInfo,
      ipAddress: req.ip,
      location: {}
    });
    
    await logAuditActivity(user._id, 'LOGIN_SUCCESS', { identifier }, req);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        is2FAEnabled: user.is2FAEnabled
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// 5. 2FA VERIFICATION CONTROLLER
const verify2FAController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(twoFAVerifySchema, req.body);
    const { sessionId, emailOTP, phoneOTP } = validatedData;
    const tempToken = req.headers.authorization?.split(' ')[1];
    
    if (!tempToken) {
      return res.status(401).json({
        success: false,
        message: 'Temporary token required'
      });
    }
    
    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired temporary token'
      });
    }
    
    if (decoded.sessionId !== sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Session ID mismatch'
      });
    }
    
    // Get 2FA session data
    const twoFAKey = `2fa_pending:${decoded.userId}:${sessionId}`;
    const twoFAData = await redisClient.get(twoFAKey);
    
    if (!twoFAData) {
      return res.status(400).json({
        success: false,
        message: '2FA session expired or not found'
      });
    }
    
    const sessionData = JSON.parse(twoFAData);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify OTPs based on user's 2FA method
    let emailVerified = sessionData.emailVerified;
    let phoneVerified = sessionData.phoneVerified;
    
    if (emailOTP && (user.twoFactorMethod === 'email' || user.twoFactorMethod === 'both')) {
      const emailResult = await verifyOTP('email', user.email, emailOTP);
      if (!emailResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email OTP'
        });
      }
      emailVerified = true;
    }
    
    if (phoneOTP && (user.twoFactorMethod === 'phone' || user.twoFactorMethod === 'both')) {
      const phoneResult = await verifyOTP('phone', user.phone, phoneOTP);
      if (!phoneResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone OTP'
        });
      }
      phoneVerified = true;
    }
    
    // Check if all required verifications are complete
    const requiredEmailVerified = user.twoFactorMethod === 'phone' || emailVerified;
    const requiredPhoneVerified = user.twoFactorMethod === 'email' || phoneVerified;
    
    if (!requiredEmailVerified || !requiredPhoneVerified) {
      // Update session data
      sessionData.emailVerified = emailVerified;
      sessionData.phoneVerified = phoneVerified;
      await redisClient.setex(twoFAKey, 300, JSON.stringify(sessionData));
      
      return res.status(200).json({
        success: false,
        message: 'Additional verification required',
        emailVerified,
        phoneVerified,
        requiresEmail: user.twoFactorMethod === 'both' && !emailVerified,
        requiresPhone: user.twoFactorMethod === 'both' && !phoneVerified
      });
    }
    
    // All verifications complete - generate final tokens
    const deviceInfo = sessionData.deviceInfo;
    const deviceId = generateDeviceId(deviceInfo.userAgent, sessionData.ipAddress);
    const { accessToken, refreshToken } = generateTokens(user._id, deviceId);
    
    // Store refresh token
    const refreshTokenDoc = await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      deviceInfo,
      ipAddress: sessionData.ipAddress,
      location: {}
    });
    
    // Store access token in Redis
    const accessKey = `access_token:${user._id}:${deviceId}`;
    const accessData = {
      token: accessToken,
      userId: user._id.toString(),
      deviceId,
      ipAddress: sessionData.ipAddress,
      expiresAt: Date.now() + 15 * 60 * 1000,
      createdAt: Date.now()
    };
    await redisClient.setex(accessKey, 900, JSON.stringify(accessData));
    
    // Create user session
    await UserSession.create({
      userId: user._id,
      refreshTokenId: refreshTokenDoc._id,
      deviceInfo,
      ipAddress: sessionData.ipAddress,
      location: {}
    });
    
    // Clean up 2FA session
    await redisClient.del(twoFAKey);
    
    await logAuditActivity(user._id, '2FA_VERIFY_SUCCESS', {}, { 
      ip: sessionData.ipAddress, 
      get: () => deviceInfo.userAgent 
    });
    
    res.status(200).json({
      success: true,
      message: '2FA verification successful',
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        is2FAEnabled: user.is2FAEnabled
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    });
    
  } catch (error) {
    console.error('2FA verification error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: '2FA verification failed'
    });
  }
};

// 6. REFRESH TOKEN CONTROLLER
const refreshTokenController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(refreshTokenSchema, req.body);
    const { refreshToken } = validatedData;
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Check if token is blacklisted
    const blacklistKey = `blacklist:${refreshToken}`;
    const isBlacklisted = await redisClient.get(blacklistKey);
    
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }
    
    // Find token in database
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
      isActive: true
    }).populate('userId');
    
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Check if user is still active
    if (tokenDoc.userId.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User account is not active'
      });
    }
    
    // Generate new access token
    const deviceId = decoded.deviceId;
    const { accessToken } = generateTokens(tokenDoc.userId._id, deviceId);
    
    // Store new access token in Redis
    const accessKey = `access_token:${tokenDoc.userId._id}:${deviceId}`;
    const accessData = {
      token: accessToken,
      userId: tokenDoc.userId._id.toString(),
      deviceId,
      ipAddress: req.ip,
      expiresAt: Date.now() + 15 * 60 * 1000,
      createdAt: Date.now()
    };
    await redisClient.setex(accessKey, 900, JSON.stringify(accessData));
    
    // Update token last used time
    tokenDoc.lastUsed = new Date();
    await tokenDoc.save();
    
    await logAuditActivity(tokenDoc.userId._id, 'TOKEN_REFRESH', { deviceId }, req);
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      tokens: {
        accessToken,
        refreshToken, // Keep same refresh token
        expiresIn: 900
      }
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

// 7. LOGOUT CONTROLLER
const logoutController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const deviceId = req.user.deviceId;
    
    // Get refresh token from database
    const refreshTokenDoc = await RefreshToken.findOne({
      userId,
      isActive: true
    });
    
    if (refreshTokenDoc) {
      // Blacklist refresh token
      const blacklistKey = `blacklist:${refreshTokenDoc.token}`;
      await redisClient.setex(blacklistKey, 1800, JSON.stringify({
        userId: userId,
        tokenType: 'refresh',
        blacklistedAt: Date.now(),
        reason: 'logout'
      }));
      
      // Deactivate refresh token
      refreshTokenDoc.isActive = false;
      await refreshTokenDoc.save();
    }
    
    // Remove access token from Redis
    const accessKey = `access_token:${userId}:${deviceId}`;
    await redisClient.del(accessKey);
    
    // Deactivate user session
    await UserSession.updateOne(
      { userId, isActive: true },
      { isActive: false }
    );
    
    await logAuditActivity(userId, 'LOGOUT', { deviceId }, req);
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// 8. LOGOUT ALL DEVICES CONTROLLER
const logoutAllDevicesController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all active refresh tokens
    const refreshTokens = await RefreshToken.find({
      userId,
      isActive: true
    });
    
    // Blacklist all refresh tokens
    for (const tokenDoc of refreshTokens) {
      const blacklistKey = `blacklist:${tokenDoc.token}`;
      await redisClient.setex(blacklistKey, 1800, JSON.stringify({
        userId: userId,
        tokenType: 'refresh',
        blacklistedAt: Date.now(),
        reason: 'logout_all'
      }));
      
      // Deactivate token
      tokenDoc.isActive = false;
      await tokenDoc.save();
    }
    
    // Remove all access tokens from Redis
    const accessKeys = await redisClient.keys(`access_token:${userId}:*`);
    if (accessKeys.length > 0) {
      await redisClient.del(accessKeys);
    }
    
    // Deactivate all user sessions
    await UserSession.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
    
    await logAuditActivity(userId, 'LOGOUT_ALL', { devicesCount: refreshTokens.length }, req);
    
    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
      devicesLoggedOut: refreshTokens.length
    });
    
  } catch (error) {
    console.error('Logout all devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout all devices failed'
    });
  }
};

// ================== PASSWORD MANAGEMENT CONTROLLERS ==================

// 9. PASSWORD RESET REQUEST CONTROLLER
const passwordResetRequestController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(passwordResetRequestSchema, req.body);
    const { email } = validatedData;
    const ipAddress = req.ip;
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(ipAddress, 'password_reset');
    if (rateLimitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: 'Too many password reset attempts. Please try again later.',
        resetTime: rateLimitCheck.resetTime
      });
    }
    
    // Find user
    const user = await User.findOne({ email, status: 'active' });
    
    if (!user) {
      // Don't reveal if user exists - security measure
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Store in Redis
    const resetKey = `password_reset:${user._id}`;
    const resetData = {
      token: hashedToken,
      email: user.email,
      ipAddress,
      createdAt: Date.now()
    };
    
    await redisClient.setex(resetKey, 900, JSON.stringify(resetData)); // 15 minutes
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await emailService.sendPasswordReset(email, resetUrl);
    
    await logAuditActivity(user._id, 'PASSWORD_RESET_REQUEST', { email }, req);
    
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Password reset request failed'
    });
  }
};

// 10. PASSWORD RESET CONFIRM CONTROLLER
const passwordResetConfirmController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(passwordResetConfirmSchema, req.body);
    const { token, newPassword } = validatedData;
    const email = sanitizeInput(req.query.email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }
    
    // Find user
    const user = await User.findOne({ email, status: 'active' });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Get reset data from Redis
    const resetKey = `password_reset:${user._id}`;
    const resetData = await redisClient.get(resetKey);
    
    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const parsedResetData = JSON.parse(resetData);
    
    // Verify token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    if (parsedResetData.token !== hashedToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Update user password
    user.password = hashedPassword;
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();
    
    // Remove reset token from Redis
    await redisClient.del(resetKey);
    
    // Logout from all devices for security
    const refreshTokens = await RefreshToken.find({ userId: user._id, isActive: true });
    
    for (const tokenDoc of refreshTokens) {
      const blacklistKey = `blacklist:${tokenDoc.token}`;
      await redisClient.setex(blacklistKey, 1800, JSON.stringify({
        userId: user._id.toString(),
        tokenType: 'refresh',
        blacklistedAt: Date.now(),
        reason: 'password_reset'
      }));
      
      tokenDoc.isActive = false;
      await tokenDoc.save();
    }
    
    // Remove all access tokens
    const accessKeys = await redisClient.keys(`access_token:${user._id}:*`);
    if (accessKeys.length > 0) {
      await redisClient.del(accessKeys);
    }
    
    // Deactivate all sessions
    await UserSession.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false }
    );
    
    await logAuditActivity(user._id, 'PASSWORD_RESET_SUCCESS', { email }, req);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });
    
  } catch (error) {
    console.error('Password reset confirm error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};

// 11. CHANGE PASSWORD CONTROLLER
const changePasswordController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(changePasswordSchema, req.body);
    const { currentPassword, newPassword } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      await logAuditActivity(userId, 'PASSWORD_CHANGE', { 
        success: false, reason: 'Invalid current password' 
      }, req);
      
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    await logAuditActivity(userId, 'PASSWORD_CHANGE', { success: true }, req);
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Password change failed'
    });
  }
};

// ================== 2FA MANAGEMENT CONTROLLERS ==================

// 12. SETUP 2FA CONTROLLER
const setup2FAController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(twoFASetupSchema, req.body);
    const { method, password } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    // Update 2FA settings
    user.is2FAEnabled = true;
    user.twoFactorMethod = method;
    await user.save();
    
    await logAuditActivity(userId, '2FA_ENABLE', { method }, req);
    
    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
      method
    });
    
  } catch (error) {
    console.error('Setup 2FA error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: '2FA setup failed'
    });
  }
};

// 13. DISABLE 2FA CONTROLLER
const disable2FAController = async (req, res) => {
  try {
    // Validate and sanitize input (reuse changePasswordSchema for password validation)
    const validatedData = validateAndSanitize(changePasswordSchema, req.body);
    const { currentPassword: password } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    // Disable 2FA
    user.is2FAEnabled = false;
    user.twoFactorMethod = 'both'; // Reset to default
    await user.save();
    
    await logAuditActivity(userId, '2FA_DISABLE', {}, req);
    
    res.status(200).json({
      success: true,
      message: '2FA disabled successfully'
    });
    
  } catch (error) {
    console.error('Disable 2FA error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: '2FA disable failed'
    });
  }
};

// ================== PROFILE MANAGEMENT CONTROLLERS ==================

// 14. UPDATE PROFILE CONTROLLER
const updateProfileController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(profileUpdateSchema, req.body);
    const { name } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update name if provided
    if (name) {
      user.name = name;
    }
    
    await user.save();
    
    await logAuditActivity(userId, 'PROFILE_UPDATE', { name }, req);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
};

// 15. REQUEST EMAIL CHANGE CONTROLLER
const requestEmailChangeController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(emailChangeRequestSchema, req.body);
    const { newEmail, password } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    // Check if new email is already taken
    const existingUser = await User.findOne({ 
      email: newEmail,
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use'
      });
    }
    
    // Send OTP to new email
    await sendOTP('email', newEmail, 'email_change');
    
    // Store change request in Redis
    const changeKey = `email_change:${userId}`;
    const changeData = {
      userId: userId.toString(),
      currentEmail: user.email,
      newEmail,
      createdAt: Date.now()
    };
    
    await redisClient.setex(changeKey, 300, JSON.stringify(changeData)); // 5 minutes
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to new email address',
      newEmail
    });
    
  } catch (error) {
    console.error('Request email change error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Email change request failed'
    });
  }
};

// 16. CONFIRM EMAIL CHANGE CONTROLLER
const confirmEmailChangeController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(otpVerificationSchema, req.body);
    const { otp } = validatedData;
    const userId = req.user.userId;
    
    // Get change request from Redis
    const changeKey = `email_change:${userId}`;
    const changeData = await redisClient.get(changeKey);
    
    if (!changeData) {
      return res.status(400).json({
        success: false,
        message: 'Email change request expired or not found'
      });
    }
    
    const parsedChangeData = JSON.parse(changeData);
    
    // Verify OTP
    const otpResult = await verifyOTP('email', parsedChangeData.newEmail, otp);
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }
    
    // Update user email
    const user = await User.findById(userId);
    user.email = parsedChangeData.newEmail;
    user.isEmailVerified = true;
    await user.save();
    
    // Clean up change request
    await redisClient.del(changeKey);
    
    await logAuditActivity(userId, 'PROFILE_UPDATE', { 
      emailChanged: true, 
      oldEmail: parsedChangeData.currentEmail,
      newEmail: parsedChangeData.newEmail
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'Email changed successfully',
      newEmail: user.email
    });
    
  } catch (error) {
    console.error('Confirm email change error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Email change confirmation failed'
    });
  }
};

// 17. REQUEST PHONE CHANGE CONTROLLER
const requestPhoneChangeController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(phoneChangeRequestSchema, req.body);
    const { newPhone, password } = validatedData;
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    // Check if new phone is already taken
    const existingUser = await User.findOne({ 
      phone: newPhone,
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already in use'
      });
    }
    
    // Send OTP to new phone
    await sendOTP('phone', newPhone, 'phone_change');
    
    // Store change request in Redis
    const changeKey = `phone_change:${userId}`;
    const changeData = {
      userId: userId.toString(),
      currentPhone: user.phone,
      newPhone,
      createdAt: Date.now()
    };
    
    await redisClient.setex(changeKey, 300, JSON.stringify(changeData)); // 5 minutes
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to new phone number',
      newPhone
    });
    
  } catch (error) {
    console.error('Request phone change error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Phone change request failed'
    });
  }
};

// 18. CONFIRM PHONE CHANGE CONTROLLER
const confirmPhoneChangeController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(otpVerificationSchema, req.body);
    const { otp } = validatedData;
    const userId = req.user.userId;
    
    // Get change request from Redis
    const changeKey = `phone_change:${userId}`;
    const changeData = await redisClient.get(changeKey);
    
    if (!changeData) {
      return res.status(400).json({
        success: false,
        message: 'Phone change request expired or not found'
      });
    }
    
    const parsedChangeData = JSON.parse(changeData);
    
    // Verify OTP
    const otpResult = await verifyOTP('phone', parsedChangeData.newPhone, otp);
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }
    
    // Update user phone
    const user = await User.findById(userId);
    user.phone = parsedChangeData.newPhone;
    user.isPhoneVerified = true;
    await user.save();
    
    // Clean up change request
    await redisClient.del(changeKey);
    
    await logAuditActivity(userId, 'PROFILE_UPDATE', { 
      phoneChanged: true, 
      oldPhone: parsedChangeData.currentPhone,
      newPhone: parsedChangeData.newPhone
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'Phone number changed successfully',
      newPhone: user.phone
    });
    
  } catch (error) {
    console.error('Confirm phone change error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Phone change confirmation failed'
    });
  }
};

// ================== ADMIN/SELLER CONTROL CONTROLLERS ==================

// 19. GET USERS CONTROLLER (Admin/Seller)
const getUsersController = async (req, res) => {
  try {
    // Sanitize query parameters (validation is handled by middleware)
    const sanitizedQuery = sanitizeInput(req.query);
    const { query, role, status, verified, page, limit } = sanitizedQuery;
    const currentUserId = req.user.userId;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser || !['admin', 'seller'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Build search criteria
    const searchCriteria = {};
    
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (role) searchCriteria.role = role;
    if (status) searchCriteria.status = status;
    if (verified !== undefined) {
      searchCriteria.isEmailVerified = verified;
      searchCriteria.isPhoneVerified = verified;
    }
    
    // Sellers can only see users, not other sellers or admins
    if (currentUser.role === 'seller') {
      searchCriteria.role = 'user';
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(searchCriteria)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(searchCriteria);
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasMore: skip + users.length < total
        }
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users'
    });
  }
};

// 20. BLOCK USER CONTROLLER (Admin/Seller)
const blockUserController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(userBlockSchema, req.body);
    const { userId, reason, duration } = validatedData;
    const currentUserId = req.user.userId;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser || !['admin', 'seller'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get target user
    const targetUser = await User.findById(userId);
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Sellers cannot block admins or other sellers
    if (currentUser.role === 'seller' && ['admin', 'seller'].includes(targetUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot block admin or seller accounts'
      });
    }
    
    // Admins cannot block other admins
    if (currentUser.role === 'admin' && targetUser.role === 'admin' && targetUser._id.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot block other admin accounts'
      });
    }
    
    // Block user
    targetUser.status = 'blocked';
    targetUser.blockedBy = currentUserId;
    targetUser.blockedAt = new Date();
    targetUser.blockReason = reason;
    await targetUser.save();
    
    // Logout user from all devices
    const refreshTokens = await RefreshToken.find({ userId, isActive: true });
    
    for (const tokenDoc of refreshTokens) {
      const blacklistKey = `blacklist:${tokenDoc.token}`;
      await redisClient.setex(blacklistKey, 1800, JSON.stringify({
        userId: userId,
        tokenType: 'refresh',
        blacklistedAt: Date.now(),
        reason: 'account_blocked'
      }));
      
      tokenDoc.isActive = false;
      await tokenDoc.save();
    }
    
    // Remove all access tokens
    const accessKeys = await redisClient.keys(`access_token:${userId}:*`);
    if (accessKeys.length > 0) {
      await redisClient.del(accessKeys);
    }
    
    // Deactivate all sessions
    await UserSession.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
    
    await logAuditActivity(currentUserId, 'ACCOUNT_BLOCKED', { 
      targetUserId: userId,
      reason,
      duration
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      user: {
        id: targetUser._id,
        email: targetUser.email,
        status: targetUser.status,
        blockedAt: targetUser.blockedAt,
        blockReason: targetUser.blockReason
      }
    });
    
  } catch (error) {
    console.error('Block user error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to block user'
    });
  }
};

// 21. UNBLOCK USER CONTROLLER (Admin/Seller)
const unblockUserController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(userUnblockSchema, req.body);
    const { userId, reason } = validatedData;
    const currentUserId = req.user.userId;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser || !['admin', 'seller'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get target user
    const targetUser = await User.findById(userId);
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (targetUser.status !== 'blocked') {
      return res.status(400).json({
        success: false,
        message: 'User is not blocked'
      });
    }
    
    // Unblock user
    targetUser.status = 'active';
    targetUser.blockedBy = undefined;
    targetUser.blockedAt = undefined;
    targetUser.blockReason = undefined;
    targetUser.loginAttempts = 0;
    targetUser.lockedUntil = undefined;
    await targetUser.save();
    
    await logAuditActivity(currentUserId, 'ACCOUNT_UNBLOCKED', { 
      targetUserId: userId,
      reason
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      user: {
        id: targetUser._id,
        email: targetUser.email,
        status: targetUser.status
      }
    });
    
  } catch (error) {
    console.error('Unblock user error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to unblock user'
    });
  }
};

// ================== UTILITY CONTROLLERS ==================

// 22. GET USER SESSIONS CONTROLLER
const getUserSessionsController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const sessions = await UserSession.find({ 
      userId, 
      isActive: true 
    })
    .populate('refreshTokenId')
    .sort({ createdAt: -1 });
    
    const formattedSessions = sessions.map(session => ({
      id: session._id,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      location: session.location,
      loginAt: session.loginAt,
      lastActivity: session.lastActivity,
      isCurrent: session.refreshTokenId && session.refreshTokenId.token === req.user.refreshToken
    }));
    
    res.status(200).json({
      success: true,
      message: 'User sessions retrieved successfully',
      sessions: formattedSessions
    });
    
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user sessions'
    });
  }
};

// 23. GET AUDIT LOGS CONTROLLER
const getAuditLogsController = async (req, res) => {
  try {
    // Sanitize query parameters (validation is handled by middleware)
    const sanitizedQuery = sanitizeInput(req.query);
    const { action, startDate, endDate, ipAddress, page, limit } = sanitizedQuery;
    const userId = req.user.userId;
    const currentUser = await User.findById(userId);
    
    // Build search criteria
    const searchCriteria = {};
    
    // Non-admin users can only see their own logs
    if (currentUser.role !== 'admin') {
      searchCriteria.userId = userId;
    }
    
    if (action) searchCriteria.action = action;
    if (ipAddress) searchCriteria.ipAddress = ipAddress;
    
    if (startDate || endDate) {
      searchCriteria.timestamp = {};
      if (startDate) searchCriteria.timestamp.$gte = new Date(startDate);
      if (endDate) searchCriteria.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const logs = await AuditLog.find(searchCriteria)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 });
    
    const total = await AuditLog.countDocuments(searchCriteria);
    
    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasMore: skip + logs.length < total
        }
      }
    });
    
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs'
    });
  }
};

// 24. RESEND OTP CONTROLLER
const resendOTPController = async (req, res) => {
  try {
    // Validate and sanitize input
    const validatedData = validateAndSanitize(otpVerificationSchema, req.body);
    const { identifier, type, purpose } = validatedData;
    const ipAddress = req.ip;
    
    // Check rate limiting for OTP resend
    const rateLimitCheck = await checkRateLimit(ipAddress, 'resend_otp', 5); // 5 attempts per 15 min
    if (rateLimitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP resend attempts. Please try again later.',
        resetTime: rateLimitCheck.resetTime
      });
    }
    
    // Check if previous OTP exists and is still valid
    const otpKey = `otp:${type}:${identifier}`;
    const existingOTP = await redisClient.get(otpKey);
    
    if (existingOTP) {
      const otpData = JSON.parse(existingOTP);
      const timeRemaining = 300 - Math.floor((Date.now() - otpData.createdAt) / 1000);
      
      if (timeRemaining > 240) { // Only allow resend after 1 minute
        return res.status(400).json({
          success: false,
          message: `Please wait ${timeRemaining - 240} seconds before requesting a new OTP`
        });
      }
    }
    
    // Send new OTP
    await sendOTP(type, identifier, purpose);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// 25. GET CURRENT USER CONTROLLER
const getCurrentUserController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        is2FAEnabled: user.is2FAEnabled,
        twoFactorMethod: user.twoFactorMethod,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user'
    });
  }
};

// 26. TERMINATE SESSION CONTROLLER
const terminateSessionController = async (req, res) => {
  try {
    // Validate and sanitize session ID
    const sanitizedParams = sanitizeInput(req.params);
    const validatedSessionId = validateAndSanitize(objectIdSchema, sanitizedParams.sessionId);
    const userId = req.user.userId;
    
    // Find the session
    const session = await UserSession.findOne({
      _id: validatedSessionId,
      userId,
      isActive: true
    }).populate('refreshTokenId');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Blacklist the refresh token
    if (session.refreshTokenId) {
      const blacklistKey = `blacklist:${session.refreshTokenId.token}`;
      await redisClient.setex(blacklistKey, 1800, JSON.stringify({
        userId: userId,
        tokenType: 'refresh',
        blacklistedAt: Date.now(),
        reason: 'session_terminated'
      }));
      
      // Deactivate refresh token
      session.refreshTokenId.isActive = false;
      await session.refreshTokenId.save();
    }
    
    // Remove access tokens for this session
    const accessKeys = await redisClient.keys(`access_token:${userId}:*`);
    for (const key of accessKeys) {
      const accessData = await redisClient.get(key);
      if (accessData) {
        const parsed = JSON.parse(accessData);
        // Remove access token if it belongs to this session
        await redisClient.del(key);
      }
    }
    
    // Deactivate session
    session.isActive = false;
    await session.save();
    
    await logAuditActivity(userId, 'LOGOUT', { 
      sessionId: validatedSessionId,
      terminatedSession: true 
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'Session terminated successfully'
    });
    
  } catch (error) {
    console.error('Terminate session error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      const errorData = JSON.parse(error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorData.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to terminate session'
    });
  }
};

// ================== DATA EXPORT CONTROLLER (GDPR) ==================

// 27. EXPORT USER DATA CONTROLLER (GDPR Compliance)
const exportUserDataController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user sessions
    const sessions = await UserSession.find({ userId })
      .populate('refreshTokenId')
      .select('-__v');
    
    // Get audit logs
    const auditLogs = await AuditLog.find({ userId })
      .select('-__v')
      .sort({ timestamp: -1 })
      .limit(1000); // Limit to recent 1000 logs
    
    // Get refresh tokens
    const refreshTokens = await RefreshToken.find({ userId })
      .select('-token -__v'); // Exclude actual token for security
    
    // Compile data export
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        is2FAEnabled: user.is2FAEnabled,
        twoFactorMethod: user.twoFactorMethod,
        lastLogin: user.lastLogin,
        lastLoginIP: user.lastLoginIP,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      sessions: sessions.map(session => ({
        id: session._id,
        deviceInfo: session.deviceInfo,
        ipAddress: session.ipAddress,
        location: session.location,
        isActive: session.isActive,
        loginAt: session.loginAt,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt
      })),
      refreshTokens: refreshTokens.map(token => ({
        id: token._id,
        deviceInfo: token.deviceInfo,
        ipAddress: token.ipAddress,
        location: token.location,
        isActive: token.isActive,
        lastUsed: token.lastUsed,
        expiresAt: token.expiresAt,
        createdAt: token.createdAt
      })),
      auditLogs: auditLogs.map(log => ({
        id: log._id,
        action: log.action,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        deviceInfo: log.deviceInfo,
        success: log.success,
        timestamp: log.timestamp
      }))
    };
    
    await logAuditActivity(userId, 'DATA_EXPORT', { 
      recordsCount: {
        sessions: sessions.length,
        auditLogs: auditLogs.length,
        refreshTokens: refreshTokens.length
      }
    }, req);
    
    res.status(200).json({
      success: true,
      message: 'User data exported successfully',
      data: exportData
    });
    
  } catch (error) {
    console.error('Export user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export user data'
    });
  }
};

// ================== HEALTH CHECK CONTROLLER ==================

// 28. HEALTH CHECK CONTROLLER
const healthCheckController = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check Redis connection
    let redisStatus;
    try {
      await redisClient.ping();
      redisStatus = 'connected';
    } catch (error) {
      redisStatus = 'disconnected';
    }
    
    // Get system stats
    const userCount = await User.countDocuments({ status: 'active' });
    const activeSessionsCount = await UserSession.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'Health check completed',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: {
          status: mongoStatus,
          activeUsers: userCount
        },
        redis: {
          status: redisStatus
        },
        sessions: {
          active: activeSessionsCount
        }
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

module.exports = {
  // Authentication controllers
  registerController,
  verifyEmailController,
  verifyPhoneController,
  loginController,
  verify2FAController,
  refreshTokenController,
  logoutController,
  logoutAllDevicesController,
  
  // Password management controllers
  passwordResetRequestController,
  passwordResetConfirmController,
  changePasswordController,
  
  // 2FA management controllers
  setup2FAController,
  disable2FAController,
  
  // Profile management controllers
  updateProfileController,
  requestEmailChangeController,
  confirmEmailChangeController,
  requestPhoneChangeController,
  confirmPhoneChangeController,
  
  // Admin/Seller control controllers
  getUsersController,
  blockUserController,
  unblockUserController,
  
  // Utility controllers
  getUserSessionsController,
  getAuditLogsController,
  resendOTPController,
  getCurrentUserController,
  terminateSessionController,
  exportUserDataController,
  healthCheckController,
  
  // Helper functions (exported for testing)
  generateDeviceId,
  parseDeviceInfo,
  generateTokens,
  checkRateLimit,
  logAuditActivity,
  sendOTP,
  verifyOTP
};