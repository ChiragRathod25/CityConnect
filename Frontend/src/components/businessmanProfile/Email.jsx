// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Mail, 
// //   ArrowLeft, 
// //   Shield, 
// //   CheckCircle, 
// //   AlertCircle,
// //   Clock,
// //   Eye,
// //   EyeOff,
// //   Send,
// //   RefreshCw
// // } from 'lucide-react';

// // const EmailEditPage = () => {
// //   const [currentEmail, setCurrentEmail] = useState('alex.johnson@business.com');
// //   const [newEmail, setNewEmail] = useState('');
// //   const [confirmEmail, setConfirmEmail] = useState('');
// //   const [step, setStep] = useState('edit'); // edit, verify, success
// //   const [otp, setOtp] = useState(['', '', '', '', '', '']);
// //   const [errors, setErrors] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [timer, setTimer] = useState(60);
// //   const [canResend, setCanResend] = useState(false);
// //   const [isVisible, setIsVisible] = useState(false);

// //   useEffect(() => {
// //     setIsVisible(true);
// //   }, []);

// //   useEffect(() => {
// //     if (step === 'verify' && timer > 0) {
// //       const interval = setInterval(() => {
// //         setTimer(prev => {
// //           if (prev <= 1) {
// //             setCanResend(true);
// //             return 0;
// //           }
// //           return prev - 1;
// //         });
// //       }, 1000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [step, timer]);

// //   const validateEmail = (email) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return emailRegex.test(email);
// //   };

// //   const handleEmailSubmit = (e) => {
// //     e.preventDefault();
// //     const newErrors = {};

// //     if (!newEmail) {
// //       newErrors.newEmail = 'New email is required';
// //     } else if (!validateEmail(newEmail)) {
// //       newErrors.newEmail = 'Please enter a valid email address';
// //     }

// //     if (!confirmEmail) {
// //       newErrors.confirmEmail = 'Please confirm your email';
// //     } else if (newEmail !== confirmEmail) {
// //       newErrors.confirmEmail = 'Emails do not match';
// //     }

// //     if (newEmail === currentEmail) {
// //       newErrors.newEmail = 'New email must be different from current email';
// //     }

// //     setErrors(newErrors);

// //     if (Object.keys(newErrors).length === 0) {
// //       setLoading(true);
// //       setTimeout(() => {
// //         setLoading(false);
// //         setStep('verify');
// //         setTimer(60);
// //         setCanResend(false);
// //       }, 1500);
// //     }
// //   };

// //   const handleOtpChange = (index, value) => {
// //     if (value.length > 1) return;
    
// //     const newOtp = [...otp];
// //     newOtp[index] = value;
// //     setOtp(newOtp);

// //     // Auto focus next input
// //     if (value && index < 5) {
// //       document.getElementById(`otp-${index + 1}`).focus();
// //     }
// //   };

// //   const handleOtpSubmit = (e) => {
// //     e.preventDefault();
// //     const otpValue = otp.join('');
    
// //     if (otpValue.length !== 6) {
// //       setErrors({ otp: 'Please enter complete OTP' });
// //       return;
// //     }

// //     setLoading(true);
// //     setTimeout(() => {
// //       setLoading(false);
// //       if (otpValue === '123456') {
// //         setStep('success');
// //       } else {
// //         setErrors({ otp: 'Invalid OTP. Please try again.' });
// //       }
// //     }, 1500);
// //   };

// //   const handleResendOtp = () => {
// //     setCanResend(false);
// //     setTimer(60);
// //     setOtp(['', '', '', '', '', '']);
// //     setErrors({});
// //     alert('OTP resent successfully!');
// //   };

// //   const handleBack = () => {
// //     if (step === 'verify') {
// //       setStep('edit');
// //     } else {
// //       alert('Going back to edit profile');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
// //       <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
// //         {/* Header */}
// //         <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-6 sm:mb-8 transition-all duration-700 ${
// //           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
// //         }`}>
// //           <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-4 sm:p-6">
// //             <div className="flex items-center justify-between">
// //               <button
// //                 onClick={handleBack}
// //                 className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl transition-all duration-300 hover:scale-105"
// //               >
// //                 <ArrowLeft className="w-4 h-4" />
// //                 <span className="font-medium hidden sm:inline">Back</span>
// //               </button>
              
