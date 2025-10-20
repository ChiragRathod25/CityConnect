import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {
  sendEmailVerification,
  sendMobileVerification,
} from "../utils/sendVerification.js";
import { LoginSchema, SignupSchema } from "../validation/userSchema.js";
import { handleZodValidationError } from "../utils/ZodValidationError.js";
import {
  checkRateLimit,
  cleanupTempData,
  generateSessionId,
  getTempData,
  storeOTP,
  storeTempData,
  updateVerificationStatus,
  verifyOTP,
} from "../config/redis.js";
import { sessionService } from "../services/sessionService.js";

import sanitize from "mongo-sanitize";
import crypto from "crypto";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000).toString(); // Generate a 6-digit OTP
  console.log("Generated OTP:", otp);
  return otp;
};

// Step 1: Store registration data temporarily (no user creation yet)
const InitialUserRegister = asyncHandler(async (req, res) => {
  // Sanitized Data
  const sanitizedData = sanitize(req.body);

  // Validate required fields for registration
  const requiredFields = [
    "username",
    "email",
    "password",
    "phoneNumber",
    "role",
  ];

  for (const field of requiredFields) {
    if (!sanitizedData[field]) {
      throw new ApiError(400, `${field} is required`);
    }
  }

  // Zod Validation
  const validationResult = SignupSchema.safeParse(sanitizedData);

  const errorResponse = handleZodValidationError(validationResult, res);
  if (errorResponse) throw new ApiError(400, "Invalid registration data");

  const validatedData = validationResult.data;

  //check duplicate email
  const existingEmail = await User.findOne({ email: validatedData.email });

  if (existingEmail) {
    throw new ApiError(400, "Email already in use");
  }

  //check duplicate phoneNumber
  const existingPhone = await User.findOne({
    phoneNumber: validatedData.phoneNumber,
  });

  if (existingPhone) {
    throw new ApiError(400, "phoneNumber already in use");
  }

  //check duplicate username
  const existingUsername = await User.findOne({
    username: validatedData.username,
  });

  if (existingUsername) {
    throw new ApiError(400, "Username already in use");
  }

  const sessionId = generateSessionId();

  const tempData = {
    userData: validatedData,
    verificationStatus: {
      emailVerified: false,
      phoneVerified: false,
    },
    createdAt: new Date().toISOString(),
  };

  await storeTempData(sessionId, tempData, 600); // 10 minutes

  res.status(201).json(
    new ApiResponse(
      201,
      "Registration data stored. Please verify your email and phoneNumber.",
      {
        sessionId,
        nextStep: "email_verification",
        email: validatedData?.email,
        phoneNumber: validatedData?.phoneNumber,
        role: validatedData?.role,
      }
    )
  );
});

// Step 2: Send Email Verification OTP
const sendEmailVerificationOTP = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const tempData = await getTempData(sessionId);
  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  if (tempData.verificationStatus.emailVerified) {
    throw new ApiError(400, "Email already verified");
  }
  // Check rate limiting
  const rateLimit = await checkRateLimit(sessionId, "email");

  if (rateLimit.limited) {
    throw new ApiError(
      429,
      `Please wait ${rateLimit.remainingTime} seconds before requesting another code`
    );
  }

  const otp = generateOTP();

  try {
    await storeOTP(sessionId, otp, "email_verification", 120);

    // Send OTP via email
    const emailResponse = await sendEmailVerification({
      email: tempData.userData.email,
      verificationCode: otp,
    });

    console.log("Email verification sent:", emailResponse);
    if (emailResponse?.error?.statusCode) {
      throw new ApiError(
        emailResponse?.error?.statusCode,
        emailResponse?.error?.message
      );
    }

    return res.status(200).json(
      new ApiResponse(200, "Verification code sent to email", {
        success: true,
        statusCode: 200,
        message: "Verification code sent to email",
        data: {
          codeSent: true,
          method: "email",
          expiresIn: 120,
          email: tempData.userData.email,
        },
      })
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new ApiError(500, "Error sending verification email");
  }
});

