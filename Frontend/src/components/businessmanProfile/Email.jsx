import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/Button";
import databaseService from "@/services/database.services";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "@/slices/userSlice/authSlices";

const ContactEditPage = ({ type = "change-email" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEmail = type === "change-email";
  const user = useSelector((state) => state.auth?.userData?.user);

  // States
  const [currentContact] = useState(isEmail ? user?.email : user?.phoneNumber);
  const [newContact, setNewContact] = useState("");
  const [confirmContact, setConfirmContact] = useState("");
  const [step, setStep] = useState("edit"); // edit | verify | success
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Effects
  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    if (step === "verify" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
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

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""));

  // Step 1: Send Verification Code
  const handleContactSubmit = async () => {
    const newErrors = {};

    if (!newContact)
      newErrors.newContact = `New ${isEmail ? "email" : "phone number"
        } is required`;
    else if (isEmail && !validateEmail(newContact))
      newErrors.newContact = "Please enter a valid email";
    else if (!isEmail && !validatePhone(newContact))
      newErrors.newContact = "Please enter a valid phone number";

    if (!confirmContact)
      newErrors.confirmContact = `Please confirm your ${isEmail ? "email" : "phone number"
        }`;
    else if (newContact !== confirmContact)
      newErrors.confirmContact = `${isEmail ? "Emails" : "Phone numbers"
        } do not match`;

    if (newContact === currentContact)
      newErrors.newContact = `New ${isEmail ? "email" : "phone number"
        } must be different`;

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const { data } = await databaseService.createTempContactSession({
        userId: user._id,
        newContact,
        type: isEmail ? "email" : "phone",
      });
      setSessionId(data.sessionId);

      if (isEmail)
        await databaseService.sendEmailVerificationOTP({
          sessionId: data.sessionId,
        });
      else
        await databaseService.sendPhoneVerificationOTP({
          sessionId: data.sessionId,
        });

      setStep("verify");
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter complete OTP" });
      return;
    }

    setLoading(true);
    try {
      if (isEmail)
        await databaseService.verifyEmail({ sessionId, otp: otpValue });
      else await databaseService.verifyPhone({ sessionId, otp: otpValue });
      handleReduxStoreUpdate();

      setStep("success");
    } catch (error) {
      setErrors({ otp: "Invalid OTP. Please try again." });
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Redux Store after success
  const existingUser = useSelector((state) => state.auth?.userData?.user);
  const existingUserData = useSelector((state) => state.auth?.userData);
  const handleReduxStoreUpdate = () => {
    const updatedUser = { ...existingUser };
    if (isEmail) updatedUser.email = newContact;
    else updatedUser.phoneNumber = newContact;

    console.log("Updated user data:", updatedUser);

    const updatedUserData = { ...existingUserData, user: updatedUser };
    dispatch(updateUser(updatedUserData));
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setCanResend(false);
    setTimer(60);
    setOtp(Array(6).fill(""));
    setErrors({});
    try {
      if (isEmail)
        await databaseService.sendEmailVerificationOTP({ sessionId });
      else await databaseService.sendPhoneVerificationOTP({ sessionId });
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) setOtp([...pastedData.padEnd(6, "")]);
  };

  const ContactIcon = isEmail ? Mail : Phone;
  const contactType = isEmail ? "email" : "phone number";
  const ContactTypeCapital = isEmail ? "Email" : "Phone Number";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 pb-10 via-white to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header & Steps */}
        <div
          className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <div className="relative bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <ContactIcon className="w-6 h-6 animate-bounce text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">
                {step === "edit"
                  ? `Change ${ContactTypeCapital}`
                  : step === "verify"
                    ? `Verify ${ContactTypeCapital}`
                    : `${ContactTypeCapital} Updated`}
              </h1>
              <p className="text-sm">
                {step === "edit"
                  ? `Update your ${contactType}`
                  : step === "verify"
                    ? "Enter verification code"
                    : `${ContactTypeCapital} successfully updated`}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max">
              {["Edit", "Verify", "Complete"].map((label, idx) => {
                const active = ["edit", "verify", "success"][idx] === step;
                const completed =
                  idx < ["edit", "verify", "success"].indexOf(step);
                return (
                  <div key={idx} className="flex items-center space-x-1 sm:space-x-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 flex-shrink-0 ${completed || active
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      {completed ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm whitespace-nowrap ${active
                        ? "text-gray-600"
                        : completed
                          ? "text-green-600"
                          : "text-gray-500"
                        }`}
                    >
                      {label}
                    </span>
                    {idx < 2 && (
                      <div
                        className={`w-8 sm:w-12 h-1 rounded-full flex-shrink-0 ${completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {/* Step 1: Edit */}
          {step === "edit" && (
            <div className="space-y-6">
              <div className="text-center border-b border-gray-200 pb-4">
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg mb-3">
                  <ContactIcon className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">
                    Current {ContactTypeCapital}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 break-all">
                  {currentContact}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: `New ${ContactTypeCapital}`,
                    value: newContact,
                    setter: setNewContact,
                    error: errors.newContact,
                    placeholder: `Enter your new ${contactType}`,
                  },
                  {
                    label: `Confirm New ${ContactTypeCapital}`,
                    value: confirmContact,
                    setter: setConfirmContact,
                    error: errors.confirmContact,
                    placeholder: `Confirm your new ${contactType}`,
                  },
                ].map(({ label, value, setter, error, placeholder }, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type={isEmail ? "email" : "tel"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 text-sm transition-all duration-300 ${error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                        }`}
                    />
                    {error && (
                      <p className="mt-2 text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {error}
                      </p>
                    )}
                  </div>
                ))}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                      Security Notice
                    </h4>
                    <p className="text-sm text-yellow-700">
                      We'll send a verification code to your new {contactType}{" "}
                      to confirm the change.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleContactSubmit}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Verification Code</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === "verify" && (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3">
                <ContactIcon className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-600 mb-2">
                We've sent a 6-digit verification code{" "}
                {isEmail ? "to" : "via SMS to"}:
              </p>
              <p className="font-semibold text-gray-600 break-all">
                {newContact}
              </p>

              <div className="flex justify-center space-x-3 mt-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onPaste={handleOtpPaste}
                    className={`w-12 h-12 text-center text-lg font-bold rounded-xl border-2 focus:outline-none transition-all duration-300 ${errors.otp
                      ? "border-red-400 bg-red-50"
                      : digit
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white focus:border-gray-500"
                      }`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-red-600 mt-2 flex justify-center items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.otp}
                </p>
              )}

              <Button
                onClick={handleOtpSubmit}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl px-6 py-3"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />{" "}
                    <span>Verify {ContactTypeCapital}</span>
                  </>
                )}
              </Button>

              <div className="mt-4 text-sm flex flex-col items-center">
                <span className="flex items-center space-x-1 mb-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {timer > 0
                      ? `Resend code in ${timer}s`
                      : "You can resend now"}
                  </span>
                </span>
                <Button
                  onClick={handleResendOtp}
                  variant="outline"
                  size="small"
                  disabled={!canResend}
                  className="text-gray-600 text-sm"
                >
                  Resend Verification Code
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {" "}
                {ContactTypeCapital} Updated Successfully!{" "}
              </h3>
              <p className="text-gray-600">
                Your {contactType} has been changed and verified.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-medium text-sm">
                    New {ContactTypeCapital}
                  </p>
                  <p className="text-green-700 font-semibold break-all">
                    {newContact}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
              <Button
                onClick={() => navigate("/user-profile")}
                className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Back to profile
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translateY(0);
          }
          40%,
          43% {
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