// //               <div className="flex items-center space-x-3">
// //                 <div className="p-3 bg-white/10 rounded-xl">
// //                   <Mail className="w-6 h-6 text-white" />
// //                 </div>
// //                 <div className="text-white">
// //                   <h1 className="text-xl sm:text-2xl font-bold">
// //                     {step === 'edit' ? 'Change Email' : step === 'verify' ? 'Verify Email' : 'Email Updated'}
// //                   </h1>
// //                   <p className="text-blue-100 text-sm sm:text-base">
// //                     {step === 'edit' ? 'Update your email address' : 
// //                      step === 'verify' ? 'Enter verification code' : 
// //                      'Email successfully updated'}
// //                   </p>
// //                 </div>
// //               </div>
              
// //               <div className="w-16 sm:w-20" />
// //             </div>
// //           </div>

// //           {/* Progress Steps */}
// //           <div className="bg-blue-50 border-t border-blue-200 p-4">
// //             <div className="flex items-center justify-center space-x-8">
// //               <div className="flex items-center space-x-2">
// //                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
// //                   step === 'edit' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
// //                 }`}>
// //                   {step === 'edit' ? '1' : <CheckCircle className="w-4 h-4" />}
// //                 </div>
// //                 <span className={`text-sm font-medium ${step === 'edit' ? 'text-blue-600' : 'text-green-600'}`}>
// //                   Edit Email
// //                 </span>
// //               </div>
              
// //               <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
// //                 step !== 'edit' ? 'bg-green-500' : 'bg-gray-300'
// //               }`} />
              
// //               <div className="flex items-center space-x-2">
// //                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
// //                   step === 'verify' ? 'bg-blue-500 text-white' : 
// //                   step === 'success' ? 'bg-green-500 text-white' : 
// //                   'bg-gray-300 text-gray-600'
// //                 }`}>
// //                   {step === 'success' ? <CheckCircle className="w-4 h-4" /> : '2'}
// //                 </div>
// //                 <span className={`text-sm font-medium ${
// //                   step === 'verify' ? 'text-blue-600' : 
// //                   step === 'success' ? 'text-green-600' : 
// //                   'text-gray-500'
// //                 }`}>
// //                   Verify
// //                 </span>
// //               </div>
              
// //               <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
// //                 step === 'success' ? 'bg-green-500' : 'bg-gray-300'
// //               }`} />
              
// //               <div className="flex items-center space-x-2">
// //                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
// //                   step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
// //                 }`}>
// //                   {step === 'success' ? <CheckCircle className="w-4 h-4" /> : '3'}
// //                 </div>
// //                 <span className={`text-sm font-medium ${step === 'success' ? 'text-green-600' : 'text-gray-500'}`}>
// //                   Complete
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Content */}
// //         <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-500 ${
// //           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
// //         }`} style={{ transitionDelay: '200ms' }}>
          
// //           {/* Step 1: Edit Email */}
// //           {step === 'edit' && (
// //             <div className="space-y-6">
// //               <div className="text-center pb-6 border-b border-gray-200">
// //                 <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg mb-4">
// //                   <Mail className="w-4 h-4 text-blue-600" />
// //                   <span className="text-sm font-medium text-blue-800">Current Email</span>
// //                 </div>
// //                 <p className="text-lg font-semibold text-gray-800">{currentEmail}</p>
// //               </div>

// //               <form onSubmit={handleEmailSubmit} className="space-y-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     New Email Address
// //                   </label>
// //                   <input
// //                     type="email"
// //                     value={newEmail}
// //                     onChange={(e) => setNewEmail(e.target.value)}
// //                     className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
// //                       errors.newEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
// //                     }`}
// //                     placeholder="Enter your new email address"
// //                   />
// //                   {errors.newEmail && (
// //                     <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
// //                       <AlertCircle className="w-4 h-4" />
// //                       <span>{errors.newEmail}</span>
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Confirm New Email
// //                   </label>
// //                   <input
// //                     type="email"
// //                     value={confirmEmail}
// //                     onChange={(e) => setConfirmEmail(e.target.value)}
// //                     className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
// //                       errors.confirmEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
// //                     }`}
// //                     placeholder="Confirm your new email address"
// //                   />
// //                   {errors.confirmEmail && (
// //                     <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
// //                       <AlertCircle className="w-4 h-4" />
// //                       <span>{errors.confirmEmail}</span>
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
// //                   <div className="flex items-start space-x-3">
// //                     <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
// //                     <div>
// //                       <h4 className="text-sm font-semibold text-yellow-800 mb-1">Security Notice</h4>
// //                       <p className="text-sm text-yellow-700">
// //                         We'll send a verification code to your new email address to confirm the change.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
// //                 >
// //                   {loading ? (
// //                     <RefreshCw className="w-5 h-5 animate-spin" />
// //                   ) : (
// //                     <>
// //                       <Send className="w-5 h-5" />
// //                       <span>Send Verification Code</span>
// //                     </>
// //                   )}
// //                 </button>
// //               </form>
// //             </div>
// //           )}