// Step 3: Verify Email OTP
const verifyEmail = asyncHandler(async (req, res) => {
  const { sessionId, otp } = req.body;

  if (!sessionId || !otp) {
    throw new ApiError(400, "Session ID and OTP are required");
  }

  const tempData = await getTempData(sessionId);

  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  if (tempData.verificationStatus.emailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  try {
    // Verify OTP from Redis
    const isValidOTP = await verifyOTP(sessionId, otp, "email_verification");

    if (!isValidOTP) {
      throw new ApiError(400, "Invalid or expired verification code");
    }

    // Update verification status in Redis
    const updatedTempData = await updateVerificationStatus(
      sessionId,
      "emailVerified",
      true
    );

    return res.status(200).json(
      new ApiResponse(200, "Email verified successfully", {
        emailVerified: true,
        phoneVerified: updatedTempData.verificationStatus.phoneVerified,
        nextStep: "phone_verification",
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error verifying email");
  }
});

// Step 4: Send phoneNumber Verification OTP
const sendPhoneVerificationOTP = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const tempData = await getTempData(sessionId);

  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  if (!tempData.verificationStatus.emailVerified) {
    throw new ApiError(400, "Please verify your email first");
  }

  if (tempData.verificationStatus.phoneVerified) {
    throw new ApiError(400, "phoneNumber already verified");
  }

  // Check rate limiting
  const rateLimit = await checkRateLimit(sessionId, "phoneNumber");

  if (rateLimit.limited) {
    throw new ApiError(
      429,
      `Please wait ${rateLimit.remainingTime} seconds before requesting another code`
    );
  }

  const otp = generateOTP();

  try {
    // Store OTP in Redis
    await storeOTP(sessionId, otp, "phone_verification", 120);

    // Send OTP via SMS
    const smsResponse = await sendMobileVerification({
      phoneNumber: tempData.userData.phoneNumber,
      verificationCode: otp,
    });

    console.log("SMS verification sent:", smsResponse);

    return res.status(200).json(
      new ApiResponse(200, "Verification code sent to phoneNumber", {
        codeSent: true,
        method: "phoneNumber",
        expiresIn: 600,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error sending verification SMS");
  }
});

// Step 5: Verify phoneNumber OTP
// phoneVerification.controller.js
const verifyPhone = asyncHandler(async (req, res) => {
  const { sessionId, otp } = req.body;

  if (!sessionId || !otp) {
    throw new ApiError(400, "Session ID and OTP are required");
  }

  const tempData = await getTempData(sessionId);
  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  if (!tempData.verificationStatus.emailVerified) {
    throw new ApiError(400, "Please verify your email first");
  }

  if (tempData.verificationStatus.phoneVerified) {
    throw new ApiError(400, "Phone already verified");
  }

  // Verify OTP
  const isValidOTP = await verifyOTP(sessionId, otp, "phone_verification");
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  // Update tempData to mark phone as verified
  tempData.verificationStatus.phoneVerified = true;
  // save back in Redis or wherever you keep it
  await storeTempData(sessionId, tempData, 600); // refresh expiry

  return res.status(200).json(
    new ApiResponse(200, "Phone number verified successfully", {
      phoneVerified: true,
      accountComplete: false, // user not created yet
    })
  );
});

//step 6: Finalize registration and create user account
// registration.controller.js
const registerAccount = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const tempData = await getTempData(sessionId);
  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  if (
    !tempData.verificationStatus.emailVerified ||
    !tempData.verificationStatus.phoneVerified
  ) {
    throw new ApiError(400, "Please complete email & phone verification first");
  }

  // Final duplicate checks
  const existingEmail = await User.findOne({ email: tempData.userData.email });
  if (existingEmail) {
    await cleanupTempData(sessionId);
    throw new ApiError(400, "Email already in use");
  }

  const existingPhone = await User.findOne({
    phoneNumber: tempData.userData.phoneNumber,
  });
  if (existingPhone) {
    await cleanupTempData(sessionId);
    throw new ApiError(400, "Phone number already in use");
  }

  const existingUsername = await User.findOne({
    username: tempData.userData.username,
  });
  if (existingUsername) {
    await cleanupTempData(sessionId);
    throw new ApiError(400, "Username already in use");
  }

  // Create user account
  const userData = {
    ...tempData.userData,
    isEmailVerified: true,
    isPhoneVerified: true,
    emailVerifiedAt: new Date(),
    phoneVerifiedAt: new Date(),
    status: "active",
  };

  const user = await User.create(userData);
  if (!user) {
    throw new ApiError(500, "Error creating user account");
  }

  const sessionData = await sessionService.createSession(user._id, req);

  await cleanupTempData(sessionId);

  const userObj = user.toObject();
  delete userObj.password;
  const isProd = process.env.NODE_ENV === "production";

  const baseCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  return res
    .status(201)
    .cookie("accessToken", sessionData.accessToken, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", sessionData.refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(201, "Account created successfully!", {
        user: userObj,
        session: sessionData,
        accountComplete: true,
      })
    );
});

// Resend verification code (unified endpoint)
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { sessionId, type } = req.body; // type: 'email' or 'phoneNumber'

  if (!sessionId || !type) {
    throw new ApiError(400, "Session ID and verification type are required");
  }

  if (type === "email") {
    return sendEmailVerificationOTP(req, res);
  } else if (type === "phoneNumber") {
    return sendPhoneVerificationOTP(req, res);
  } else {
    throw new ApiError(400, "Invalid verification type");
  }
});

