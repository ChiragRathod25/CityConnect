// import { useState, useEffect } from "react";

// // Password Requirements Component
// const PasswordRequirements = ({ password }) => {
//   const requirements = [
//     { 
//       text: "At least 8 characters", 
//       met: password.length >= 8,
//       icon: "📏"
//     },
//     { 
//       text: "One uppercase letter", 
//       met: /[A-Z]/.test(password),
//       icon: "🔤"
//     },
//     { 
//       text: "One lowercase letter", 
//       met: /[a-z]/.test(password),
//       icon: "🔡"
//     },
//     { 
//       text: "One number", 
//       met: /\d/.test(password),
//       icon: "🔢"
//     },
//     { 
//       text: "One special character", 
//       met: /[@$!%*?&]/.test(password),
//       icon: "🔣"
//     }
//   ];

//   const getStrength = () => {
//     if (password.length === 0) return 0;
//     const metCount = requirements.filter(req => req.met).length;
//     if (metCount <= 1) return 1;
//     if (metCount <= 2) return 2;
//     if (metCount <= 3) return 3;
//     return 4;
//   };

//   const getStrengthColor = (strength) => {
//     switch (strength) {
//       case 1: return "bg-red-500";
//       case 2: return "bg-yellow-500";
//       case 3: return "bg-blue-500";
//       case 4: return "bg-green-500";
//       default: return "bg-gray-300";
//     }
//   };

//   const getStrengthText = (strength) => {
//     switch (strength) {
//       case 1: return "Weak";
//       case 2: return "Fair";
//       case 3: return "Good";
//       case 4: return "Strong";
//       default: return "";
//     }
//   };

//   const strength = getStrength();

//   if (!password) return null;

//   return (
//     <div className="mt-3 space-y-3">
//       {/* Password Strength Bar */}
//       <div>
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
//             Password Strength
//           </span>
//           <div className="flex items-center space-x-1">
//             <span className="text-xs">🔐</span>
//             <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
//               {getStrengthText(strength)}
//             </span>
//           </div>
//         </div>
//         <div className="flex space-x-1">
//           {[1, 2, 3, 4].map((level) => (
//             <div
//               key={level}
//               className={`h-2 flex-1 rounded-full transition-all duration-500 ${
//                 strength >= level ? getStrengthColor(strength) : "bg-gray-200"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Requirements Checklist */}
//       <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//         <div className="flex items-center space-x-2 mb-3">
//           <span className="text-sm">🔒</span>
//           <span className="text-sm font-medium" style={{ color: "#374151" }}>
//             Password Requirements
//           </span>
//         </div>
//         {requirements.map((req, index) => (
//           <div
//             key={index}
//             className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
//               req.met ? "text-green-600" : "text-gray-500"
//             }`}
//           >
//             <span className="text-base">{req.icon}</span>
//             <span className={req.met ? "line-through" : ""}>{req.text}</span>
//             {req.met && (
//               <svg className="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//               </svg>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Input Field Component
// const InputField = ({ 
//   label, 
//   type = "text", 
//   name, 
//   value, 
//   onChange, 
//   placeholder, 
//   icon, 
//   error, 
//   showValidation = false,
//   rightButton = null,
//   className = "",
//   ...props 
// }) => {
//   const isValid = value && !error && showValidation;

//   return (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium" style={{ color: "#6b7280" }}>
//         {label}
//       </label>
//       <div className="relative">
//         <svg
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           style={{ color: "#9ca3af" }}
//         >
//           {icon}
//         </svg>
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           className={`w-full pl-12 ${rightButton ? 'pr-12' : 'pr-4'} py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 ${className}`}
//           style={{
//             backgroundColor: "#f8fafc",
//             borderColor: error ? "#ef4444" : "#d1d5db",
//             color: "#1f2937",
//           }}
//           placeholder={placeholder}
//           {...props}
//         />
//         {rightButton && (
//           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
//             {rightButton}
//           </div>
//         )}
//         {isValid && !rightButton && (
//           <svg
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5 z-10"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//           </svg>
//         )}
//       </div>
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// // Step Header Component
// const StepHeader = ({ icon, title, subtitle, iconBg }) => (
//   <div className="text-center mb-8">
//     <div
//       className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110"
//       style={{ backgroundColor: iconBg }}
//     >
//       <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         {icon}
//       </svg>
//     </div>
//     <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1f2937" }}>
//       {title}
//     </h1>
//     <p className="text-sm sm:text-base" style={{ color: "#6b7280" }}>
//       {subtitle}
//     </p>
//   </div>
// );

// // Button Component
// const Button = ({ 
//   onClick, 
//   disabled, 
//   loading, 
//   children, 
//   variant = "primary", 
//   icon = null,
//   className = "",
//   size = "normal"
// }) => {
//   const getButtonStyles = () => {
//     switch (variant) {
//       case "primary":
//         return {
//           backgroundColor: "#374151",
//           boxShadow: "0 10px 25px rgba(55, 65, 81, 0.3)",
//         };
//       case "secondary":
//         return {
//           backgroundColor: "#6b7280",
//           boxShadow: "0 10px 25px rgba(107, 114, 128, 0.3)",
//         };
//       case "outline":
//         return {
//           backgroundColor: "#f8fafc",
//           borderColor: "#d1d5db",
//           color: "#6b7280",
//         };
//       default:
//         return {};
//     }
//   };