// //           {/* Step 2: Verify OTP */}
// //           {step === 'verify' && (
// //             <div className="space-y-6">
// //               <div className="text-center">
// //                 <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
// //                   <Mail className="w-8 h-8 text-blue-600" />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
// //                 <p className="text-gray-600 mb-4">
// //                   We've sent a 6-digit verification code to:
// //                 </p>
// //                 <p className="font-semibold text-blue-600">{newEmail}</p>
// //               </div>

// //               <form onSubmit={handleOtpSubmit} className="space-y-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
// //                     Enter Verification Code
// //                   </label>
// //                   <div className="flex justify-center space-x-3">
// //                     {otp.map((digit, index) => (
// //                       <input
// //                         key={index}
// //                         id={`otp-${index}`}
// //                         type="text"
// //                         value={digit}
// //                         onChange={(e) => handleOtpChange(index, e.target.value)}
// //                         className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
// //                         maxLength="1"
// //                         onKeyDown={(e) => {
// //                           if (e.key === 'Backspace' && !digit && index > 0) {
// //                             document.getElementById(`otp-${index - 1}`).focus();
// //                           }
// //                         }}
// //                       />
// //                     ))}
// //                   </div>
// //                   {errors.otp && (
// //                     <p className="mt-3 text-sm text-red-600 flex items-center justify-center space-x-1">
// //                       <AlertCircle className="w-4 h-4" />
// //                       <span>{errors.otp}</span>
// //                     </p>
// //                   )}
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
// //                 >
// //                   {loading ? (
// //                     <RefreshCw className="w-5 h-5 animate-spin" />
// //                   ) : (
// //                     <>
// //                       <CheckCircle className="w-5 h-5" />
// //                       <span>Verify Email</span>
// //                     </>
// //                   )}
// //                 </button>
// //               </form>

// //               <div className="text-center pt-4 border-t border-gray-200">
// //                 <div className="flex items-center justify-center space-x-2 mb-3">
// //                   <Clock className="w-4 h-4 text-gray-500" />
// //                   <span className="text-sm text-gray-600">
// //                     {timer > 0 ? `Resend code in ${timer}s` : 'You can now resend the code'}
// //                   </span>
// //                 </div>
// //                 <button
// //                   onClick={handleResendOtp}
// //                   disabled={!canResend}
// //                   className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium text-sm transition-colors disabled:cursor-not-allowed"
// //                 >
// //                   Resend Verification Code
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Step 3: Success */}
// //           {step === 'success' && (
// //             <div className="text-center space-y-6">
// //               <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
// //                 <CheckCircle className="w-10 h-10 text-green-600" />
// //               </div>
              
// //               <div>
// //                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Updated Successfully!</h3>
// //                 <p className="text-gray-600 mb-6">
// //                   Your email address has been changed and verified.
// //                 </p>
// //               </div>

// //               <div className="bg-green-50 border border-green-200 rounded-xl p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm font-medium text-green-800">New Email Address</p>
// //                     <p className="text-green-700 font-semibold">{newEmail}</p>
// //                   </div>
// //                   <div className="flex items-center space-x-1 text-green-600">
// //                     <CheckCircle className="w-4 h-4" />
// //                     <span className="text-sm font-medium">Verified</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="space-y-3">
// //                 <button
// //                   onClick={() => alert('Going back to profile')}
// //                   className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
// //                 >
// //                   <CheckCircle className="w-5 h-5" />
// //                   <span>Return to Profile</span>
// //                 </button>
                
// //                 <button
// //                   onClick={() => alert('Going to edit profile')}
// //                   className="w-full px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-medium rounded-xl transition-all duration-300 hover:bg-gray-50"
// //                 >
// //                   Continue Editing Profile
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Info Card */}
// //         {step !== 'success' && (
// //           <div className={`mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 transition-all duration-500 ${
// //             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
// //           }`} style={{ transitionDelay: '400ms' }}>
// //             <div className="flex items-start space-x-3">
// //               <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
// //               <div>
// //                 <h4 className="text-sm font-semibold text-blue-800 mb-1">Security & Privacy</h4>
// //                 <ul className="text-sm text-blue-700 space-y-1">
// //                   <li>• Your data is encrypted and secure</li>
// //                   <li>• We'll never share your email with third parties</li>
// //                   <li>• You can change your email anytime</li>
// //                 </ul>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <style jsx>{`
// //         .hover\:scale-102:hover {
// //           transform: scale(1.02);
// //         }
        