// Get registration status (optional helper endpoint)
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const tempData = await getTempData(sessionId);

  if (!tempData) {
    throw new ApiError(404, "Registration session not found or expired");
  }

  return res.status(200).json(
    new ApiResponse(200, "Registration status retrieved", {
      emailVerified: tempData.verificationStatus.emailVerified,
      phoneVerified: tempData.verificationStatus.phoneVerified,
      email: tempData.userData.email,
      phoneNumber: tempData.userData.phoneNumber,
      role: tempData.userData.role,
      createdAt: tempData.createdAt,
    })
  );
});

const login = asyncHandler(async (req, res) => {
  // Sanitized Data
  const sanitizedData = sanitize(req.body);

  // Zod Validation
  const validationResult = LoginSchema.safeParse(sanitizedData);

  const errorResponse = handleZodValidationError(validationResult, res);
  if (errorResponse) return;

  const validatedData = validationResult.data;

  const user = await User.findOne({ email: validatedData.email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check account status
  if (user.isLocked || (user.lockUntil && user.lockUntil > Date.now())) {
    throw new ApiError(423, "Account temporarily locked");
  }

  if (["suspended", "blocked"].includes(user.status)) {
    throw new ApiError(403, `Account ${user.status}`);
  }

  // Check if account is verified
  if (!user.isEmailVerified || !user.isPhoneVerified) {
    throw new ApiError(403, "Please complete account verification first");
  }

  const isPasswordMatch = await user.comparePassword(validatedData.password);

  if (!isPasswordMatch) {
    await user.incrementLoginAttempts();
    throw new ApiError(401, "Invalid credentials");
  }

  await user.resetLoginAttempts();
  user.lastLoginAt = new Date();
  await user.save();

  // Create session with tokens
  const sessionData = await sessionService.createSession(user._id, req);

  const userSafeData = user.toObject();
  delete userSafeData.password;

  const isProd = process.env.NODE_ENV === "production";
  const baseCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  const accessTokenOptions = { ...baseCookieOptions, maxAge: 15 * 60 * 1000 };
  const refreshTokenOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", sessionData.accessToken, accessTokenOptions)
    .cookie("refreshToken", sessionData.refreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(200, "Login successful", {
        user: userSafeData,
        session: {
          sessionId: sessionData.sessionId,
          accessToken: sessionData.accessToken,
          refreshToken: sessionData.refreshToken,
          expiresAt: sessionData.expiresAt,
        },
        deviceInfo: sessionData.deviceInfo,
      })
    );
});

// Refresh tokens
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token required");
  }

  try {
    const tokenData = await sessionService.refreshTokens(refreshToken);

    const userSafeData = tokenData.user.toObject();
    delete userSafeData.password;

    const isProd = process.env.NODE_ENV === "production";
    const baseCookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    };

    const accessTokenOptions = { ...baseCookieOptions, maxAge: 15 * 60 * 1000 };
    const refreshTokenOptions = {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", tokenData.accessToken, accessTokenOptions)
      .cookie("refreshToken", tokenData.refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(200, "Tokens refreshed successfully", {
          user: userSafeData,
          session: {
            sessionId: tokenData.sessionId,
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
          },
        })
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

// Logout from current session
const logout = asyncHandler(async (req, res) => {
  try {
    await sessionService.revokeSession(req.sessionId);

    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully", null));
  } catch (error) {
    throw new ApiError(500, "Error during logout");
  }
});

// Logout from all sessions
const logoutAll = asyncHandler(async (req, res) => {
  try {
    await sessionService.revokeAllSessions(req.user._id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Logged out from all devices successfully", null)
      );
  } catch (error) {
    throw new ApiError(500, "Error during logout from all devices");
  }
});

// Logout from other sessions (keep current session active)
const logoutOtherSessions = asyncHandler(async (req, res) => {
  try {
    await sessionService.revokeOtherSessions(req.user._id, req.sessionId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Logged out from other devices successfully", null)
      );
  } catch (error) {
    throw new ApiError(500, "Error during logout from other devices");
  }
});

// Get current user with session info
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, `Invalid user request`);

  return res.status(200).json(
    new ApiResponse(200, "User data retrieved successfully", {
      user: user.toObject(),
      sessionInfo: {
        sessionId: req.sessionId,
        deviceInfo: req.deviceInfo,
        lastActivity: new Date(),
      },
    })
  );
});

