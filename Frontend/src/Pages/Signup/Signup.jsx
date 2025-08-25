import { useState, useEffect, useRef } from "react";

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState("signup");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [twoFAData, setTwoFAData] = useState({
    selectedMethod: "email",
    emailCode: "",
    phoneCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTwoFAChange = (e) => {
    const { name, value } = e.target;
    setTwoFAData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("2fa-setup");
    }, 2000);
  };

  const sendVerificationCode = async (method) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("2fa-verify");
    }, 2000);
  };

  const verifyCode = async () => {
    setIsLoading(true);

    const newErrors = {};

    if (twoFAData.selectedMethod === "email" && !twoFAData.emailCode) {
      newErrors.emailCode = "Email verification code is required";
    }

    if (twoFAData.selectedMethod === "phone" && !twoFAData.phoneCode) {
      newErrors.phoneCode = "Phone verification code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      alert("2FA setup completed successfully! 🎉");
    }, 2000);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
      return 4;
    return 3;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
      <div className="relative z-10 min-h-screen min-w-xl flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="backdrop-blur-xl border shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 rounded-3xl" 
               style={{ 
                 backgroundColor: '#ffffff',
                 borderColor: '#d1d5db',
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
               }}>
            {currentStep === "signup" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: '#1f2937' }}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
                    Create Account
                  </h1>
                  <p style={{ color: '#6b7280' }}>Join our community today</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Username
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        style={{ 
                          backgroundColor: '#f8fafc',
                          borderColor: errors.username ? '#ef4444' : '#d1d5db',
                          color: '#1f2937'
                        }}
                        placeholder="Enter your username"
                      />
                      {formData.username && !errors.username && (
                        <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Email
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        style={{ 
                          backgroundColor: '#f8fafc',
                          borderColor: errors.email ? '#ef4444' : '#d1d5db',
                          color: '#1f2937'
                        }}
                        placeholder="Enter your email"
                      />
                      {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                        <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        style={{ 
                          backgroundColor: '#f8fafc',
                          borderColor: errors.phoneNumber ? '#ef4444' : '#d1d5db',
                          color: '#1f2937'
                        }}
                        placeholder="+1 (555) 123-4567"
                      />
                      {formData.phoneNumber && !errors.phoneNumber && (
                        <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Password
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        style={{ 
                          backgroundColor: '#f8fafc',
                          borderColor: errors.password ? '#ef4444' : '#d1d5db',
                          color: '#1f2937'
                        }}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-gray-700 transition-colors"
                        style={{ color: '#9ca3af' }}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                passwordStrength() >= level
                                  ? getPasswordStrengthColor(passwordStrength())
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                          Strength: {getPasswordStrengthText(passwordStrength())}
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
                    style={{ 
                      backgroundColor: '#374151',
                      boxShadow: '0 10px 25px rgba(55, 65, 81, 0.3)'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6L16 12L10 18L8.59 16.59Z"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p style={{ color: '#6b7280' }}>
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="font-semibold hover:underline transition-colors"
                      style={{ color: '#374151' }}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </>
            )}

            {currentStep === "2fa-setup" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: '#6b7280' }}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-"/>
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
                    Setup 2FA
                  </h1>
                  <p style={{ color: '#6b7280' }}>
                    Secure your account with two-factor authentication
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Choose verification method:
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
                             style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db' }}>
                        <input
                          type="radio"
                          name="selectedMethod"
                          value="email"
                          checked={twoFAData.selectedMethod === "email"}
                          onChange={handleTwoFAChange}
                          className="w-4 h-4 text-gray-600"
                        />
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span style={{ color: '#1f2937' }}>
                          Email verification
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
                             style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db' }}>
                        <input
                          type="radio"
                          name="selectedMethod"
                          value="phone"
                          checked={twoFAData.selectedMethod === "phone"}
                          onChange={handleTwoFAChange}
                          className="w-4 h-4 text-gray-600"
                        />
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span style={{ color: '#1f2937' }}>
                          Phone verification
                        </span>
                      </label>
                    </div>
                  </div>

                  {twoFAData.selectedMethod === "email" && (
                    <div className="p-4 rounded-xl border"
                         style={{ backgroundColor: '#f8fafc', borderColor: '#d1d5db' }}>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-sm" style={{ color: '#6b7280' }}>
                          Verification will be sent to:
                        </span>
                      </div>
                      <p className="font-medium mt-1" style={{ color: '#1f2937' }}>
                        {formData.email}
                      </p>
                    </div>
                  )}

                  {twoFAData.selectedMethod === "phone" && (
                    <div className="p-4 rounded-xl border"
                         style={{ backgroundColor: '#f8fafc', borderColor: '#d1d5db' }}>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm" style={{ color: '#6b7280' }}>
                          Verification will be sent to:
                        </span>
                      </div>
                      <p className="font-medium mt-1" style={{ color: '#1f2937' }}>
                        {formData.phoneNumber}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => sendVerificationCode(twoFAData.selectedMethod)}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
                    style={{ 
                      backgroundColor: '#6b7280',
                      boxShadow: '0 10px 25px rgba(107, 114, 128, 0.3)'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentStep("signup")}
                    className="w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center space-x-2"
                    style={{ 
                      backgroundColor: '#f8fafc',
                      borderColor: '#d1d5db',
                      color: '#6b7280'
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
                    </svg>
                    <span>Back to Signup</span>
                  </button>
                </div>
              </>
            )
            }

            {currentStep === "2fa-verify" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: '#9ca3af' }}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
                    Verify Code
                  </h1>
                  <p style={{ color: '#6b7280' }}>
                    Enter the verification code sent to your device
                  </p>
                </div>

                <div className="space-y-6">
                  {twoFAData.selectedMethod === "email" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                        Email Verification Code
                        <span className="text-green-600 ml-2">
                          ✓ Sent to {formData.email}
                        </span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input
                          type="text"
                          name="emailCode"
                          value={twoFAData.emailCode}
                          onChange={handleTwoFAChange}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-center text-xl tracking-widest"
                          style={{ 
                            backgroundColor: '#f8fafc',
                            borderColor: errors.emailCode ? '#ef4444' : '#d1d5db',
                            color: '#1f2937'
                          }}
                          placeholder="000000"
                          maxLength="6"
                        />
                      </div>
                      {errors.emailCode && (
                        <p className="text-red-500 text-sm">{errors.emailCode}</p>
                      )}
                    </div>
                  )}

                  {twoFAData.selectedMethod === "phone" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                        Phone Verification Code
                        <span className="text-green-600 ml-2">
                          ✓ Sent to {formData.phoneNumber}
                        </span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          type="text"
                          name="phoneCode"
                          value={twoFAData.phoneCode}
                          onChange={handleTwoFAChange}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-center text-xl tracking-widest"
                          style={{ 
                            backgroundColor: '#f8fafc',
                            borderColor: errors.phoneCode ? '#ef4444' : '#d1d5db',
                            color: '#1f2937'
                          }}
                          placeholder="000000"
                          maxLength="6"
                        />
                      </div>
                      {errors.phoneCode && (
                        <p className="text-red-500 text-sm">{errors.phoneCode}</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={verifyCode}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
                    style={{ 
                      backgroundColor: '#374151',
                      boxShadow: '0 10px 25px rgba(55, 65, 81, 0.3)'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => sendVerificationCode(twoFAData.selectedMethod)}
                    className="w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center space-x-2"
                    style={{ 
                      backgroundColor: '#f8fafc',
                      borderColor: '#d1d5db',
                      color: '#6b7280'
                    }}
                  >
                    {twoFAData.selectedMethod === "email" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                    <span>Resend Code</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep("2fa-setup")}
                    className="w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center space-x-2"
                    style={{ 
                      backgroundColor: '#f8fafc',
                      borderColor: '#d1d5db',
                      color: '#6b7280'
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
                    </svg>
                    <span>Back to Setup</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
    </div>
  );
}











// ? ============================================================================


// import React, { useState } from "react";
// import {
//   Eye,
//   EyeOff,
//   User,
//   Mail,
//   Lock,
//   ArrowRight,
//   Check,
//   Phone,
//   Shield,
//   Send,
//   ArrowLeft,
// } from "lucide-react";

// export default function SignupPage() {
//   const [currentStep, setCurrentStep] = useState("signup"); // 'signup', '2fa-setup', '2fa-verify'
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//   });
//   const [twoFAData, setTwoFAData] = useState({
//     selectedMethod: "email", // 'email', 'phone'
//     emailCode: "",
//     phoneCode: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [codeSent, setCodeSent] = useState({ email: false, phone: false });

//   const handleTwoFAChange = (e) => {
//     const { name, value } = e.target;
//     setTwoFAData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = "Phone number is required";
//     } else if (
//       !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ""))
//     ) {
//       newErrors.phoneNumber = "Please enter a valid phone number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       setCurrentStep("2fa-setup"); // Move to 2FA setup instead of showing alert
//     }, 2000);
//   };

//   const sendVerificationCode = async (method) => {
//     setIsLoading(true);

//     // Simulate sending code
//     setTimeout(() => {
//       setCodeSent((prev) => ({
//         ...prev,
//         [method]: true,
//       }));
//       setIsLoading(false);
//       setCurrentStep("2fa-verify");
//     }, 2000);
//   };

//   const verifyCode = async () => {
//     setIsLoading(true);

//     const newErrors = {};

//     if (twoFAData.selectedMethod === "email" && !twoFAData.emailCode) {
//       newErrors.emailCode = "Email verification code is required";
//     }

//     if (twoFAData.selectedMethod === "phone" && !twoFAData.phoneCode) {
//       newErrors.phoneCode = "Phone verification code is required";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setIsLoading(false);
//       return;
//     }

//     // Simulate verification
//     setTimeout(() => {
//       setIsLoading(false);
//       alert("2FA setup completed successfully! 🎉");
//     }, 2000);
//   };

//   const passwordStrength = () => {
//     const password = formData.password;
//     if (password.length === 0) return 0;
//     if (password.length < 6) return 1;
//     if (password.length < 8) return 2;
//     if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
//       return 4;
//     return 3;
//   };

//   const getPasswordStrengthColor = (strength) => {
//     switch (strength) {
//       case 1:
//         return "bg-red-500";
//       case 2:
//         return "bg-yellow-500";
//       case 3:
//         return "bg-blue-500";
//       case 4:
//         return "bg-green-500";
//       default:
//         return "bg-gray-300";
//     }
//   };

//   const getPasswordStrengthText = (strength) => {
//     switch (strength) {
//       case 1:
//         return "Weak";
//       case 2:
//         return "Fair";
//       case 3:
//         return "Good";
//       case 4:
//         return "Strong";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="min-h-screen py-10 md:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
//       {/* Animated background elements with MUI colors */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/6 left-1/6 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-2/3 left-1/2 w-60 h-60 bg-indigo-200/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
//         <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-3000"></div>
//       </div>

//       {/* Dotted pattern overlay */}
//       <div className="absolute inset-0 opacity-30">
//         <div
//           className="w-full h-full"
//           style={{
//             backgroundImage: `radial-gradient(circle, #3f51b5 1px, transparent 1px)`,
//             backgroundSize: "40px 40px",
//           }}
//         ></div>
//       </div>

//       {/* Additional floating dots */}
//       <div className="absolute inset-0">
//         {[...Array(50)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute rounded-full animate-pulse ${
//               i % 4 === 0
//                 ? "bg-blue-400/20 w-3 h-3"
//                 : i % 4 === 1
//                 ? "bg-purple-400/20 w-2 h-2"
//                 : i % 4 === 2
//                 ? "bg-indigo-400/20 w-4 h-4"
//                 : "bg-cyan-400/20 w-2.5 h-2.5"
//             }`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${2 + Math.random() * 3}s`,
//             }}
//           ></div>
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//         <div className="w-full max-w-lg">
//           {/* Glassmorphism card */}
//           <div className="backdrop-blur-xl bg-white/80 rounded-3xl border border-white/40 shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
//             {currentStep === "signup" && (
//               <>
//                 {/* Signup Header */}
//                 <div className="text-center mb-8">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
//                     <User className="w-10 h-10 text-white" />
//                   </div>
//                   <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                     Create Account
//                   </h1>
//                   <p className="text-gray-600">Join our community today</p>
//                 </div>

//                 {/* Signup Form */}
//                 <div className="space-y-6">
//                   {/* Username field */}
//                   <div className="space-y-2">
//                     <label className="text-gray-700 text-sm font-medium">
//                       Username
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                       <input
//                         type="text"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                         className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                           errors.username ? "border-red-400" : "border-gray-300"
//                         } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
//                         placeholder="Enter your username"
//                       />
//                       {formData.username && !errors.username && (
//                         <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
//                       )}
//                     </div>
//                     {errors.username && (
//                       <p className="text-red-500 text-sm">{errors.username}</p>
//                     )}
//                   </div>

//                   {/* Email field */}
//                   <div className="space-y-2">
//                     <label className="text-gray-700 text-sm font-medium">
//                       Email
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                           errors.email ? "border-red-400" : "border-gray-300"
//                         } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
//                         placeholder="Enter your email"
//                       />
//                       {formData.email &&
//                         !errors.email &&
//                         /\S+@\S+\.\S+/.test(formData.email) && (
//                           <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
//                         )}
//                     </div>
//                     {errors.email && (
//                       <p className="text-red-500 text-sm">{errors.email}</p>
//                     )}
//                   </div>

//                   {/* Phone Number field */}
//                   <div className="space-y-2">
//                     <label className="text-gray-700 text-sm font-medium">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                           errors.phoneNumber
//                             ? "border-red-400"
//                             : "border-gray-300"
//                         } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
//                         placeholder="+1 (555) 123-4567"
//                       />
//                       {formData.phoneNumber && !errors.phoneNumber && (
//                         <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
//                       )}
//                     </div>
//                     {errors.phoneNumber && (
//                       <p className="text-red-500 text-sm">
//                         {errors.phoneNumber}
//                       </p>
//                     )}
//                   </div>

//                   {/* Password field */}
//                   <div className="space-y-2">
//                     <label className="text-gray-700 text-sm font-medium">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         className={`w-full pl-12 pr-12 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                           errors.password ? "border-red-400" : "border-gray-300"
//                         } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
//                         placeholder="Enter your password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>

//                     {/* Password strength indicator */}
//                     {formData.password && (
//                       <div className="mt-2">
//                         <div className="flex space-x-1 mb-1">
//                           {[1, 2, 3, 4].map((level) => (
//                             <div
//                               key={level}
//                               className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
//                                 passwordStrength() >= level
//                                   ? getPasswordStrengthColor(passwordStrength())
//                                   : "bg-gray-300"
//                               }`}
//                             ></div>
//                           ))}
//                         </div>
//                         <p className="text-xs text-gray-600">
//                           Strength:{" "}
//                           {getPasswordStrengthText(passwordStrength())}
//                         </p>
//                       </div>
//                     )}

//                     {errors.password && (
//                       <p className="text-red-500 text-sm">{errors.password}</p>
//                     )}
//                   </div>

//                   {/* Submit button */}
//                   <button
//                     onClick={handleSubmit}
//                     disabled={isLoading}
//                     className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
//                   >
//                     {isLoading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Creating Account...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Create Account</span>
//                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-8 text-center">
//                   <p className="text-gray-600">
//                     Already have an account?{" "}
//                     <a
//                       href="#"
//                       className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
//                     >
//                       Sign In
//                     </a>
//                   </p>
//                 </div>
//               </>
//             )}

//             {currentStep === "2fa-setup" && (
//               <>
//                 {/* 2FA Setup Header */}
//                 <div className="text-center mb-8">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
//                     <Shield className="w-10 h-10 text-white" />
//                   </div>
//                   <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                     Setup 2FA
//                   </h1>
//                   <p className="text-gray-600">
//                     Secure your account with two-factor authentication
//                   </p>
//                 </div>

//                 {/* 2FA Method Selection */}
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <label className="text-gray-700 text-sm font-medium">
//                       Choose verification method:
//                     </label>

//                     <div className="space-y-3">
//                       <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors">
//                         <input
//                           type="radio"
//                           name="selectedMethod"
//                           value="email"
//                           checked={twoFAData.selectedMethod === "email"}
//                           onChange={handleTwoFAChange}
//                           className="w-4 h-4 text-blue-600"
//                         />
//                         <Mail className="w-5 h-5 text-gray-600" />
//                         <span className="text-gray-800">
//                           Email verification
//                         </span>
//                       </label>

//                       <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors">
//                         <input
//                           type="radio"
//                           name="selectedMethod"
//                           value="phone"
//                           checked={twoFAData.selectedMethod === "phone"}
//                           onChange={handleTwoFAChange}
//                           className="w-4 h-4 text-blue-600"
//                         />
//                         <Phone className="w-5 h-5 text-gray-600" />
//                         <span className="text-gray-800">
//                           Phone verification
//                         </span>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Current Email Display */}
//                   {twoFAData.selectedMethod === "email" && (
//                     <div className="p-4 rounded-xl bg-white/40 border border-white/60">
//                       <div className="flex items-center space-x-2">
//                         <Mail className="w-5 h-5 text-green-600" />
//                         <span className="text-gray-700 text-sm">
//                           Verification will be sent to:
//                         </span>
//                       </div>
//                       <p className="text-gray-800 font-medium mt-1">
//                         {formData.email}
//                       </p>
//                     </div>
//                   )}

//                   {/* Current Phone Display */}
//                   {twoFAData.selectedMethod === "phone" && (
//                     <div className="p-4 rounded-xl bg-white/40 border border-white/60">
//                       <div className="flex items-center space-x-2">
//                         <Phone className="w-5 h-5 text-green-600" />
//                         <span className="text-gray-700 text-sm">
//                           Verification will be sent to:
//                         </span>
//                       </div>
//                       <p className="text-gray-800 font-medium mt-1">
//                         {formData.phoneNumber}
//                       </p>
//                     </div>
//                   )}

//                   {/* Continue Button */}
//                   <button
//                     onClick={() =>
//                       sendVerificationCode(twoFAData.selectedMethod)
//                     }
//                     disabled={isLoading}
//                     className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
//                   >
//                     {isLoading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Sending Code...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Send Verification Code</span>
//                         <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>

//                   {/* Back Button */}
//                   <button
//                     onClick={() => setCurrentStep("signup")}
//                     className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/60 transition-all duration-300 flex items-center justify-center space-x-2"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     <span>Back to Signup</span>
//                   </button>
//                 </div>
//               </>
//             )}

//             {currentStep === "2fa-verify" && (
//               <>
//                 {/* 2FA Verification Header */}
//                 <div className="text-center mb-8">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
//                     <Shield className="w-10 h-10 text-white" />
//                   </div>
//                   <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                     Verify Code
//                   </h1>
//                   <p className="text-gray-600">
//                     Enter the verification code sent to your device
//                   </p>
//                 </div>

//                 {/* Verification Codes */}
//                 <div className="space-y-6">
//                   {/* Email Code */}
//                   {twoFAData.selectedMethod === "email" && (
//                     <div className="space-y-2">
//                       <label className="text-gray-700 text-sm font-medium">
//                         Email Verification Code
//                         <span className="text-green-600 ml-2">
//                           ✓ Sent to {formData.email}
//                         </span>
//                       </label>
//                       <div className="relative">
//                         <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                         <input
//                           type="text"
//                           name="emailCode"
//                           value={twoFAData.emailCode}
//                           onChange={handleTwoFAChange}
//                           className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                             errors.emailCode
//                               ? "border-red-400"
//                               : "border-gray-300"
//                           } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center text-xl tracking-widest`}
//                           placeholder="000000"
//                           maxLength="6"
//                         />
//                       </div>
//                       {errors.emailCode && (
//                         <p className="text-red-500 text-sm">
//                           {errors.emailCode}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {/* Phone Code */}
//                   {twoFAData.selectedMethod === "phone" && (
//                     <div className="space-y-2">
//                       <label className="text-gray-700 text-sm font-medium">
//                         Phone Verification Code
//                         <span className="text-green-600 ml-2">
//                           ✓ Sent to {formData.phoneNumber}
//                         </span>
//                       </label>
//                       <div className="relative">
//                         <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//                         <input
//                           type="text"
//                           name="phoneCode"
//                           value={twoFAData.phoneCode}
//                           onChange={handleTwoFAChange}
//                           className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border ${
//                             errors.phoneCode
//                               ? "border-red-400"
//                               : "border-gray-300"
//                           } text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center text-xl tracking-widest`}
//                           placeholder="000000"
//                           maxLength="6"
//                         />
//                       </div>
//                       {errors.phoneCode && (
//                         <p className="text-red-500 text-sm">
//                           {errors.phoneCode}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {/* Verify Button */}
//                   <button
//                     onClick={verifyCode}
//                     disabled={isLoading}
//                     className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
//                   >
//                     {isLoading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Verifying...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Complete Setup</span>
//                         <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                       </>
//                     )}
//                   </button>

//                   {/* Resend Button */}
//                   <button
//                     onClick={() =>
//                       sendVerificationCode(twoFAData.selectedMethod)
//                     }
//                     className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/60 transition-all duration-300 flex items-center justify-center space-x-2"
//                   >
//                     {twoFAData.selectedMethod === "email" ? (
//                       <Mail className="w-4 h-4" />
//                     ) : (
//                       <Phone className="w-4 h-4" />
//                     )}
//                     <span>Resend Code</span>
//                   </button>

//                   {/* Back Button */}
//                   <button
//                     onClick={() => setCurrentStep("2fa-setup")}
//                     className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/60 transition-all duration-300 flex items-center justify-center space-x-2"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     <span>Back to Setup</span>
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// //!====================================================

// // import { useState } from "react";
// // import { MdEmail } from "react-icons/md";
// // import { FaUser, FaLock } from "react-icons/fa";
// // import { Link, useNavigate } from "react-router-dom";
// // import { signupLogo } from "../../assets/assets";
// // import { useDispatch, useSelector } from "react-redux";
// // import { signup } from "../../features/userSlice";
// // import { setItem, KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";
// // import { toast } from "react-toastify";
// // import locales from "../../locales/signup.local.json";
// // export default function Signup() {
// //   const [username, setusername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const dispatch = useDispatch();
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const result = await dispatch(
// //         signup({
// //           username,
// //           email,
// //           password,
// //         })
// //       );
// //       console.log(result);

// //       if (result?.payload?.success) {
// //         navigate("/");
// //         setItem(KEY_ACCESS_TOKEN, result.payload?.message?.token);
// //         setItem("city", "Vallabh Vidyanagar");
// //         setItem("language", "English");
// //         setItem("category", "All");
// //         toast.success("Registered Successfully");
// //       } else {
// //         const errorMessage =
// //           result.payload?.message || "Signup failed. Please try again.";
// //         setError(errorMessage);
// //         toast.error(errorMessage); // ✅ Pass error message directly
// //       }
// //     } catch (e) {
// //       console.error("Error in signup submit", e);
// //       const errorMessage =
// //         e?.response?.data?.message || "Failed to sign up. Please try again.";
// //       setError(errorMessage);
// //       toast.error(errorMessage); // ✅ Ensure proper error message
// //     }
// //   };
// //   const { language } = useSelector((state) => state.user);
// //   const t = locales[language];

// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-[#fdf5ee] p-6">
// //       <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden p-10">
// //         <div className="hidden md:flex flex-1 items-center justify-center relative">
// //           <div className="absolute w-80 h-full bg-[#fbe2cf] rounded-t-full top-0 left-0 right-0 mx-auto z-0"></div>
// //           {/* Illustration */}
// //           <img src={signupLogo} alt="Illustration" className="relative w-72 h-auto z-10" />
// //         </div>

// //         {/* Right Side (Form) */}
// //         <div className="flex-1 p-10">
// //           <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.create_account}</h2>
// //           <form className="space-y-5" onSubmit={handleSubmit}>
// //             <div>
// //               <label className="block text-gray-600 mb-2">{t.username}</label>
// //               <div className="relative">
// //                 <input
// //                   type="text"
// //                   placeholder={t.enter_name}
// //                   className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
// //                   value={username}
// //                   onChange={(e) => setusername(e.target.value)}
// //                   required
// //                 />
// //                 <span className="absolute left-3 top-4 text-xl text-gray-400">
// //                   <FaUser />
// //                 </span>
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-gray-600 mb-2">{t.email}</label>
// //               <div className="relative">
// //                 <input
// //                   type="email"
// //                   placeholder={t.email_placeholder}
// //                   className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   required
// //                 />
// //                 <span className="absolute left-3 top-4 text-xl text-gray-400">
// //                   <MdEmail />
// //                 </span>
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-gray-600 mb-2">{t.password}</label>
// //               <div className="relative">
// //                 <input
// //                   type="password"
// //                   placeholder={t.enter_password}
// //                   className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   required
// //                 />
// //                 <span className="absolute left-3 top-4 text-xl text-gray-400">
// //                   <FaLock />
// //                 </span>
// //               </div>
// //             </div>

// //             <button className="w-full bg-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition">
// //               {t.create_account_button}
// //             </button>
// //           </form>

// //           <p className="text-center text-gray-500 mt-5">
// //             {t.already_have_account}{" "}
// //             <Link to="/login" className="text-orange-500 hover:underline font-semibold">
// //               {t.sign_in}
// //             </Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// // }