// //         @keyframes bounce {
// //           0%, 20%, 53%, 80%, 100% {
// //             transform: translateY(0px);
// //           }
// //           40%, 43% {
// //             transform: translateY(-10px);
// //           }
// //           70% {
// //             transform: translateY(-5px);
// //           }
// //           90% {
// //             transform: translateY(-2px);
// //           }
// //         }
        
// //         .animate-bounce {
// //           animation: bounce 2s ease-infinite;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default EmailEditPage;

// import React, { useState, useEffect } from 'react';
// import { 
//   Mail, 
//   ArrowLeft, 
//   Shield, 
//   CheckCircle, 
//   AlertCircle,
//   Clock,
//   Send,
//   RefreshCw
// } from 'lucide-react';

// const EmailEditPage = () => {
//   const [currentEmail, setCurrentEmail] = useState('alex.johnson@business.com');
//   const [newEmail, setNewEmail] = useState('');
//   const [confirmEmail, setConfirmEmail] = useState('');
//   const [step, setStep] = useState('edit'); // edit, verify, success
//   const [otp, setOtp] = useState(Array(6).fill(''));
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   useEffect(() => {
//     if (step === 'verify' && timer > 0) {
//       const interval = setInterval(() => {
//         setTimer(prev => {
//           if (prev <= 1) {
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [step, timer]);

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleEmailSubmit = () => {
//     const newErrors = {};

//     if (!newEmail) {
//       newErrors.newEmail = 'New email is required';
//     } else if (!validateEmail(newEmail)) {
//       newErrors.newEmail = 'Please enter a valid email address';
//     }

//     if (!confirmEmail) {
//       newErrors.confirmEmail = 'Please confirm your email';
//     } else if (newEmail !== confirmEmail) {
//       newErrors.confirmEmail = 'Emails do not match';
//     }

//     if (newEmail === currentEmail) {
//       newErrors.newEmail = 'New email must be different from current email';
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setLoading(true);
//       setTimeout(() => {
//         setLoading(false);
//         setStep('verify');
//         setTimer(60);
//         setCanResend(false);
//       }, 1500);
//     }
//   };

//   const handleOtpChange = (index, value) => {
//     if (isNaN(value)) return;
//     if (value.length > 1) return;
    
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto focus next input
//     if (value && index < 5) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   const handleOtpKeyDown = (e, index) => {
//     // Handle backspace
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) {
//         prevInput.focus();
//         const newOtp = [...otp];
//         newOtp[index - 1] = '';
//         setOtp(newOtp);
//       }
//     }
//     // Handle enter
//     if (e.key === 'Enter') {
//       e.target.blur();
//     }
//   };

//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').slice(0, 6);
//     if (/^\d+$/.test(pastedData)) {
//       const newOtp = Array(6).fill('');
//       for (let i = 0; i < pastedData.length; i++) {
//         newOtp[i] = pastedData[i];
//       }
//       setOtp(newOtp);
//       // Focus the last filled input + 1
//       const nextIndex = Math.min(pastedData.length, 5);
//       const nextInput = document.getElementById(`otp-${nextIndex}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   const handleOtpSubmit = () => {
//     const otpValue = otp.join('');
    
//     if (otpValue.length !== 6) {
//       setErrors({ otp: 'Please enter complete OTP' });
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       if (otpValue === '123456') {
//         setStep('success');
//       } else {
//         setErrors({ otp: 'Invalid OTP. Please try again.' });
//       }
//     }, 1500);
//   };

//   const handleResendOtp = () => {
//     setCanResend(false);
//     setTimer(60);
//     setOtp(Array(6).fill(''));
//     setErrors({});
//     alert('OTP resent successfully!');
//   };

//   const handleBack = () => {
//     if (step === 'verify') {
//       setStep('edit');
//     } else {
//       alert('Going back to edit profile');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        
//         {/* Header */}
//         <div className={`bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-4 sm:mb-6 lg:mb-8 transition-all duration-700 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//         }`}>
//           <div className="relative bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 p-4 sm:p-6">
//             <div className="flex items-center justify-between">
//               {/* <button
//                 onClick={handleBack}
//                 className="flex items-center space-x-2 px-3 py-2 sm:px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span className="font-medium hidden sm:inline text-sm">Back</span>
//               </button> */}
              
//               <div className="flex mx-auto items-center space-x-2 sm:space-x-3">
//                 <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
//                   <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <div className="text-white">
//                   <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
//                     {step === 'edit' ? 'Change Email' : step === 'verify' ? 'Verify Email' : 'Email Updated'}
//                   </h1>
//                   <p className="text-gray-100 text-xs sm:text-sm lg:text-base">
//                     {step === 'edit' ? 'Update your email address' : 
//                      step === 'verify' ? 'Enter verification code' : 
//                      'Email successfully updated'}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="w-12 sm:w-16 lg:w-20" />
//             </div>
//           </div>

//           {/* Progress Steps */}
//           <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4">
//             <div className="flex items-center justify-center space-x-4 sm:space-x-8">
//               <div className="flex items-center space-x-1 sm:space-x-2">
//                 <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
//                   step === 'edit' ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
//                 }`}>
//                   {step === 'edit' ? '1' : <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
//                 </div>
//                 <span className={`text-xs sm:text-sm font-medium ${step === 'edit' ? 'text-gray-600' : 'text-green-600'}`}>
//                   Edit Email
//                 </span>
//               </div>
              
//               <div className={`w-8 sm:w-16 h-1 rounded-full transition-all duration-500 ${
//                 step !== 'edit' ? 'bg-green-500' : 'bg-gray-300'
//               }`} />
              
//               <div className="flex items-center space-x-1 sm:space-x-2">
//                 <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
//                   step === 'verify' ? 'bg-gray-500 text-white' : 
//                   step === 'success' ? 'bg-green-500 text-white' : 
//                   'bg-gray-300 text-gray-600'
//                 }`}>
//                   {step === 'success' ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '2'}
//                 </div>
//                 <span className={`text-xs sm:text-sm font-medium ${
//                   step === 'verify' ? 'text-gray-600' : 
//                   step === 'success' ? 'text-green-600' : 
//                   'text-gray-500'
//                 }`}>
//                   Verify
//                 </span>
//               </div>
              
//               <div className={`w-8 sm:w-16 h-1 rounded-full transition-all duration-500 ${
//                 step === 'success' ? 'bg-green-500' : 'bg-gray-300'
//               }`} />
              
//               <div className="flex items-center space-x-1 sm:space-x-2">
//                 <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
//                   step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
//                 }`}>
//                   {step === 'success' ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '3'}
//                 </div>
//                 <span className={`text-xs sm:text-sm font-medium ${step === 'success' ? 'text-green-600' : 'text-gray-500'}`}>
//                   Complete
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 transition-all duration-500 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//         }`} style={{ transitionDelay: '200ms' }}>
          
//           {/* Step 1: Edit Email */}
//           {step === 'edit' && (
//             <div className="space-y-4 sm:space-y-6">
//               <div className="text-center pb-4 sm:pb-6 border-b border-gray-200">
//                 <div className="inline-flex items-center space-x-2 px-3 py-2 sm:px-4 bg-gray-50 rounded-lg mb-3 sm:mb-4">
//                   <Mail className="w-4 h-4 text-gray-600" />
//                   <span className="text-xs sm:text-sm font-medium text-gray-800">Current Email</span>
//                 </div>
//                 <p className="text-base sm:text-lg font-semibold text-gray-800 break-all">{currentEmail}</p>
//               </div>

//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={newEmail}
//                     onChange={(e) => setNewEmail(e.target.value)}
//                     className={`w-full px-3 py-3 sm:px-4 border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition-all duration-300 text-sm sm:text-base ${
//                       errors.newEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
//                     }`}
//                     placeholder="Enter your new email address"
//                   />
//                   {errors.newEmail && (
//                     <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
//                       <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span>{errors.newEmail}</span>
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Email
//                   </label>
//                   <input
//                     type="email"
//                     value={confirmEmail}
//                     onChange={(e) => setConfirmEmail(e.target.value)}
//                     className={`w-full px-3 py-3 sm:px-4 border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition-all duration-300 text-sm sm:text-base ${
//                       errors.confirmEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
//                     }`}
//                     placeholder="Confirm your new email address"
//                   />
//                   {errors.confirmEmail && (
//                     <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
//                       <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span>{errors.confirmEmail}</span>
//                     </p>
//                   )}
//                 </div>

//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
//                   <div className="flex items-start space-x-2 sm:space-x-3">
//                     <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5" />
//                     <div>
//                       <h4 className="text-xs sm:text-sm font-semibold text-yellow-800 mb-1">Security Notice</h4>
//                       <p className="text-xs sm:text-sm text-yellow-700">
//                         We'll send a verification code to your new email address to confirm the change.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleEmailSubmit}
//                   disabled={loading}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 sm:px-6 sm:py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 text-sm sm:text-base"
//                 >
//                   {loading ? (
//                     <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                   ) : (
//                     <>
//                       <Send className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span>Send Verification Code</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Verify OTP */}
//           {step === 'verify' && (
//             <div className="space-y-4 sm:space-y-6">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
//                   <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
//                 </div>
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
//                 <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
//                   We've sent a 6-digit verification code to:
//                 </p>
//                 <p className="font-semibold text-gray-600 text-sm sm:text-base break-all px-4">{newEmail}</p>
//               </div>

//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <div className="text-center mb-4">
//                     <h3 className="text-base sm:text-lg font-medium mb-1 text-gray-800">
//                       Enter 6-digit code
//                     </h3>
//                   </div>
//                   <div className="flex justify-center space-x-2 sm:space-x-3">
//                     {otp.map((digit, index) => (
//                       <div key={index} className="relative">
//                         <input
//                           id={`otp-${index}`}
//                           type="text"
//                           maxLength="1"
//                           value={digit}
//                           onChange={(e) => handleOtpChange(index, e.target.value)}
//                           onKeyDown={(e) => handleOtpKeyDown(e, index)}
//                           onPaste={handleOtpPaste}
//                           className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-center text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-300 focus:scale-110 ${
//                             errors.otp
//                               ? 'border-red-400 bg-red-50'
//                               : digit
//                               ? 'border-green-400 bg-green-50 text-green-700'
//                               : 'border-gray-300 bg-white hover:border-gray-400 focus:border-gray-500'
//                           }`}
//                         />
//                         {digit && (
//                           <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   {errors.otp && (
//                     <p className="mt-3 text-xs sm:text-sm text-red-600 flex items-center justify-center space-x-1">
//                       <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span>{errors.otp}</span>
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleOtpSubmit}
//                   disabled={loading}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 sm:px-6 sm:py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 text-sm sm:text-base"
//                 >
//                   {loading ? (
//                     <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                   ) : (
//                     <>
//                       <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span>Verify Email</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
//                 <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
//                   <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
//                   <span className="text-xs sm:text-sm text-gray-600">
//                     {timer > 0 ? `Resend code in ${timer}s` : 'You can now resend the code'}
//                   </span>
//                 </div>
//                 <button
//                   onClick={handleResendOtp}
//                   disabled={!canResend}
//                   className="text-gray-600 hover:text-gray-700 disabled:text-gray-400 font-medium text-xs sm:text-sm transition-colors disabled:cursor-not-allowed"
//                 >
//                   Resend Verification Code
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Success */}
//           {step === 'success' && (
//             <div className="text-center space-y-4 sm:space-y-6">
//               <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-3 sm:mb-4 animate-bounce">
//                 <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
//               </div>
              
//               <div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Email Updated Successfully!</h3>
//                 <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
//                   Your email address has been changed and verified.
//                 </p>
//               </div>

//               <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="text-left">
//                     <p className="text-xs sm:text-sm font-medium text-green-800">New Email Address</p>
//                     <p className="text-green-700 font-semibold text-sm sm:text-base break-all">{newEmail}</p>
//                   </div>
//                   <div className="flex items-center space-x-1 text-green-600 ml-2">
//                     <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                     <span className="text-xs sm:text-sm font-medium">Verified</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={() => alert('Going to edit profile')}
//                   className="w-full px-4 py-3 sm:px-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-medium rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-50 text-sm sm:text-base"
//                 >
//                   Continue Editing Profile
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Info Card */}
//         {step !== 'success' && (
//           <div className={`mt-4 sm:mt-6 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-500 ${
//             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//           }`} style={{ transitionDelay: '400ms' }}>
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5" />
//               <div>
//                 <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Security & Privacy</h4>
//                 <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
//                   <li>• Your data is encrypted and secure</li>
//                   <li>• We'll never share your email with third parties</li>
//                   <li>• You can change your email anytime</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes bounce {
//           0%, 20%, 53%, 80%, 100% {
//             transform: translateY(0px);
//           }
//           40%, 43% {
//             transform: translateY(-10px);
//           }
//           70% {
//             transform: translateY(-5px);
//           }
//           90% {
//             transform: translateY(-2px);
//           }
//         }
        