//   const sizeClasses = size === "small" ? "py-3" : "py-4";

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled || loading}
//       className={`w-full ${sizeClasses} px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group ${
//         variant === "outline" ? "border" : "text-white"
//       } ${className}`}
//       style={getButtonStyles()}
//     >
//       {loading ? (
//         <>
//           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//           <span className="text-sm sm:text-base">
//             {typeof children === "string" ? `${children}...` : children}
//           </span>
//         </>
//       ) : (
//         <>
//           <span className="text-sm sm:text-base">{children}</span>
//           {icon && (
//             <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
//               {icon}
//             </svg>
//           )}
//         </>
//       )}
//     </button>
//   );
// };

// // Resend Timer Component
// const ResendTimer = ({ onResend, isLoading, method, resetKey }) => {
//   const [countdown, setCountdown] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   // Reset timer when resetKey changes (different verification steps)
//   useEffect(() => {
//     setCountdown(60);
//     setCanResend(false);
//   }, [resetKey]);

//   useEffect(() => {
//     if (countdown > 0 && !canResend) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (countdown === 0) {
//       setCanResend(true);
//     }
//   }, [countdown, canResend]);

//   const handleResend = () => {
//     onResend();
//     setCountdown(60);
//     setCanResend(false);
//   };

//   return (
//     <div className="text-center">
//       <p className="text-sm mb-3" style={{ color: "#6b7280" }}>
//         Didn't receive the code?
//       </p>
//       <Button
//         onClick={handleResend}
//         disabled={!canResend || isLoading}
//         variant="outline"
//         size="small"
//       >
//         {canResend ? "Resend Code" : `Resend in ${countdown}s`}
//       </Button>
//     </div>
//   );
// };

// // 6-Digit OTP Input Component
// const OTPInput = ({ value, onChange, error }) => {
//   const [otp, setOtp] = useState(Array(6).fill(""));

//   useEffect(() => {
//     const otpString = otp.join("");
//     if (otpString !== value) {
//       onChange({ target: { value: otpString } });
//     }
//   }, [otp, onChange, value]);

//   useEffect(() => {
//     if (value.length === 0) {
//       setOtp(Array(6).fill(""));
//     }
//   }, [value]);

//   const handleChange = (element, index) => {
//     if (isNaN(element.value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = element.value;
//     setOtp(newOtp);

//     // Auto focus next input
//     if (element.value && index < 5) {
//       const nextInput = element.parentElement.nextElementSibling?.querySelector('input');
//       if (nextInput) nextInput.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     // Handle backspace
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = e.target.parentElement.previousElementSibling?.querySelector('input');
//       if (prevInput) {
//         prevInput.focus();
//         const newOtp = [...otp];
//         newOtp[index - 1] = "";
//         setOtp(newOtp);
//       }
//     }
    
//     // Handle paste
//     if (e.key === 'Enter') {
//       e.target.blur();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').slice(0, 6);
//     if (/^\d+$/.test(pastedData)) {
//       const newOtp = Array(6).fill("");
//       for (let i = 0; i < pastedData.length; i++) {
//         newOtp[i] = pastedData[i];
//       }
//       setOtp(newOtp);
//     }
//   };

//   return (
//     <div className="space-y-3">
//       <div className="text-center mb-4">
//         <h3 className="text-lg font-medium mb-1" style={{ color: "#1f2937" }}>
//           Enter 6-digit code
//         </h3>
//       </div>
      
//       <div className="flex justify-center space-x-2 sm:space-x-3">
//         {otp.map((digit, index) => (
//           <div key={index} className="relative">
//             <input
//               type="text"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => handleChange(e.target, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               onPaste={handlePaste}
//               className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-all duration-300 transform focus:scale-110 ${
//                 error 
//                   ? "border-red-400 bg-red-50" 
//                   : digit 
//                     ? "border-green-400 bg-green-50 text-green-700" 
//                     : "border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500"
//               }`}
//               style={{
//                 color: error ? "#ef4444" : digit ? "#059669" : "#1f2937"
//               }}
//             />
//             {digit && (
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
//             )}
//           </div>
//         ))}
//       </div>
      
//       {error && (
//         <p className="text-red-500 text-sm text-center mt-2">{error}</p>
//       )}
//     </div>
//   );
// };

// // Verification Progress Component - Horizontal Stepper
// const VerificationProgress = ({ currentVerification, emailVerified, phoneVerified }) => {
//   const steps = [
//     { 
//       id: "email", 
//       title: "Step One", 
//       description: "Email Verification",
//       completed: emailVerified 
//     },
//     { 
//       id: "phone", 
//       title: "Step Two", 
//       description: "Phone Verification",
//       completed: phoneVerified 
//     },
//     { 
//       id: "complete", 
//       title: "Step Three", 
//       description: "Account Setup Complete",
//       completed: emailVerified && phoneVerified 
//     }
//   ];

//   const getCurrentStepIndex = () => {
//     if (!emailVerified) return 0;
//     if (!phoneVerified) return 1;
//     return 2;
//   };

