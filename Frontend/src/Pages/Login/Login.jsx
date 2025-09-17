import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  User,
  Star,
} from "lucide-react";
import { GeometricShapes, MovingDots } from "../../components/CustomAnimation";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import databaseService from "@/services/database.services";
import { useDispatch } from "react-redux";
import { login } from "@/slices/userSlice/authSlices";
import { useNavigate } from "react-router-dom";

const OTPInput = ({ value, onChange, error }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString !== value) {
      onChange({ target: { value: otpString } });
    }
  }, [otp, onChange, value]);

  useEffect(() => {
    if (value.length === 0) {
      setOtp(Array(6).fill(""));
    }
  }, [value]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto focus next input
    if (element.value && index < 5) {
      const nextInput =
        element.parentElement.nextElementSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput =
        e.target.parentElement.previousElementSibling?.querySelector("input");
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    // Handle paste
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-1" style={{ color: "#1f2937" }}>
          Enter 6-digit code
        </h3>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-3">
        {otp.map((digit, index) => (
          <div key={index} className="relative">
            <input
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-all duration-300 transform focus:scale-110 ${
                error
                  ? "border-red-400 bg-red-50"
                  : digit
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500"
              }`}
              style={{
                color: error ? "#ef4444" : digit ? "#059669" : "#1f2937",
              }}
            />
            {digit && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
};

const RoleSelection = ({ onSelectRole }) => {
  const roles = [
    {
      id: "businessman",
      title: "Businessman",
      description: "For business owners and entrepreneurs",
      icon: <Briefcase className="w-8 h-8" />,
      bgColor: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    },
    {
      id: "user",
      title: "User",
      description: "For individual customers and users",
      icon: <User className="w-8 h-8" />,
      bgColor: "linear-gradient(135deg, #10b981, #047857)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 mx-auto rounded-xl animate-bounce hover:transition-transform hover:rotate-360 hover:duration-1000 hover:scale-110 flex items-center justify-center bg-[#6366f1] text-white mb-2 transition-all duration-300`}
        >
          <svg
            className={`w-8 h-8 transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <Star className="w-8 h-8 " />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>
          Select Your Role
        </h2>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          Choose the option that best describes you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-6 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "#f8fafc",
              borderColor: "#d1d5db",
            }}
            onClick={() => onSelectRole(role.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110"
                style={{ background: role.bgColor }}
              >
                <div className="text-white hover:transition-transform hover:rotate-360 hover:duration-1000">
                  {role.icon}
                </div>
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#1f2937" }}
              >
                {role.title}
              </h3>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-gray-800 hover:text-gray-600 font-medium transition-colors"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [currentStep, setCurrentStep] = useState("role-selection");
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMethod, setForgotPasswordMethod] = useState("email");
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    resetEmail: "",
    resetPhone: "",
  });

  const [errors, setErrors] = useState({
    resetEmail: "",
    resetPhone: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    return phoneRegex.test(phone);
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep("login-form");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (name === "resetEmail" || name === "resetPhone") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await databaseService.login({
        email: formData.email,
        password: formData.password,
      });
      if (response.statusCode === 200) {
        dispatch(login(response.data));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validate input based on method
    let isValid = true;
    const newErrors = { resetEmail: "", resetPhone: "" };

    if (forgotPasswordMethod === "email") {
      if (!formData.resetEmail) {
        newErrors.resetEmail = "Email is required";
        isValid = false;
      } else if (!validateEmail(formData.resetEmail)) {
        newErrors.resetEmail = "Please enter a valid email address";
        isValid = false;
      }
    } else {
      if (!formData.resetPhone) {
        newErrors.resetPhone = "Phone number is required";
        isValid = false;
      } else if (!validatePhone(formData.resetPhone)) {
        newErrors.resetPhone = "Please enter a valid phone number";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowVerifyCode(true);
      startResendTimer();
    }, 2000);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false);
      setResetEmailSent(true); // Show success message
    }, 2000);
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    // Simulate resend API call
    setTimeout(() => {
      setIsLoading(false);
      startResendTimer();
      setOtp("");
      setOtpError("");
    }, 1000);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setShowVerifyCode(false);
    setResetEmailSent(false);
    setOtp("");
    setOtpError("");
    setResendTimer(0);
    setFormData((prev) => ({ ...prev, resetEmail: "", resetPhone: "" }));
    setErrors({ resetEmail: "", resetPhone: "" });
  };

  const backToRoleSelection = () => {
    setCurrentStep("role-selection");
    setSelectedRole("");
  };

  const isFormValid = formData.email.trim() && formData.password;

  if (showForgotPassword) {
    return (
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
        {showVerifyCode ? (
          /* Verification Code Screen */
          <>
            <div className="text-center mb-4">
              <button
                onClick={resetForgotPassword}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Enter Verification Code
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to{" "}
                <span className="font-medium">
                  {forgotPasswordMethod === "phone"
                    ? formData.resetPhone
                    : formData.resetEmail}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              <OTPInput
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={otpError}
              />

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendCode}
                  variant="secondary"
                  disabled={resendTimer > 0 || isLoading}
                  className="text-sm font-medium text-gray-800 mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code"}
                </Button>
              </div>

              <Button
                variant="success"
                onClick={handleVerifyCode}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
          </>
        ) : !resetEmailSent ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <button
                onClick={resetForgotPassword}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Choose how you'd like to reset your password
              </p>
            </div>

            {/* Method Selection */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setForgotPasswordMethod("email")}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  forgotPasswordMethod === "email"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => setForgotPasswordMethod("phone")}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  forgotPasswordMethod === "phone"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </button>
            </div>

            {/* Reset Form */}
            <div onSubmit={handleForgotPassword}>
              {forgotPasswordMethod === "email" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="resetEmail"
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                      errors.resetEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.resetEmail && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.resetEmail}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    We'll send a verification code to your email address
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="resetPhone"
                    value={formData.resetPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                      errors.resetPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.resetPhone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.resetPhone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    We'll send a verification code to your phone number
                  </p>
                </div>
              )}
              <Button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Code Verified!
            </h1>
            <p className="text-gray-600 mb-6">
              {forgotPasswordMethod === "phone" ? (
                <>
                  Your phone number has been verified. You can now create a new
                  password.
                </>
              ) : (
                <>
                  Your email has been verified. You can now create a new
                  password.
                </>
              )}
            </p>
            <button
              onClick={resetForgotPassword}
              className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === "role-selection") {
    return (
      <div className="md:min-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
        <MovingDots count={500} density={100} />
        <GeometricShapes />
        <RoleSelection onSelectRole={handleRoleSelection} />
      </div>
    );
  }

  return (
    <div className="md:min-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
      <MovingDots count={500} density={100} />
      <GeometricShapes />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={backToRoleSelection}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Role
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your {selectedRole} account</p>
      </div>

      {/* Login Form */}
      <div onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-gray-800 border-gray-300 rounded "
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-gray-800 hover:text-gray-600 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={isLoading || !isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isFormValid
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              className="text-gray-800 hover:text-gray-600 font-medium transition-colors"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
