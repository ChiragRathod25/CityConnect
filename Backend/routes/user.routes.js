import {Router} from "express"

const router = Router()

import {
   InitialUserRegister,
    sendEmailVerificationOTP,
    verifyEmail,
    sendPhoneVerificationOTP,
    verifyPhone,
    registerAccount,
    
    login,
    logout,
    updateUserProfile,
    updateAvatar,
    updatePassword,
    forgotPassword,
    resetPassword,
    getUserById,
    getCurrentUser,
    refreshAccessToken
}
from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post("/initialRegister", InitialUserRegister);
router.post("/send-email-verification-otp", sendEmailVerificationOTP);
router.post("/verify-email", verifyEmail);
router.post("/send-phone-verification-otp", sendPhoneVerificationOTP);
router.post("/verify-phone", verifyPhone);
router.post("/complete-registration", registerAccount);

router.post("/login", login);
router.get("/refresh-token", 
    refreshAccessToken,
);

router.use(verifyJWT); // Protect all routes below this middleware
router.get("/getCurrentUser", getCurrentUser);
router.put("/update-user-profile", updateUserProfile);
router.put("/update-avatar",upload.single("avatar"), updateAvatar);
router.put("/update-password", updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/:id", getUserById);

router.post("/logout", logout);
router.post("/test", (req, res) => {
    res.status(200).json({ message: "Test endpoint working!" });
});

export default router;