// Get all active sessions for current user
const getUserSessions = asyncHandler(async (req, res) => {
  try {
    const sessions = await sessionService.getUserSessions(req.user._id);

    return res.status(200).json(
      new ApiResponse(200, "Active sessions retrieved successfully", {
        sessions,
        currentSession: req.sessionId,
        totalSessions: sessions.length,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error retrieving sessions");
  }
});

// Revoke specific session by sessionId
const revokeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  if (sessionId === req.sessionId) {
    throw new ApiError(
      400,
      "Cannot revoke current session. Use logout instead."
    );
  }

  try {
    // Verify the session belongs to the current user
    const session = await Token.findOne({
      sessionId,
      userId: req.user._id,
      isActive: true,
    });

    if (!session) {
      throw new ApiError(404, "Session not found or already revoked");
    }

    await sessionService.revokeSession(sessionId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Session revoked successfully", null));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error revoking session");
  }
});

// Validate current session (health check)
const validateCurrentSession = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "Session is valid", {
      sessionId: req.sessionId,
      userId: req.user._id,
      deviceInfo: req.deviceInfo,
      validatedAt: new Date(),
    })
  );
});

// const logout = asyncHandler(async (req, res) => {
//   // Logout logic here (if applicable)
//   return res.status(200).json(new ApiResponse(200, "Logout successful", null));
// });

const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, dateOfBirth, email, phoneNumber } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update fields if provided
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.dateOfBirth = dateOfBirth || user.dateOfBirth;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;

  await user.save({ validateBeforeSave: true });

  return res.status(200).json(
    new ApiResponse(200, "User profile updated successfully", {
      user: user.toObject(),
    })
  );
});

const updateAvatar = asyncHandler(async (req, res) => {
  //file is already uploaded by multer middleware
  if (!req.file) {
    throw new ApiError(400, "No avatar file uploaded");
  }
  else{
    console.log("Uploaded file info:", req.file);
  }
  
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    // Upload on cloudinary 
  const uploadResult = await uploadOnCloudinary(req.file.path, 'avatars');

  // Update user's avatar URL
  user.avatar = uploadResult.secure_url;
  await user.save();
  console.log("Avatar updated successfully:", user.avatar);

  } catch (error) {
    throw new ApiError(500, "Error uploading avatar");
  }

  return res.status(200).json(
    new ApiResponse(200, "Avatar updated successfully", {
      avatar: user.avatar,
    })
  );
});

const updatePassword = asyncHandler(async (req, res) => {});

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

const getUserById = asyncHandler(async (req, res) => {});

// const getCurrentUser = asyncHandler(async (req, res) => {});

export {
  InitialUserRegister,
  sendEmailVerificationOTP,
  verifyEmail,
  sendPhoneVerificationOTP,
  verifyPhone,
  registerAccount,
  resendVerificationCode,
  getRegistrationStatus,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  logoutOtherSessions,
  getCurrentUser,
  getUserSessions,
  revokeSession,
  validateCurrentSession,
  updateUserProfile,
  updateAvatar,
  updatePassword,
  forgotPassword,
  resetPassword,
  getUserById,
};
