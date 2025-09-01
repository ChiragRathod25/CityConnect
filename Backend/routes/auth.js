import {Router} from "express"

const router = Router()

import {
    registerUser,
    sendEmailVerificationOTP,
    verifyEmail,
    sendPhoneVerificationOTP,
    verifyPhone,
    login
}
from "../controllers/auth.js"

router.post("/register", registerUser);
router.post("/send-email-verification-otp", sendEmailVerificationOTP);
router.post("/verify-email", verifyEmail);
router.post("/send-phone-verification-otp", sendPhoneVerificationOTP);
router.post("/verify-phone", verifyPhone);
router.post("/login", login);

export default router;