//   const currentStepIndex = getCurrentStepIndex();

//   return (
//     <div className="mb-8 px-2">
//       <div className="flex items-center justify-between relative">
//         {/* Progress Line */}
//         <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200 z-0">
//           <div 
//             className="h-full bg-gray-800 transition-all duration-700 ease-out"
//             style={{ 
//               width: currentStepIndex === 0 ? "0%" : currentStepIndex === 1 ? "50%" : "100%" 
//             }}
//           />
//         </div>
        
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex flex-col items-center relative z-10">
//             <div 
//               className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
//                 step.completed
//                   ? "bg-gray-800 text-white border-gray-800 scale-110" 
//                   : index === currentStepIndex
//                     ? "bg-white text-gray-800 border-gray-800 shadow-lg animate-pulse" 
//                     : "bg-gray-200 text-gray-400 border-gray-300"
//               }`}
//             >
//               {step.completed ? (
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                 </svg>
//               ) : (
//                 index + 1
//               )}
//             </div>
//             <div className="mt-3 text-center max-w-20">
//               <div 
//                 className={`text-xs font-semibold ${
//                   step.completed || index === currentStepIndex ? "text-gray-800" : "text-gray-400"
//                 }`}
//               >
//                 {step.title}
//               </div>
//               <div 
//                 className={`text-xs mt-1 ${
//                   step.completed || index === currentStepIndex ? "text-gray-600" : "text-gray-400"
//                 }`}
//               >
//                 {step.description}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Code Input Component
// const CodeInput = ({ method, code, onChange, error, contact }) => {
//   const getIcon = () => {
//     if (method === "email") {
//       return (
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//         />
//       );
//     }
//     return (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//       />
//     );
//   };

//   return (
//     <div className="space-y-3">
//       <label className="block text-sm font-medium" style={{ color: "#6b7280" }}>
//         {method === "email" ? "Email" : "Phone"} Verification Code
//         <span className="text-green-600 ml-2 text-xs">
//           ✓ Sent to {contact}
//         </span>
//       </label>
      
//       {/* Code sent notification */}
//       <div 
//         className="p-3 rounded-lg border-l-4 bg-blue-50"
//         style={{ borderLeftColor: "#3b82f6" }}
//       >
//         <div className="flex items-center space-x-2">
//           <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//           </svg>
//           <span className="text-sm text-blue-700">
//             Verification code sent successfully!
//           </span>
//         </div>
//       </div>

//       <div className="relative">
//         <svg
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           style={{ color: "#9ca3af" }}
//         >
//           {getIcon()}
//         </svg>
//         <input
//           type="text"
//           name={`${method}Code`}
//           value={code}
//           onChange={onChange}
//           className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-center text-xl tracking-widest font-mono"
//           style={{
//             backgroundColor: "#f8fafc",
//             borderColor: error ? "#ef4444" : "#d1d5db",
//             color: "#1f2937",
//           }}
//           placeholder="000000"
//           maxLength="6"
//           autoComplete="one-time-code"
//         />
//       </div>
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// // Main Authentication Component
// export default function SignupPage() {
//   const [currentStep, setCurrentStep] = useState("signup");
//   const [verificationPurpose, setVerificationPurpose] = useState("signup");
//   const [verificationStage, setVerificationStage] = useState("email"); // email -> phone
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false);
  
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//   });
  
//   const [twoFAData, setTwoFAData] = useState({
//     emailCode: "",
//     phoneCode: "",
//   });
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

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
//     } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
//       newErrors.phoneNumber = "Please enter a valid phone number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       setCurrentStep("2fa-verify");
//       setVerificationStage("email");
//     }, 2000);
//   };

//   const sendVerificationCode = async () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1500);
//   };

//   const verifyCode = async () => {
//     setIsLoading(true);
//     const newErrors = {};

//     if (verificationStage === "email" && !twoFAData.emailCode) {
//       newErrors.emailCode = "Email verification code is required";
//     }

//     if (verificationStage === "phone" && !twoFAData.phoneCode) {
//       newErrors.phoneCode = "Phone verification code is required";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setIsLoading(false);
//       return;
//     }

//     setTimeout(() => {
//       setIsLoading(false);
      
//       if (verificationStage === "email") {
//         setEmailVerified(true);
//         setVerificationStage("phone");
//         setTwoFAData(prev => ({ ...prev, emailCode: "" }));
//         setErrors({});
//       } else if (verificationStage === "phone") {
//         setPhoneVerified(true);
//         const messages = {
//           signup: "Account created successfully! Both email and phone verified! 🎉",
//           email_change: "Email verification completed! Email updated successfully! 📧",
//           phone_change: "Phone verification completed! Phone updated successfully! 📱",
//           password_change: "Identity verified! You can now change your password! 🔐"
//         };
//         alert(messages[verificationPurpose] || "Verification completed!");
        
//         // Reset for new verification if needed
//         if (verificationPurpose !== "signup") {
//           resetForm();
//         }
//       }
//     }, 2000);
//   };

