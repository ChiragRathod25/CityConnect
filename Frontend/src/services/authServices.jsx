const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Step 1: Store registration data temporarily (returns sessionId)
export const registerUser = async (userData) => {
  return apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Step 2: Send email verification OTP using sessionId
export const sendEmailVerification = async (sessionId) => {
  return apiCall("/auth/send-email-verification", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
};

// Step 3: Verify email OTP using sessionId
export const verifyEmail = async (sessionId, otp) => {
  return apiCall("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ sessionId, otp }),
  });
};

// Step 4: Send phone verification OTP using sessionId
export const sendPhoneVerification = async (sessionId) => {
  return apiCall("/auth/send-phone-verification", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
};

// Step 5: Verify phone OTP & create user account using sessionId
export const verifyPhone = async (sessionId, otp) => {
  return apiCall("/auth/verify-phone", {
    method: "POST",
    body: JSON.stringify({ sessionId, otp }),
  });
};

// Resend verification code using sessionId
export const resendVerificationCode = async (sessionId, type) => {
  return apiCall("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ sessionId, type }),
  });
};

// Get current registration status (optional)
export const getRegistrationStatus = async (sessionId) => {
  return apiCall(`/auth/registration-status/${sessionId}`, {
    method: "GET",
  });
};

// Login user
export const login = async (credentials) => {
  return apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// Logout user
export const logout = async () => {
  return apiCall("/auth/logout", {
    method: "POST",
  });
};

// Optional: Export all functions as a single object for easier migration
export const authService = {
  registerUser,
  sendEmailVerification,
  verifyEmail,
  sendPhoneVerification,
  verifyPhone,
  resendVerificationCode,
  getRegistrationStatus,
  login,
  logout,
};
