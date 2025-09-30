import axiosInstace from "../utils/axios.js";
import { handleApiRequest } from "../utils/apiHelper.js";
import toast from "react-hot-toast";

export class DatabaseService {
  async InitialUserRegister({ username, email, password, phoneNumber, role }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/initialRegister", {
            username,
            email,
            password,
            phoneNumber,
            role,
          }),
        "Initial User Register"
      ),
      {
        loading: "Registering...",
        success: "Registration Successful! Please verify your email/phone.",
        error: "Registration Failed. Please try again.",
      }
    );
  }

  async sendEmailVerificationOTP({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/send-email-verification-otp", {
            sessionId,
          }),
        "Send Email Verification OTP"
      ),
      {
        loading: "Sending OTP...",
        success: "OTP sent to your email!",
        error: "Failed to send OTP. Please try again.",
      }
    );
  }

  async verifyEmail({ sessionId, otp }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/verify-email", {
            otp,
            sessionId,
          }),
        "Verify Email"
      ),
      {
        loading: "Verifying OTP...",
        success: "Email verified successfully!",
        error: "OTP verification failed. Please try again.",
      }
    );
  }

  async sendPhoneVerificationOTP({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/send-phone-verification-otp", {
            sessionId,
          }),
        "Send Phone Verification OTP"
      ),
      {
        loading: "Sending OTP...",
        success: "OTP sent to your phone!",
        error: "Failed to send OTP. Please try again.",
      }
    );
  }

  async verifyPhone({ sessionId, otp }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/verify-phone", {
            sessionId,
            otp,
          }),
        "Verify Phone"
      ),
      {
        loading: "Verifying OTP...",
        success: "Phone number verified successfully!",
        error: "OTP verification failed. Please try again.",
      }
    );
  }

  async completeUserRegistration({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/complete-registration", {
            sessionId,
          }),
        "Complete User Registration"
      ),
      {
        loading: "Completing registration...",
        success: "Registration completed successfully! You can now log in.",
        error: "Failed to complete registration. Please try again.",
      }
    );
  }

  async getCurrentuser() {
    return handleApiRequest(
        () => axiosInstace.get("/api/v1/user/getCurrentUser"),
        "Get Current User"
      );
  }

  async refreshAccessToken() {
    return handleApiRequest(
        () => axiosInstace.get("/api/v1/user/refresh-token"),
        "Refresh Access Token"
      );
  }

  async login({ email, password }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/login", {
            email,
            password,
          }),
        "User Login"
      ),
      {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Login failed. Please check your credentials and try again.",
      }
    );
  }

  async logout() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.post("/api/v1/user/logout"),
        "User Logout"
      ),
      {
        loading: "Logging out...",
        success: "Logout successful!",
        error: "Logout failed. Please try again.",
      }
    );
  }
}
const databaseService = new DatabaseService();
export default databaseService;