//   const resetForm = () => {
//     setCurrentStep("signup");
//     setVerificationPurpose("signup");
//     setVerificationStage("email");
//     setEmailVerified(false);
//     setPhoneVerified(false);
//     setTwoFAData({ emailCode: "", phoneCode: "" });
//     setErrors({});
//   };

//   const startVerification = (purpose) => {
//     setVerificationPurpose(purpose);
//     setCurrentStep("2fa-verify");
//     setVerificationStage("email");
//     setEmailVerified(false);
//     setPhoneVerified(false);
//     setTwoFAData({ emailCode: "", phoneCode: "" });
//     setErrors({});
//   };

//   const getStepConfig = () => {
//     switch (currentStep) {
//       case "signup":
//         return {
//           icon: (
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//             />
//           ),
//           title: verificationPurpose === "signup" ? "Create Account" : "Identity Verification",
//           subtitle: verificationPurpose === "signup" ? "Join our community today" : "Verify your identity to proceed",
//           iconBg: "#1f2937"
//         };
//       case "2fa-verify":
//         return {
//           icon: (
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           ),
//           title: `Verify ${verificationStage === "email" ? "Email" : "Phone"}`,
//           subtitle: `Step ${verificationStage === "email" ? "1" : "2"} of 2: Enter the verification code`,
//           iconBg: verificationStage === "email" ? "#3b82f6" : "#10b981"
//         };
//       default:
//         return {};
//     }
//   };

//   const stepConfig = getStepConfig();

//   return (
//     <div className="min-h-screen  flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="w-full min-w-md sm:min-w-lg lg:min-w-xl">
//         <div
//           className="backdrop-blur-xl border shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 rounded-3xl"
//           style={{
//             backgroundColor: "#ffffff",
//             borderColor: "#d1d5db",
//             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           <StepHeader {...stepConfig} />

//           {currentStep === "signup" && (
//             <>
//               {verificationPurpose === "signup" ? (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <InputField
//                     label="Username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     placeholder="Enter your username"
//                     error={errors.username}
//                     showValidation={true}
//                     icon={
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     }
//                   />

//                   <InputField
//                     label="Email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="Enter your email"
//                     error={errors.email}
//                     showValidation={true}
//                     icon={
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//                       />
//                     }
//                   />

//                   <InputField
//                     label="Phone Number"
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     placeholder="+1 (555) 123-4567"
//                     error={errors.phoneNumber}
//                     showValidation={true}
//                     icon={
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                       />
//                     }
//                   />

//                   <div>
//                     <InputField
//                       label="Password"
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       placeholder="Enter your password"
//                       error={errors.password}
//                       icon={
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                         />
//                       }
//                       rightButton={
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="hover:text-gray-700 transition-colors p-1"
//                           style={{ color: "#9ca3af" }}
//                         >
//                           {showPassword ? (
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
//                               />
//                             </svg>
//                           ) : (
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                               />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                               />
//                             </svg>
//                           )}
//                         </button>
//                       }
//                     />
//                     <PasswordRequirements password={formData.password} />
//                   </div>

//                   <Button
//                     onClick={handleSubmit}
//                     loading={isLoading}
//                     icon={
//                       <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6L16 12L10 18L8.59 16.59Z" />
//                     }
//                   >
//                     {isLoading ? "Creating Account" : "Create Account"}
//                   </Button>
//                 </form>
//               ) : (
//                 // Demo buttons for different verification scenarios
//                 <div className="space-y-4">
//                   <div className="text-center mb-6">
//                     <p className="text-sm sm:text-base" style={{ color: "#6b7280" }}>
//                       Simulate different verification scenarios:
//                     </p>
//                   </div>
                  
//                   <Button
//                     onClick={() => startVerification("email_change")}
//                     variant="secondary"
//                     icon={<path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />}
//                   >
//                     Change Email Address
//                   </Button>

//                   <Button
//                     onClick={() => startVerification("phone_change")}
//                     variant="secondary"
//                     icon={<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
//                   >
//                     Change Phone Number
//                   </Button>

//                   <Button
//                     onClick={() => startVerification("password_change")}
//                     variant="secondary"
//                     icon={<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
//                   >
//                     Change Password
//                   </Button>

//                   <Button
//                     onClick={() => setVerificationPurpose("signup")}
//                     variant="outline"
//                     icon={<path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />}
//                   >
//                     Back to Signup
//                   </Button>
//                 </div>
//               )}

//               {verificationPurpose === "signup" && (
//                 <div className="mt-8 text-center">
//                   <p className="text-sm" style={{ color: "#6b7280" }}>
//                     Already have an account?{" "}
//                     <a
//                       href="#"
//                       className="font-semibold hover:underline transition-colors"
//                       style={{ color: "#374151" }}
//                     >
//                       Sign In
//                     </a>
//                   </p>
//                 </div>
//               )}
//             </>
//           )}

//           {currentStep === "2fa-verify" && (
//             <>
//               <VerificationProgress 
//                 currentVerification={verificationStage}
//                 emailVerified={emailVerified}
//                 phoneVerified={phoneVerified}
//               />

//               <div className="space-y-6">
//                 <div className="text-center space-y-2">
//                   <p className="text-sm" style={{ color: "#6b7280" }}>
//                     We've sent a 6-digit code to
//                   </p>
//                   <p className="font-semibold text-lg" style={{ color: "#1f2937" }}>
//                     {verificationStage === "email" ? formData.email : formData.phoneNumber}
//                   </p>
//                 </div>

