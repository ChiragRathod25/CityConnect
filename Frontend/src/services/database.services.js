import axiosInstace from "../utils/axios.js";
import { handleApiRequest } from "../utils/apiHelper.js";

export class DatabaseService {
  async InitialUserRegister({ username, email, password, phoneNumber, role }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/initialRegister", {
          username,
          email,
          password,
          phoneNumber,
          role,
        }),
      "Initial User Register"
    );
  }

  async sendEmailVerificationOTP({ sessionId }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/send-email-verification-otp", {
          sessionId,
        }),
      "Send Email Verification OTP"
    );
  }

  async verifyEmail({ sessionId, otp }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/verify-email", {
          otp,
          sessionId,
        }),
      "Verify Email"
    );
  }

  async sendPhoneVerificationOTP({ sessionId }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/send-phone-verification-otp", {
          sessionId,
        }),
      "Send Phone Verification OTP"
    );
  }

  async verifyPhone({ sessionId, otp }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/verify-phone", {
          sessionId,
          otp,
        }),
      "Verify Phone"
    );
  }

  async completeUserRegistration({ sessionId }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/complete-registration", { sessionId }),
      "Complete User Registration"
    );
  }

  async getCurrentuser() {
    return handleApiRequest(
      () => axiosInstace.get("/api/v1/user/getCurrentUser"),
      "Get Current User"
    );
  }

  async refreshAccessToken(){
    return handleApiRequest(
      () => axiosInstace.get("/api/v1/user/refresh-token"),
      "Refresh Access Token"
    );
  }


  async login({ email, password }) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/user/login", {
          email,
          password,
        }),
      "User Login"
    );
  }

  async logout() {
    return handleApiRequest(
      () => axiosInstace.post("/api/v1/user/logout"),
      "User Logout"
    );
  }
  
}
const databaseService = new DatabaseService();
export default databaseService;
