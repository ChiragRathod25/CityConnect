import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.js";
import {
  sendEmailVerification,
  sendMobileVerification,
} from "../utils/sendVerification.js";

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  console.log("Generated OTP:", otp); // Log the generated OTP for debugging
  return otp;
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone,role } = req.body;

  //check duplicate email or phone
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new ApiError(400, "Email or Phone already in use");
  }

  //check duplicate username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(400, "Username already in use");
  }

  //create user
  const user = await User.create({ username, email, password, phone,role });

  if (!user) {
    throw new ApiError(500, "Error creating user");
  }

  return res
    .status(201)
    .json(new ApiResponce(201, user, "User registered successfully"));
});

const sendEmailVerificationOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  //generate OTP
  const otp = generateOTP(); 

  try {
    //save OTP to DB
    await OTP.createOTP(userId, otp, "email_verification", 10 * 60); //expires in 10 minutes
  
    //send OTP via email
    const emailResponse = await sendEmailVerification({
      email: user.email,
      verificationCode: otp,
    });
    console.log(emailResponse);
    return res
      .status(200)
      .json(new ApiResponce(200, emailResponse, "Verification email sent"));
  } catch (error) {
    // throw error
    throw new ApiError(500, "Error sending verification email", error);
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    //verify OTP
    const isValidOTP = await OTP.verifyOTP(userId, otp, "email_verification");
    if (!isValidOTP) {
      throw new ApiError(400, "Invalid or expired OTP");
    }
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();
  
    return res
      .status(200)
      .json(new ApiResponce(200, user, "Email verified successfully"));
  } catch (error) {
    throw new ApiError(500, "Error verifying email", error);
  }
});

const sendPhoneVerificationOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.isPhoneVerified) {
    throw new ApiError(400, "Phone already verified");
  }

  try {
    //generate OTP
    const otp = generateOTP();
    //save OTP to DB
    await OTP.createOTP(userId, otp, "phone_verification", 10 * 60); //expires in 10 minutes
  
    //send OTP via SMS
    const smsResponse = await sendMobileVerification({
      phoneNumber: user.phone,
      
      verificationCode: otp,
    });
  
    return res
      .status(200)
      .json(new ApiResponce(200, smsResponse, "Verification SMS sent"));
  } catch (error) {
    throw new ApiError(500, "Error sending verification SMS", error);
  }
});

const verifyPhone = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //verify OTP
  const isValidOTP = await OTP.verifyOTP(userId, otp, "phone_verification");
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
  user.isPhoneVerified = true;
  user.phoneVerifiedAt = new Date();
  await user.save();

  return res
    .status(200)
    .json(new ApiResponce(200, user, "Phone verified successfully"));
});

const login=asyncHandler(async (req, res) => {
    // Login logic here
    const { email, username,password } = req.body;

    if(!email && !username){
        throw new ApiError(400,"Email or Username is required");
    }
    if(!password){
        throw new ApiError(400,"Password is required");
    }
    const user=await User.findOne({$or:[{email},{username}]});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const isPasswordMatch=await user.comparePassword(password);
    if(!isPasswordMatch){
        throw new ApiError(401,"Invalid credentials");
    }


    return res.status(200).json(new ApiResponce(200,user,"Login successful"));
});

const logout = asyncHandler(async (req, res) => {
    // Logout logic here (if applicable)
    return res.status(200).json(new ApiResponce(200, null, "Logout successful"));
});


const updateUserProfile = asyncHandler(async (req, res) => {
});

const updateAvatar= asyncHandler(async (req, res) => {
} );

const updatePassword = asyncHandler(async (req, res) => {
});

const forgotPassword = asyncHandler(async (req, res) => {
});

const resetPassword = asyncHandler(async (req, res) => {
});


const getUserById = asyncHandler(async (req, res) => {
} );

const getCurrentUser = asyncHandler(async (req, res) => {
} );



export {
    registerUser,
    sendEmailVerificationOTP,
    verifyEmail,
    sendPhoneVerificationOTP,
    verifyPhone,
    login,
    logout,
    updateUserProfile,
    updateAvatar,
    updatePassword,
    forgotPassword,
    resetPassword,
    getUserById,
    getCurrentUser
};