//                 <OTPInput
//                   value={verificationStage === "email" ? twoFAData.emailCode : twoFAData.phoneCode}
//                   onChange={(e) => handleTwoFAChange({
//                     target: {
//                       name: verificationStage === "email" ? "emailCode" : "phoneCode",
//                       value: e.target.value
//                     }
//                   })}
//                   error={verificationStage === "email" ? errors.emailCode : errors.phoneCode}
//                 />

//                 <Button
//                   onClick={verifyCode}
//                   loading={isLoading}
//                   icon={<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />}
//                 >
//                   {isLoading ? "Verifying" : 
//                    verificationStage === "email" ? "Verify Email" : "Complete Setup"}
//                 </Button>

//                 <ResendTimer
//                   onResend={sendVerificationCode}
//                   isLoading={isLoading}
//                   method={verificationStage}
//                   resetKey={`${verificationStage}-${verificationPurpose}`}
//                 />

//                 <Button
//                   onClick={() => {
//                     if (verificationStage === "phone" && emailVerified) {
//                       setVerificationStage("email");
//                       setTwoFAData(prev => ({ ...prev, phoneCode: "" }));
//                     } else {
//                       setCurrentStep("signup");
//                     }
//                   }}
//                   variant="outline"
//                   size="small"
//                   icon={<path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />}
//                 >
//                   {verificationStage === "phone" && emailVerified ? "Back to Email" : "Back to Form"}
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Bottom Demo Navigation (only show for demo purposes) */}
//         {verificationPurpose !== "signup" && currentStep === "signup" && (
//           <div className="mt-6 text-center">
//             <Button
//               onClick={() => setVerificationPurpose("signup")}
//               variant="outline"
//               size="small"
//               className="max-w-xs mx-auto"
//             >
//               Return to Main Signup
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { 
      text: "At least 8 characters", 
      met: password.length >= 8,
      icon: "📏"
    },
    { 
      text: "One uppercase letter", 
      met: /[A-Z]/.test(password),
      icon: "🔤"
    },
    { 
      text: "One lowercase letter", 
      met: /[a-z]/.test(password),
      icon: "🔡"
    },
    { 
      text: "One number", 
      met: /\d/.test(password),
      icon: "🔢"
    },
    { 
      text: "One special character", 
      met: /[@$!%*?&]/.test(password),
      icon: "🔣"
    }
  ];

  const getStrength = () => {
    if (password.length === 0) return 0;
    const metCount = requirements.filter(req => req.met).length;
    if (metCount <= 1) return 1;
    if (metCount <= 2) return 2;
    if (metCount <= 3) return 3;
    return 4;
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const strength = getStrength();

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Password Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
            Password Strength
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs">🔐</span>
            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
              {getStrengthText(strength)}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                strength >= level ? getStrengthColor(strength) : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm">🔒</span>
          <span className="text-sm font-medium" style={{ color: "#374151" }}>
            Password Requirements
          </span>
        </div>
        {requirements.map((req, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
              req.met ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-base">{req.icon}</span>
            <span className={req.met ? "line-through" : ""}>{req.text}</span>
            {req.met && (
              <svg className="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon, 
  error, 
  showValidation = false,
  rightButton = null,
  className = "",
  ...props 
}) => {
  const isValid = value && !error && showValidation;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: "#6b7280" }}>
        {label}
      </label>
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "#9ca3af" }}
        >
          {icon}
        </svg>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 ${rightButton ? 'pr-12' : 'pr-4'} py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 ${className}`}
          style={{
            backgroundColor: "#f8fafc",
            borderColor: error ? "#ef4444" : "#d1d5db",
            color: "#1f2937",
          }}
          placeholder={placeholder}
          {...props}
        />
        {rightButton && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            {rightButton}
          </div>
        )}
        {isValid && !rightButton && (
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5 z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Step Header Component
const StepHeader = ({ icon, title, subtitle, iconBg }) => (
  <div className="text-center mb-8">
    <div
      className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110"
      style={{ backgroundColor: iconBg }}
    >
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1f2937" }}>
      {title}
    </h1>
    <p className="text-sm sm:text-base" style={{ color: "#6b7280" }}>
      {subtitle}
    </p>
  </div>
);

// Button Component
const Button = ({ 
  onClick, 
  disabled, 
  loading, 
  children, 
  variant = "primary", 
  icon = null,
  className = "",
  size = "normal"
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#374151",
          boxShadow: "0 10px 25px rgba(55, 65, 81, 0.3)",
        };
      case "secondary":
        return {
          backgroundColor: "#6b7280",
          boxShadow: "0 10px 25px rgba(107, 114, 128, 0.3)",
        };
      case "outline":
        return {
          backgroundColor: "#f8fafc",
          borderColor: "#d1d5db",
          color: "#6b7280",
        };
      default:
        return {};
    }
  };

  const sizeClasses = size === "small" ? "py-3" : "py-4";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full ${sizeClasses} px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group ${
        variant === "outline" ? "border" : "text-white"
      } ${className}`}
      style={getButtonStyles()}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base">
            {typeof children === "string" ? `${children}...` : children}
          </span>
        </>
      ) : (
        <>
          <span className="text-sm sm:text-base">{children}</span>
          {icon && (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          )}
        </>
      )}
    </button>
  );
};

