import {Router} from "express"

const router = Router()

import {
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
}
from "../controllers/user.controller.js"

router.post("/register", registerUser);
router.post("/login", login);

router.post("/send-email-verification-otp", sendEmailVerificationOTP);
router.post("/verify-email", verifyEmail);
router.post("/send-phone-verification-otp", sendPhoneVerificationOTP);
router.post("/verify-phone", verifyPhone);

router.put("/update-user-profile", updateUserProfile);
router.put("/update-avatar", updateAvatar);
router.put("/update-password", updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/:id", getUserById);
router.get("/getCurrentUser", getCurrentUser);

router.post("/logout", logout);

export default router;