// import { useState, useEffect } from 'react';
// import { Eye, EyeOff, Check, X, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

// const PasswordResetPage = ({ token = 'demo-token-123' }) => {
//   const [formData, setFormData] = useState({
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState({
//     score: 0,
//     feedback: [],
//     isValid: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isTokenValid, setIsTokenValid] = useState(true);
//   const [resetSuccess, setResetSuccess] = useState(false);

//   // Password strength criteria
//   const strengthCriteria = [
//     { id: 'length', label: 'At least 8 characters', test: (password) => password.length >= 8 },
//     { id: 'uppercase', label: 'One uppercase letter', test: (password) => /[A-Z]/.test(password) },
//     { id: 'lowercase', label: 'One lowercase letter', test: (password) => /[a-z]/.test(password) },
//     { id: 'number', label: 'One number', test: (password) => /\d/.test(password) },
//     { id: 'special', label: 'One special character', test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
//   ];

//   // Validate token on component mount
//   useEffect(() => {
//     const validateToken = async () => {
//       // Simulate token validation
//       if (!token || token === 'invalid-token') {
//         setIsTokenValid(false);
//       }
//     };
//     validateToken();
//   }, [token]);

//   // Calculate password strength
//   useEffect(() => {
//     const password = formData.newPassword;
//     if (!password) {
//       setPasswordStrength({ score: 0, feedback: [], isValid: false });
//       return;
//     }

//     const passedCriteria = strengthCriteria.filter(criteria => criteria.test(password));
//     const score = passedCriteria.length;
    
//     let strength = 'Weak';
//     let color = 'red';
    
//     if (score >= 5) {
//       strength = 'Very Strong';
//       color = 'green';
//     } else if (score >= 4) {
//       strength = 'Strong';
//       color = 'green';
//     } else if (score >= 3) {
//       strength = 'Good';
//       color = 'yellow';
//     } else if (score >= 2) {
//       strength = 'Fair';
//       color = 'orange';
//     }

//     setPasswordStrength({
//       score,
//       strength,
//       color,
//       feedback: strengthCriteria.map(criteria => ({
//         ...criteria,
//         passed: criteria.test(password)
//       })),
//       isValid: score >= 4 // Require at least 4 criteria
//     });
//   }, [formData.newPassword]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear errors when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.newPassword) {
//       newErrors.newPassword = 'New password is required';
//     } else if (!passwordStrength.isValid) {
//       newErrors.newPassword = 'Password does not meet security requirements';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.newPassword !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Simulate successful password reset
//       setResetSuccess(true);
//     } catch (error) {
//       setErrors({ general: 'Something went wrong. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStrengthBarColor = () => {
//     const colors = {
//       red: 'bg-red-500',
//       orange: 'bg-orange-500',
//       yellow: 'bg-yellow-500',
//       green: 'bg-green-500'
//     };
//     return colors[passwordStrength.color] || 'bg-gray-300';
//   };

//   const getStrengthBarWidth = () => {
//     return `${(passwordStrength.score / 5) * 100}%`;
//   };

//   // Invalid token view
//   if (!isTokenValid) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
//           <p className="text-gray-600 mb-6">
//             This password reset link is invalid or has expired. Please request a new one.
//           </p>
//           <button 
//             onClick={() => window.location.href = '/login'}
//             className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Success view
//   if (resetSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h1>
//           <p className="text-gray-600 mb-6">
//             Your password has been successfully updated. You can now sign in with your new password.
//           </p>
//           <button 
//             onClick={() => window.location.href = '/login'}
//             className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
//           >
//             Continue to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Shield className="w-8 h-8 text-gray-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Password</h1>
//           <p className="text-gray-600">Choose a strong password for your account</p>
//         </div>

//         {/* General Error */}
//         {errors.general && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
//             <p className="text-red-600 text-sm">{errors.general}</p>
//           </div>
//         )}

//         {/* Password Reset Form */}
//         <div onSubmit={handleSubmit} className="space-y-6">
//           {/* New Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? 'text' : 'password'}
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleInputChange}
//                 placeholder="Enter your new password"
//                 className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
//                   errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//             {errors.newPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
//             )}
//           </div>

//           {/* Password Strength Indicator */}
//           {formData.newPassword && (
//             <div className="space-y-3">
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-gray-700">Password Strength</span>
//                   <span className={`text-sm font-medium ${
//                     passwordStrength.color === 'green' ? 'text-green-600' :
//                     passwordStrength.color === 'yellow' ? 'text-yellow-600' :
//                     passwordStrength.color === 'orange' ? 'text-orange-600' :
//                     'text-red-600'
//                   }`}>
//                     {passwordStrength.strength}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
//                     style={{ width: getStrengthBarWidth() }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Password Criteria */}
//               <div className="space-y-2">
//                 {passwordStrength.feedback.map((criteria) => (
//                   <div key={criteria.id} className="flex items-center text-sm">
//                     {criteria.passed ? (
//                       <Check className="w-4 h-4 text-green-500 mr-2" />
//                     ) : (
//                       <X className="w-4 h-4 text-gray-400 mr-2" />
//                     )}
//                     <span className={criteria.passed ? 'text-green-600' : 'text-gray-500'}>
//                       {criteria.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Confirm Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 placeholder="Confirm your new password"
//                 className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
//                   errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//             )}
//             {/* Password Match Indicator */}
//             {formData.confirmPassword && (
//               <div className="flex items-center mt-2">
//                 {formData.newPassword === formData.confirmPassword ? (
//                   <>
//                     <Check className="w-4 h-4 text-green-500 mr-2" />
//                     <span className="text-green-600 text-sm">Passwords match</span>
//                   </>
//                 ) : (
//                   <>
//                     <X className="w-4 h-4 text-red-500 mr-2" />
//                     <span className="text-red-500 text-sm">Passwords do not match</span>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading || !passwordStrength.isValid || formData.newPassword !== formData.confirmPassword}
//             className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Updating Password...
//               </div>
//             ) : (
//               'Update Password'
//             )}
//           </button>

//           {/* Back to Login */}
//           <div className="text-center">
//             <button 
//               type="button"
//               onClick={() => window.location.href = '/login'}
//               className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm transition-colors mx-auto"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PasswordResetPage;



import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Shield, ArrowLeft, CheckCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PasswordResetPage = ({ 
  token = 'demo-token-123', 
  mode = 'change', // 'reset' or 'change'
  onSuccess = null,
  onCancel = null 
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const isChangeMode = mode === 'change';

  // Password strength criteria
  const strengthCriteria = [
    { id: 'length', label: 'At least 8 characters', test: (password) => password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (password) => /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter', test: (password) => /[a-z]/.test(password) },
    { id: 'number', label: 'One number', test: (password) => /\d/.test(password) },
    { id: 'special', label: 'One special character', test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  // Validate token on component mount (only for reset mode)
  useEffect(() => {
    if (!isChangeMode) {
      const validateToken = async () => {
        // Simulate token validation
        if (!token || token === 'invalid-token') {
          setIsTokenValid(false);
        }
      };
      validateToken();
    }
  }, [token, isChangeMode]);

  // Calculate password strength
  useEffect(() => {
    const password = formData.newPassword;
    if (!password) {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
      return;
    }

    const passedCriteria = strengthCriteria.filter(criteria => criteria.test(password));
    const score = passedCriteria.length;
    
    let strength = 'Weak';
    let color = 'red';
    
    if (score >= 5) {
      strength = 'Very Strong';
      color = 'green';
    } else if (score >= 4) {
      strength = 'Strong';
      color = 'green';
    } else if (score >= 3) {
      strength = 'Good';
      color = 'yellow';
    } else if (score >= 2) {
      strength = 'Fair';
      color = 'orange';
    }

    setPasswordStrength({
      score,
      strength,
      color,
      feedback: strengthCriteria.map(criteria => ({
        ...criteria,
        passed: criteria.test(password)
      })),
      isValid: score >= 5
    });
  }, [formData.newPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate current password for change mode
    if (isChangeMode && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordStrength.isValid) {
      newErrors.newPassword = 'Password does not meet security requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Additional validation for change mode - new password shouldn't match current
    if (isChangeMode && formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isChangeMode) {
        // Simulate current password verification for change mode
        if (formData.currentPassword !== 'correct-password') {
          setErrors({ currentPassword: 'Current password is incorrect' });
          setIsLoading(false);
          return;
        }
      }
      
      // Simulate successful password update
      setResetSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (isChangeMode) {
      // Default behavior for change mode
      window.history.back();
    } else {
      // Default behavior for reset mode
      window.location.href = '/login';
    }
  };

  const getStrengthBarColor = () => {
    const colors = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500'
    };
    return colors[passwordStrength.color] || 'bg-gray-300';
  };

  const getStrengthBarWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  // Invalid token view (only for reset mode)
  if (!isChangeMode && !isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Success view
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
          <CheckCircle className="w-16 animate-bounce h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isChangeMode ? 'Password Changed Successfully!' : 'Password Reset Successful!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isChangeMode 
              ? 'Your password has been successfully updated.'
              : 'Your password has been successfully updated. You can now sign in with your new password.'
            }
          </p>
          <Button 
            onClick={() => {
              if (isChangeMode && onSuccess) {
                onSuccess();
              } else {
                window.location.href = '/login';
              }
            }}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
          >
            {isChangeMode ? 'Continue' : 'Continue to Login'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isChangeMode ? (
              <Key className="w-8 animate-bounce hover:rotate-360 hover:duration-1000  h-8 text-gray-600" />
            ) : (
              <Shield className="w-8 animate-pulse h-8 text-gray-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isChangeMode ? 'Change Password' : 'Create New Password'}
          </h1>
          <p className="text-gray-600">
            {isChangeMode 
              ? 'Update your account password' 
              : 'Choose a strong password for your account'
            }
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Password Form */}
        <div className="space-y-6">
          {/* Current Password Field - Only for change mode */}
          {isChangeMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                    errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                  errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength.color === 'green' ? 'text-green-600' :
                    passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                    passwordStrength.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
                    style={{ width: getStrengthBarWidth() }}
                  ></div>
                </div>
              </div>

              {/* Password Criteria */}
              <div className="space-y-2">
                {passwordStrength.feedback.map((criteria) => (
                  <div key={criteria.id} className="flex items-center text-sm">
                    {criteria.passed ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className={criteria.passed ? 'text-green-600' : 'text-gray-500'}>
                      {criteria.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center mt-2">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-600 text-sm">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-500 text-sm">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            size='small'
            onClick={handleSubmit}
            disabled={isLoading || !passwordStrength.isValid || formData.newPassword !== formData.confirmPassword || (isChangeMode && !formData.currentPassword)}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isChangeMode ? 'Changing Password...' : 'Updating Password...'}
              </div>
            ) : (
              isChangeMode ? 'Change Password' : 'Update Password'
            )}
          </Button>

          {/* Cancel/Back Button */}
          <div className="text-center">
            <Button 
              variant='outline'
              size='small'
              iconRight='true'
              onClick={handleCancel}
              icon={<ArrowLeft className="w-4 h-4 mr-2" />}
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm transition-colors mx-auto"
            >
              {isChangeMode ? 'Move Back' : 'Back to Login'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;