//         .animate-bounce {
//           animation: bounce 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EmailEditPage;


import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Send,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';

const ContactEditPage = ({ type = 'email' }) => {
  const isEmail = type === 'email';
  
  const [currentContact, setCurrentContact] = useState(
    isEmail ? 'alex.johnson@business.com' : '+1 (555) 123-4567'
  );
  const [newContact, setNewContact] = useState('');
  const [confirmContact, setConfirmContact] = useState('');
  const [step, setStep] = useState('edit'); // edit, verify, success
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (step === 'verify' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
      }
    }
    return phone;
  };

  const handleContactSubmit = () => {
    const newErrors = {};

    if (!newContact) {
      newErrors.newContact = `New ${isEmail ? 'email' : 'phone number'} is required`;
    } else if (isEmail && !validateEmail(newContact)) {
      newErrors.newContact = 'Please enter a valid email address';
    } else if (!isEmail && !validatePhone(newContact)) {
      newErrors.newContact = 'Please enter a valid phone number';
    }

    if (!confirmContact) {
      newErrors.confirmContact = `Please confirm your ${isEmail ? 'email' : 'phone number'}`;
    } else if (newContact !== confirmContact) {
      newErrors.confirmContact = `${isEmail ? 'Emails' : 'Phone numbers'} do not match`;
    }

    if (newContact === currentContact) {
      newErrors.newContact = `New ${isEmail ? 'email' : 'phone number'} must be different from current ${isEmail ? 'email' : 'phone number'}`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('verify');
        setTimer(60);
        setCanResend(false);
      }, 1500);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
    // Handle enter
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus the last filled input + 1
      const nextIndex = Math.min(pastedData.length, 5);
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setErrors({ otp: 'Please enter complete OTP' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') {
        setStep('success');
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    setCanResend(false);
    setTimer(60);
    setOtp(Array(6).fill(''));
    setErrors({});
    alert('OTP resent successfully!');
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('edit');
    } else {
      alert('Going back to edit profile');
    }
  };

  const handlePhoneInput = (value) => {
    // Allow only numbers, spaces, dashes, parentheses, and plus sign
    const cleaned = value.replace(/[^\d\s\-\(\)\+]/g, '');
    setNewContact(cleaned);
  };

  const handlePhoneConfirmInput = (value) => {
    const cleaned = value.replace(/[^\d\s\-\(\)\+]/g, '');
    setConfirmContact(cleaned);
  };

  const ContactIcon = isEmail ? Mail : Phone;
  const contactType = isEmail ? 'email' : 'phone number';
  const ContactTypeCapital = isEmail ? 'Email' : 'Phone Number';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        
        {/* Header */}
        <div className={`bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-4 sm:mb-6 lg:mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="relative bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 p-4 sm:p-6">
            <div className="flex  items-center justify-center">              
              <div className="flex md:ml-16 items-center space-x-4 sm:space-x-5">
                <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                  <ContactIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {step === 'edit' ? `Change ${ContactTypeCapital}` : 
                     step === 'verify' ? `Verify ${ContactTypeCapital}` : 
                     `${ContactTypeCapital} Updated`}
                  </h1>
                  <p className="text-gray-100 text-xs sm:text-sm lg:text-base">
                    {step === 'edit' ? `Update your ${contactType}` : 
                     step === 'verify' ? 'Enter verification code' : 
                     `${ContactTypeCapital} successfully updated`}
                  </p>
                </div>
              </div>
              
              <div className="w-12 sm:w-16 lg:w-20" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  step === 'edit' ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {step === 'edit' ? '1' : <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${step === 'edit' ? 'text-gray-600' : 'text-green-600'} hidden sm:inline`}>
                  Edit 
                </span>
                <span className={`text-xs font-medium ${step === 'edit' ? 'text-gray-600' : 'text-green-600'} sm:hidden`}>
                  Edit
                </span>
              </div>
              
              <div className={`w-4 sm:w-8 lg:w-16 h-1 rounded-full transition-all duration-500 ${
                step !== 'edit' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  step === 'verify' ? 'bg-gray-500 text-white' : 
                  step === 'success' ? 'bg-green-500 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {step === 'success' ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '2'}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  step === 'verify' ? 'text-gray-600' : 
                  step === 'success' ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  Verify
                </span>
              </div>
              
              <div className={`w-4 sm:w-8 lg:w-16 h-1 rounded-full transition-all duration-500 ${
                step === 'success' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step === 'success' ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '3'}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${step === 'success' ? 'text-green-600' : 'text-gray-500'} hidden sm:inline`}>
                  Complete
                </span>
                <span className={`text-xs font-medium ${step === 'success' ? 'text-green-600' : 'text-gray-500'} sm:hidden`}>
                  Done
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '200ms' }}>
          
          {/* Step 1: Edit Contact */}
          {step === 'edit' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center pb-4 sm:pb-6 border-b border-gray-200">
                <div className="inline-flex items-center space-x-2 px-3 py-2 sm:px-4 bg-gray-100 rounded-lg mb-3 sm:mb-4">
                  <ContactIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-800">Current {ContactTypeCapital}</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-800 break-all">{currentContact}</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New {ContactTypeCapital}
                  </label>
                  <input
                    type={isEmail ? "email" : "tel"}
                    value={newContact}
                    onChange={(e) => isEmail ? setNewContact(e.target.value) : handlePhoneInput(e.target.value)}
                    className={`w-full px-3 py-3 sm:px-4 border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition-all duration-300 text-sm sm:text-base ${
                      errors.newContact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder={isEmail ? "Enter your new email address" : "Enter your new phone number"}
                  />
                  {errors.newContact && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{errors.newContact}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New {ContactTypeCapital}
                  </label>
                  <input
                    type={isEmail ? "email" : "tel"}
                    value={confirmContact}
                    onChange={(e) => isEmail ? setConfirmContact(e.target.value) : handlePhoneConfirmInput(e.target.value)}
                    className={`w-full px-3 py-3 sm:px-4 border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition-all duration-300 text-sm sm:text-base ${
                      errors.confirmContact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder={isEmail ? "Confirm your new email address" : "Confirm your new phone number"}
                  />
                  {errors.confirmContact && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{errors.confirmContact}</span>
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-yellow-800 mb-1">Security Notice</h4>
                      <p className="text-xs sm:text-sm text-yellow-700">
                        We'll send a verification code to your new {contactType} to confirm the change.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContactSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 sm:px-6 sm:py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 text-sm sm:text-base"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 'verify' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <ContactIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {isEmail ? 'Check Your Email' : 'Check Your Phone'}
                </h3>
                <p className="text-sm px-6 sm:px-0 sm:text-base text-gray-600 mb-2 sm:mb-4">
                  We've sent a 6-digit verification code {isEmail ? 'to:' : 'via SMS to:'}
                </p>
                <p className="font-semibold text-gray-600 text-sm sm:text-base break-all px-4">{newContact}</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-base sm:text-lg font-medium mb-1 text-gray-800">
                      Enter 6-digit code
                    </h3>
                  </div>
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    {otp.map((digit, index) => (
                      <div key={index} className="relative">
                        <input
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          onPaste={handleOtpPaste}
                          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-center text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-300 focus:scale-110 ${
                            errors.otp
                              ? 'border-red-400 bg-red-50'
                              : digit
                              ? 'border-green-400 bg-green-50 text-green-700'
                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-gray-500'
                          }`}
                        />
                        {digit && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="mt-3 text-xs sm:text-sm text-red-600 flex items-center justify-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{errors.otp}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading}
                  className="w-full flex cursor-pointer items-center justify-center space-x-2 px-4 py-3 sm:px-6 sm:py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 text-sm sm:text-base"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Verify {ContactTypeCapital}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {timer > 0 ? `Resend code in ${timer}s` : 'You can now resend the code'}
                  </span>
                </div>
                <Button
                  onClick={handleResendOtp}
                  variant='outline'
                  size='small'
                  disabled={!canResend}
                  className="text-gray-600 cursor-pointer hover:text-gray-700 disabled:text-gray-400 font-medium text-xs sm:text-sm transition-colors disabled:cursor-not-allowed"
                >
                  Resend Verification Code
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-3 sm:mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{ContactTypeCapital} Updated Successfully!</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Your {contactType} has been changed and verified.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-medium text-green-800">New {ContactTypeCapital}</p>
                    <p className="text-green-700 font-semibold text-sm sm:text-base break-all">{newContact}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 ml-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => alert('Going to edit profile')}
                  className="w-full px-4 py-3 sm:px-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-medium rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-50 text-sm sm:text-base"
                >
                  Continue Editing Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        {step !== 'success' && (
          <div className={`mt-4 sm:mt-6 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '400ms' }}>
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Security & Privacy</h4>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <li>• Your data is encrypted and secure</li>
                  <li>• We'll never share your {contactType} with third parties</li>
                  <li>• You can change your {contactType} anytime</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0px);
          }
          40%, 43% {
            transform: translateY(-10px);
          }
          70% {
            transform: translateY(-5px);
          }
          90% {
            transform: translateY(-2px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactEditPage;