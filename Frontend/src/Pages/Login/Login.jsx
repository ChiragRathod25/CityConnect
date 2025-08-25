import { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { GeometricShapes, MovingDots } from '../../components/CustomAnimation';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMethod, setForgotPasswordMethod] = useState('email'); // 'email' or 'phone'
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    resetEmail: '',
    resetPhone: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 2000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (forgotPasswordMethod === 'phone' || forgotPasswordMethod === 'email') {
        setShowVerifyCode(true);
        startResendTimer();
      } else {
        setResetEmailSent(true);
      }
    }, 2000);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) return;
    
    setIsLoading(true);
    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false);
      setResetEmailSent(true); // Show success message
    }, 2000);
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
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
      setVerificationCode(['', '', '', '', '', '']);
    }, 1000);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setShowVerifyCode(false);
    setResetEmailSent(false);
    setVerificationCode(['', '', '', '', '', '']);
    setResendTimer(0);
    setFormData(prev => ({ ...prev, resetEmail: '', resetPhone: '' }));
  };

  if (showForgotPassword) {
    return (
        <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
          {showVerifyCode ? (
            /* Verification Code Screen */
            <>
              <div className="text-center mb-8">
                <button
                  onClick={resetForgotPassword}
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter Verification Code</h1>
                <p className="text-gray-600">
                  We've sent a 6-digit code to{' '}
                  <span className="font-medium">{formData.resetPhone}</span>
                </p>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Enter 6-digit code
                  </label>
                  <div className="flex justify-center space-x-2 mb-4">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleCodeInput(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                        maxLength="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ))}
                  </div>
                  
                  {/* Resend Code */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <button
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || isLoading}
                      className="text-sm font-medium text-gray-800 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.join('').length !== 6}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </button>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                <p className="text-gray-600">Choose how you'd like to reset your password</p>
              </div>

              {/* Method Selection */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setForgotPasswordMethod('email')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    forgotPasswordMethod === 'email'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setForgotPasswordMethod('phone')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    forgotPasswordMethod === 'phone'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </button>
              </div>

              {/* Reset Form */}
              <div onSubmit={handleForgotPassword}>
                {forgotPasswordMethod === 'email' ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="resetEmail"
                      value={formData.resetEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We'll send a reset link to your email address
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="resetPhone"
                      value={formData.resetPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We'll send a verification code to your phone number
                    </p>
                  </div>
                )}

                <button
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
                    `Send Reset ${forgotPasswordMethod === 'email' ? 'Link' : 'Code'}`
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {forgotPasswordMethod === 'phone' ? 'Code Verified!' : 'Check Your Email'}
              </h1>
              <p className="text-gray-600 mb-6">
                {forgotPasswordMethod === 'phone' ? (
                  <>Your phone number has been verified. You can now create a new password.</>
                ) : (
                  <>We've sent a reset link to <span className="font-medium">{formData.resetEmail}</span></>
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

  return (
      <div className="min-w-md md:min-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
        <MovingDots count={500} density={100} />
        <GeometricShapes/>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div onSubmit={handleLogin} className="space-y-6">
          {/* Email/Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email or username"
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
                type={showPassword ? 'text' : 'password'}
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
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
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
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

        
          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;

//!====================================================================

// import { useState } from "react";
// import { FaLock } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import { loginImg } from "../../assets/assets";
// import { signin } from "../../features/userSlice";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
// import locales from "../../locales/login.local.json";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await dispatch(signin({ email, password }));
//       if (result.payload?.success) {
//         setItem(KEY_ACCESS_TOKEN, result.payload?.message?.token);
//         setItem("city", "Vallabh Vidyanagar");
//         setItem("language", "English");
//         setItem("category", "All");
//         toast.success("Login Successfully");
//         navigate("/");
//       } else {
//         toast.error(result.payload?.message);
//       }
//     } catch (error) {
//       toast.error(error);
//       console.log("Invalid email or password. Please try again.");
//     }
//   };




// const { language } = useSelector((state) => state.user);
// const t = locales[language];

// return (
//   <div className="flex min-h-screen items-center justify-center bg-[#FAF6F3] p-4">
//     <div className="flex w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden relative">
//       {/* Left Side (Form) */}
//       <div className="flex-1 p-12">
//         <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
//           {t.welcome_back}
//         </h2>

//         <form className="space-y-6" onSubmit={handleLogin}>
//           <div>
//             <label className="block text-gray-700 mb-2">{t.email}</label>
//             <div className="relative">
//               <input
//                 type="email"
//                 placeholder={t.email_placeholder}
//                 className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <span className="absolute left-4 top-5 text-xl text-gray-500">
//                 <MdEmail />
//               </span>
//             </div>
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">{t.password}</label>
//             <div className="relative">
//               <input
//                 type="password"
//                 placeholder={t.enter_password}
//                 className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="absolute left-4 top-4 text-gray-500 text-xl">
//                 <FaLock />
//               </span>
//             </div>
//           </div>

//           <div className="text-right text-gray-600 text-sm">
//             <a href="#" className="hover:underline">
//               {t.forgot_password}
//             </a>
//           </div>

//           <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
//             {t.login}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-6">
//           {t.dont_have_account}{" "}
//           <Link to="/signup" className="text-orange-600 font-bold hover:underline">
//             {t.sign_up}
//           </Link>
//         </p>
//       </div>

//       <div className="hidden md:flex flex-1 items-center justify-center p-12 relative">
//         <div className="absolute w-80 h-full bg-[#fbe2cf] rounded-t-full top-20 left-40 right-0 mx-auto z-0"></div>
//         <img src={loginImg} alt="Laptop Boy" className="w-72 h-auto object-cover relative z-10" />
//       </div>
//     </div>
//   </div>
// );

// }