// // Role Selection Card Component
// const RoleCard = ({ role, icon, title, description, selected, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
//         selected 
//           ? "border-gray-800 bg-gray-50" 
//           : "border-gray-200 hover:border-gray-400 bg-white"
//       }`}
//       style={{
//         boxShadow: selected ? "0 20px 40px rgba(55, 65, 81, 0.15)" : "0 4px 6px rgba(0, 0, 0, 0.05)"
//       }}
//     >
//       {selected && (
//         <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
//           <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//           </svg>
//         </div>
//       )}
      
//       <div className="text-center space-y-4">
//         <div
//           className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 ${
//             selected ? "bg-gray-800" : "bg-gray-100"
//           }`}
//         >
//           <svg 
//             className={`w-8 h-8 transition-colors ${selected ? "text-white" : "text-gray-600"}`} 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             {icon}
//           </svg>
//         </div>
        
//         <div>
//           <h3 className={`text-lg font-semibold mb-2 ${selected ? "text-gray-800" : "text-gray-700"}`}>
//             {title}
//           </h3>
//           <p className={`text-sm ${selected ? "text-gray-600" : "text-gray-500"}`}>
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };


// Role Selection Card Component
const RoleCard = ({ role, icon, title, description, selected, onClick }) => {
  // Get icon color based on role
  const getIconColor = () => {
    if (selected) return "text-white";
    return role === "Businessman" ? "text-amber-500" : "text-emerald-500";
  };
  
  // Get icon background color based on role
  const getIconBgColor = () => {
    if (selected) return "bg-gradient-to-br from-gray-700 to-gray-900";
    return role === "Businessman" 
      ? "bg-gradient-to-br from-amber-100 to-amber-200" 
      : "bg-gradient-to-br from-emerald-100 to-emerald-200";
  };
  
  // Get icon based on role
  const getRoleIcon = () => {
    if (role === "Businessman") {
      return (
        <g>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          <circle cx="12" cy="8" r="2.5" fill="currentColor"/>
          <path d="M12 14c-2.76 0-5 2.24-5 5v1h10v-1c0-2.76-2.24-5-5-5z" fill="currentColor"/>
        </g>
      );
    } else {
      return (
        <g>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <path d="M12 5.5l2.04 4.14 4.57.67-3.31 3.22.78 4.55L12 15.5l-4.08 2.58.78-4.55-3.31-3.22 4.57-.67L12 5.5z" fill="currentColor"/>
        </g>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        selected 
          ? "border-gray-800 bg-gray-50" 
          : "border-gray-200 hover:border-gray-400 bg-white"
      }`}
      style={{
        boxShadow: selected ? "0 20px 40px rgba(55, 65, 81, 0.15)" : "0 4px 6px rgba(0, 0, 0, 0.05)"
      }}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      )}
      
      <div className="text-center space-y-4">
        <div
          className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 ${getIconBgColor()}`}
        >
          <svg 
            className={`w-8 h-8 transition-colors ${getIconColor()}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            {getRoleIcon()}
          </svg>
        </div>
        
        <div>
          <h3 className={`text-lg font-semibold mb-2 ${selected ? "text-gray-800" : role === "Businessman" ? "text-amber-700" : "text-emerald-700"}`}>
            {title}
          </h3>
          <p className={`text-sm ${selected ? "text-gray-600" : "text-gray-500"}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Resend Timer Component
const ResendTimer = ({ onResend, isLoading, method, resetKey }) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Reset timer when resetKey changes (different verification steps)
  useEffect(() => {
    setCountdown(60);
    setCanResend(false);
  }, [resetKey]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = () => {
    onResend();
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div className="text-center">
      <p className="text-sm mb-3" style={{ color: "#6b7280" }}>
        Didn't receive the code?
      </p>
      <Button
        onClick={handleResend}
        disabled={!canResend || isLoading}
        variant="outline"
        size="small"
      >
        {canResend ? "Resend Code" : `Resend in ${countdown}s`}
      </Button>
    </div>
  );
};

// 6-Digit OTP Input Component
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
      const nextInput = element.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
    
    // Handle paste
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
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
                color: error ? "#ef4444" : digit ? "#059669" : "#1f2937"
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

// Verification Progress Component - Horizontal Stepper
const VerificationProgress = ({ currentVerification, emailVerified, phoneVerified }) => {
  const steps = [
    { 
      id: "email", 
      title: "Step One", 
      description: "Email Verification",
      completed: emailVerified 
    },
    { 
      id: "phone", 
      title: "Step Two", 
      description: "Phone Verification",
      completed: phoneVerified 
    },
    { 
      id: "complete", 
      title: "Step Three", 
      description: "Account Setup Complete",
      completed: emailVerified && phoneVerified 
    }
  ];

  const getCurrentStepIndex = () => {
    if (!emailVerified) return 0;
    if (!phoneVerified) return 1;
    return 2;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="mb-8 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200 z-0">
          <div 
            className="h-full bg-gray-800 transition-all duration-700 ease-out"
            style={{ 
              width: currentStepIndex === 0 ? "0%" : currentStepIndex === 1 ? "50%" : "100%" 
            }}
          />
        </div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
                step.completed
                  ? "bg-gray-800 text-white border-gray-800 scale-110" 
                  : index === currentStepIndex
                    ? "bg-white text-gray-800 border-gray-800 shadow-lg animate-pulse" 
                    : "bg-gray-200 text-gray-400 border-gray-300"
              }`}
            >
              {step.completed ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="mt-3 text-center max-w-20">
              <div 
                className={`text-xs font-semibold ${
                  step.completed || index === currentStepIndex ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
              <div 
                className={`text-xs mt-1 ${
                  step.completed || index === currentStepIndex ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Code Input Component
const CodeInput = ({ method, code, onChange, error, contact }) => {
  const getIcon = () => {
    if (method === "email") {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
      );
    }
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" style={{ color: "#6b7280" }}>
        {method === "email" ? "Email" : "Phone"} Verification Code
        <span className="text-green-600 ml-2 text-xs">
          ✓ Sent to {contact}
        </span>
      </label>
      
      {/* Code sent notification */}
      <div 
        className="p-3 rounded-lg border-l-4 bg-blue-50"
        style={{ borderLeftColor: "#3b82f6" }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm text-blue-700">
            Verification code sent successfully!
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "#9ca3af" }}
        >
          {getIcon()}
        </svg>
        <input
          type="text"
          name={`${method}Code`}
          value={code}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-4 rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-center text-xl tracking-widest font-mono"
          style={{
            backgroundColor: "#f8fafc",
            borderColor: error ? "#ef4444" : "#d1d5db",
            color: "#1f2937",
          }}
          placeholder="000000"
          maxLength="6"
          autoComplete="one-time-code"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Main Authentication Component
export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState("role-selection");
  const [selectedRole, setSelectedRole] = useState("");
  const [verificationPurpose, setVerificationPurpose] = useState("signup");
  const [verificationStage, setVerificationStage] = useState("email"); // email -> phone
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });
  
  const [twoFAData, setTwoFAData] = useState({
    emailCode: "",
    phoneCode: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const proceedToSignup = () => {
    if (!selectedRole) return;
    setCurrentStep("signup");
  };

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
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
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
      setCurrentStep("2fa-verify");
      setVerificationStage("email");
    }, 2000);
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const verifyCode = async () => {
    setIsLoading(true);
    const newErrors = {};

    if (verificationStage === "email" && !twoFAData.emailCode) {
      newErrors.emailCode = "Email verification code is required";
    }

    if (verificationStage === "phone" && !twoFAData.phoneCode) {
      newErrors.phoneCode = "Phone verification code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationStage === "email") {
        setEmailVerified(true);
        setVerificationStage("phone");
        setTwoFAData(prev => ({ ...prev, emailCode: "" }));
        setErrors({});
      } else if (verificationStage === "phone") {
        setPhoneVerified(true);
        const messages = {
          signup: `${selectedRole} account created successfully! Both email and phone verified! 🎉`,
          email_change: "Email verification completed! Email updated successfully! 📧",
          phone_change: "Phone verification completed! Phone updated successfully! 📱",
          password_change: "Identity verified! You can now change your password! 🔐"
        };
        alert(messages[verificationPurpose] || "Verification completed!");
        
        // Reset for new verification if needed
        if (verificationPurpose !== "signup") {
          resetForm();
        }
      }
    }, 2000);
  };

  const resetForm = () => {
    setCurrentStep("role-selection");
    setSelectedRole("");
    setVerificationPurpose("signup");
    setVerificationStage("email");
    setEmailVerified(false);
    setPhoneVerified(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "",
    });
    setTwoFAData({ emailCode: "", phoneCode: "" });
    setErrors({});
  };

  const startVerification = (purpose) => {
    setVerificationPurpose(purpose);
    setCurrentStep("2fa-verify");
    setVerificationStage("email");
    setEmailVerified(false);
    setPhoneVerified(false);
    setTwoFAData({ emailCode: "", phoneCode: "" });
    setErrors({});
  };

  const getStepConfig = () => {
    switch (currentStep) {
      case "role-selection":
        return {
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          ),
          title: "Choose Your Role",
          subtitle: "Select how you'll be using our platform",
          iconBg: "#6366f1"
        };
      case "signup":
        return {
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          ),
          title: verificationPurpose === "signup" ? `Create ${selectedRole} Account` : "Identity Verification",
          subtitle: verificationPurpose === "signup" ? "Join our community today" : "Verify your identity to proceed",
          iconBg: selectedRole === "User" ? "#10b981" : "#f59e0b"
        };
      case "2fa-verify":
        return {
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ),
          title: `Verify ${verificationStage === "email" ? "Email" : "Phone"}`,
          subtitle: `Step ${verificationStage === "email" ? "1" : "2"} of 2: Enter the verification code`,
          iconBg: verificationStage === "email" ? "#3b82f6" : "#10b981"
        };
      default:
        return {};
    }
  };

  const stepConfig = getStepConfig();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full min-w-md sm:min-w-lg lg:min-w-xl">
        <div
          className="backdrop-blur-xl border shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 rounded-3xl"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#d1d5db",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <StepHeader {...stepConfig} />

          {currentStep === "role-selection" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <RoleCard
                  role="businessman"
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  }
                  title="Businessman"
                  description="Perfect for entrepreneurs, business owners, and professionals"
                  selected={selectedRole === "Businessman"}
                  onClick={() => handleRoleSelection("Businessman")}
                />
                
                <RoleCard
                  role="user"
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  }
                  title="User"
                  description="Great for individuals and personal use"
                  selected={selectedRole === "User"}
                  onClick={() => handleRoleSelection("User")}
                />
              </div>

              <Button
                onClick={proceedToSignup}
                disabled={!selectedRole}
                icon={
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6L16 12L10 18L8.59 16.59Z" />
                }
              >
                Continue as {selectedRole || "..."}
              </Button>

              {selectedRole && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedRole} role selected
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedRole === "Businessman" 
                      ? "You'll get access to business tools and features"
                      : "You'll get access to personal user features"
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === "signup" && (
            <>
              {verificationPurpose === "signup" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    error={errors.username}
                    showValidation={true}
                    icon={
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    }
                  />

                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    error={errors.email}
                    showValidation={true}
                    icon={
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    }
                  />

                  <InputField
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    error={errors.phoneNumber}
                    showValidation={true}
                    icon={
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    }
                  />

                  <div>
                    <InputField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      error={errors.password}
                      icon={
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      }
                      rightButton={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="hover:text-gray-700 transition-colors p-1"
                          style={{ color: "#9ca3af" }}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      }
                    />
                    <PasswordRequirements password={formData.password} />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    loading={isLoading}
                    icon={
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6L16 12L10 18L8.59 16.59Z" />
                    }
                  >
                    {isLoading ? "Creating Account" : `Create ${selectedRole} Account`}
                  </Button>

                  <Button
                    onClick={() => setCurrentStep("role-selection")}
                    variant="outline"
                    size="small"
                    icon={<path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />}
                  >
                    Change Role
                  </Button>
                </form>
              ) : (
                // Demo buttons for different verification scenarios
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-sm sm:text-base" style={{ color: "#6b7280" }}>
                      Simulate different verification scenarios:
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => startVerification("email_change")}
                    variant="secondary"
                    icon={<path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />}
                  >
                    Change Email Address
                  </Button>

                  <Button
                    onClick={() => startVerification("phone_change")}
                    variant="secondary"
                    icon={<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  >
                    Change Phone Number
                  </Button>

                  <Button
                    onClick={() => startVerification("password_change")}
                    variant="secondary"
                    icon={<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                  >
                    Change Password
                  </Button>

                  <Button
                    onClick={() => setVerificationPurpose("signup")}
                    variant="outline"
                    icon={<path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />}
                  >
                    Back to Signup
                  </Button>
                </div>
              )}

              {verificationPurpose === "signup" && (
                <div className="mt-8 text-center">
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="font-semibold hover:underline transition-colors"
                      style={{ color: "#374151" }}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              )}
            </>
          )}

          {currentStep === "2fa-verify" && (
            <>
              <VerificationProgress 
                currentVerification={verificationStage}
                emailVerified={emailVerified}
                phoneVerified={phoneVerified}
              />

              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    We've sent a 6-digit code to
                  </p>
                  <p className="font-semibold text-lg" style={{ color: "#1f2937" }}>
                    {verificationStage === "email" ? formData.email : formData.phoneNumber}
                  </p>
                </div>

                <OTPInput
                  value={verificationStage === "email" ? twoFAData.emailCode : twoFAData.phoneCode}
                  onChange={(e) => handleTwoFAChange({
                    target: {
                      name: verificationStage === "email" ? "emailCode" : "phoneCode",
                      value: e.target.value
                    }
                  })}
                  error={verificationStage === "email" ? errors.emailCode : errors.phoneCode}
                />

                <Button
                  onClick={verifyCode}
                  loading={isLoading}
                  icon={<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />}
                >
                  {isLoading ? "Verifying" : 
                   verificationStage === "email" ? "Verify Email" : "Complete Setup"}
                </Button>

                <ResendTimer
                  onResend={sendVerificationCode}
                  isLoading={isLoading}
                  method={verificationStage}
                  resetKey={`${verificationStage}-${verificationPurpose}`}
                />

                <Button
                  onClick={() => {
                    if (verificationStage === "phone" && emailVerified) {
                      setVerificationStage("email");
                      setTwoFAData(prev => ({ ...prev, phoneCode: "" }));
                    } else {
                      setCurrentStep("signup");
                    }
                  }}
                  variant="outline"
                  size="small"
                  icon={<path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />}
                >
                  {verificationStage === "phone" && emailVerified ? "Back to Email" : "Back to Form"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Bottom Demo Navigation (only show for demo purposes) */}
        {verificationPurpose !== "signup" && currentStep === "signup" && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setVerificationPurpose("signup")}
              variant="outline"
              size="small"
              className="max-w-xs mx-auto"
            >
              Return to Main Signup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}