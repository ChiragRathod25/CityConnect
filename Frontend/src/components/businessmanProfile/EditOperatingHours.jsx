import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, AlertCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MoveBackButton from "../ui/MoveBackButton";

const TimeSelect = ({ label, icon: Icon, error, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(props.value || "");
  const dropdownRef = useRef(null);

  // Generate time options every 30 minutes
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = new Date(
        `2000-01-01T${timeValue}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: timeValue, label: displayTime });
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (timeOption) => {
    setSelectedTime(timeOption.value);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({ target: { value: timeOption.value } });
    }
  };

  const selectedOption = timeOptions.find((opt) => opt.value === selectedTime);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 text-left flex items-center justify-between text-sm sm:text-base ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption?.label || "Select time"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto"
            >
              {timeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{
                    backgroundColor: "#f3f4f6",
                    x: 8,
                  }}
                  className="w-full text-left px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(option)}
                >
                  <span className="group-hover:font-semibold transition-all">
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  );
};

const BusinessHoursEditor = ({ onBack }) => {
  const [businessHours, setBusinessHours] = useState([
    {
      dayOfWeek: "Monday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Tuesday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Wednesday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Thursday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Friday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Saturday",
      openTime: "10:00",
      closeTime: "16:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Sunday",
      openTime: "10:00",
      closeTime: "16:00",
      isClosed: false,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleBusinessHourChange = (index, field, value) => {
    const newHours = [...businessHours];
    newHours[index][field] = value;

    // Clear time values when marking as closed
    if (field === "isClosed" && value) {
      newHours[index].openTime = "";
      newHours[index].closeTime = "";
    }

    setBusinessHours(newHours);

    // Clear errors for this day
    const newErrors = { ...errors };
    delete newErrors[`businessHours_${index}`];
    setErrors(newErrors);
    setSaved(false);
  };

  const validateAndSave = () => {
    const newErrors = {};
    let hasError = false;

    businessHours.forEach((day, index) => {
      if (!day.isClosed) {
        if (!day.openTime || !day.closeTime) {
          newErrors[`businessHours_${index}`] = "Both times required";
          hasError = true;
        } else if (day.openTime >= day.closeTime) {
          newErrors[`businessHours_${index}`] = "Invalid time range";
          hasError = true;
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Save logic here
    console.log("Saving business hours:", businessHours);
    setErrors({});
    setSaved(true);

    // Reset saved message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 px-4 pt-4 sm:p-6 lg:p-8">
      <div className="relative z-10 pb-4">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={onBack} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="text-white animate-bounce" size={30} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Business Hours Editor
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Set your operating hours for each day
            </p>
          </div>

          {/* Business Hours Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border border-black-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Clock size={20} className="text-gray-600" />
              Weekly Business Hours *
            </h4>

            {errors.businessHours && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-red-500 text-xs mb-4 bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle size={12} />
                {errors.businessHours}
              </motion.div>
            )}

            <div className="space-y-3">
              {businessHours.map((day, index) => (
                <motion.div
                  key={day.dayOfWeek}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-3 sm:p-4 border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                      {day.dayOfWeek}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.isClosed}
                        onChange={(e) =>
                          handleBusinessHourChange(
                            index,
                            "isClosed",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Closed
                      </span>
                    </label>
                  </div>

                  {!day.isClosed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TimeSelect
                        label="Opening Time"
                        icon={Clock}
                        value={day.openTime}
                        onChange={(e) =>
                          handleBusinessHourChange(
                            index,
                            "openTime",
                            e.target.value
                          )
                        }
                        error={errors[`businessHours_${index}`]}
                      />
                      <TimeSelect
                        label="Closing Time"
                        icon={Clock}
                        value={day.closeTime}
                        onChange={(e) =>
                          handleBusinessHourChange(
                            index,
                            "closeTime",
                            e.target.value
                          )
                        }
                        error={errors[`businessHours_${index}`]}
                      />
                    </div>
                  )}

                  {day.isClosed && (
                    <p className="text-xs sm:text-sm text-gray-500 text-center py-2">
                      Marked as closed
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={validateAndSave}
            className="w-full mt-6 bg-gradient-to-r from-gray-600 to-slate-600 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save size={20} />
            Save Business Hours
          </motion.button>

          {/* Success Message */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm sm:text-base font-medium"
              >
                ✓ Business hours saved successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessHoursEditor;

// import React, { useState } from "react";
// import {
//   Clock,
//   AlertCircle,
//   CheckCircle2,
//   ArrowLeft,
//   ChevronDown,
// } from "lucide-react";
// import MoveBackButton from "../ui/MoveBackButton";

// const ModernDropdown = ({
//   value,
//   options,
//   onChange,
//   placeholder,
//   className = "",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className={`relative ${className}`}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full h-12 px-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between text-sm font-medium hover:border-gray-400 focus:border-gray-800 focus:outline-none transition-colors"
//       >
//         <span className="text-gray-800">{value || placeholder}</span>
//         <ChevronDown
//           size={16}
//           className={`text-gray-400 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {isOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute bottom-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
//             {options.map((option) => (
//               <button
//                 key={option.value}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
//                   value === option.value
//                     ? "bg-gray-100 text-gray-900 font-medium"
//                     : "text-gray-700"
//                 }`}
//               >
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const TimeSelect = ({ label, icon: Icon, value, onTimeChange, error }) => {
//   const [showPicker, setShowPicker] = useState(false);
//   const [hours, setHours] = useState("12");
//   const [minutes, setMinutes] = useState("00");
//   const [period, setPeriod] = useState("AM");

//   // Convert 24h to 12h format for display
//   React.useEffect(() => {
//     if (value) {
//       const [h, m] = value.split(":");
//       const hour24 = parseInt(h);
//       const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//       const ampm = hour24 >= 12 ? "PM" : "AM";

//       setHours(hour12.toString());
//       setMinutes(m);
//       setPeriod(ampm);
//     }
//   }, [value]);

//   const handleTimeChange = (newHours, newMinutes, newPeriod) => {
//     const hour24 =
//       newPeriod === "AM"
//         ? newHours === "12"
//           ? "00"
//           : newHours.padStart(2, "0")
//         : newHours === "12"
//         ? "12"
//         : (parseInt(newHours) + 12).toString();

//     const time24 = `${hour24}:${newMinutes}`;
//     onTimeChange(time24);
//   };

//   const formatDisplayTime = () => {
//     if (!value) return "Select Time";
//     const [h, m] = value.split(":");
//     const hour24 = parseInt(h);
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//     const ampm = hour24 >= 12 ? "PM" : "AM";
//     return `${hour12}:${m} ${ampm}`;
//   };

//   const hourOptions = Array.from({ length: 12 }, (_, i) => ({
//     value: (i + 1).toString(),
//     label: (i + 1).toString(),
//   }));

//   const minuteOptions = Array.from({ length: 12 }, (_, i) => ({
//     value: (i * 5).toString().padStart(2, "0"),
//     label: (i * 5).toString().padStart(2, "0"),
//   }));

//   const periodOptions = [
//     { value: "AM", label: "AM" },
//     { value: "PM", label: "PM" },
//   ];

//   return (
//     <div className="space-y-2 relative">
//       <label className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600">
//         <Icon size={14} className="text-gray-400" />
//         {label}
//       </label>

//       <button
//         type="button"
//         onClick={() => setShowPicker(!showPicker)}
//         className={`w-full p-4 sm:p-3 rounded-lg border-2 transition-all duration-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-20 flex items-center justify-center gap-2 ${
//           error
//             ? "border-red-400 bg-red-50"
//             : "border-gray-200 hover:border-gray-300 focus:border-gray-800 bg-white"
//         }`}
//       >
//         <span className="text-base sm:text-sm font-medium">
//           {formatDisplayTime()}
//         </span>
//         <ChevronDown
//           size={16}
//           className={`text-gray-400 transition-transform ${
//             showPicker ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {showPicker && (
//         <>
//           <div
//             className="fixed inset-0 z-40"
//             onClick={() => setShowPicker(false)}
//           />
//           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-500 mb-2">Hour</label>
//                 <ModernDropdown
//                   value={hours}
//                   options={hourOptions}
//                   onChange={(newHours) => {
//                     setHours(newHours);
//                     handleTimeChange(newHours, minutes, period);
//                   }}
//                   placeholder="12"
//                   className="w-16"
//                 />
//               </div>

//               <div className="text-xl font-bold text-gray-400 mt-6">:</div>

//               <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-500 mb-2">Min</label>
//                 <ModernDropdown
//                   value={minutes}
//                   options={minuteOptions}
//                   onChange={(newMinutes) => {
//                     setMinutes(newMinutes);
//                     handleTimeChange(hours, newMinutes, period);
//                   }}
//                   placeholder="00"
//                   className="w-16"
//                 />
//               </div>

//               <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-500 mb-2">Period</label>
//                 <ModernDropdown
//                   value={period}
//                   options={periodOptions}
//                   onChange={(newPeriod) => {
//                     setPeriod(newPeriod);
//                     handleTimeChange(hours, minutes, newPeriod);
//                   }}
//                   placeholder="AM"
//                   className="w-16"
//                 />
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => setShowPicker(false)}
//               className="w-full py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
//             >
//               Done
//             </button>
//           </div>
//         </>
//       )}

//       {error && (
//         <div className="flex items-center justify-center gap-1 text-xs text-red-500">
//           <AlertCircle size={12} />
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// const EditOperatingHours = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     operatingType: "",
//     openingTime: "09:00",
//     closingTime: "17:00",
//   });

//   const [errors, setErrors] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const formatTime = (time24) => {
//     if (!time24) return "";
//     const [h, m] = time24.split(":");
//     const hour24 = parseInt(h);
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//     const ampm = hour24 >= 12 ? "PM" : "AM";
//     return `${hour12}:${m} ${ampm}`;
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }

//     // Hide success message when making changes
//     if (showSuccess) {
//       setShowSuccess(false);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.operatingType) {
//       newErrors.operatingType = "Please select an operating type";
//     }

//     if (formData.operatingType === "manual") {
//       if (!formData.openingTime) {
//         newErrors.openingTime = "Opening time is required";
//       }
//       if (!formData.closingTime) {
//         newErrors.closingTime = "Closing time is required";
//       }
//       if (
//         formData.openingTime &&
//         formData.closingTime &&
//         formData.openingTime >= formData.closingTime
//       ) {
//         newErrors.closingTime = "Closing time must be after opening time";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate API call
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       setShowSuccess(true);

//       // Hide success message after 3 seconds
//       setTimeout(() => {
//         setShowSuccess(false);
//       }, 3000);
//     } catch (error) {
//       console.error("Error saving operating hours:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       operatingType: "",
//       openingTime: "09:00",
//       closingTime: "17:00",
//     });
//     setErrors({});
//     setShowSuccess(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 px-3 flex items-center justify-center">
//       <div className="w-full max-w-2xl">
//         <div className="relative z-10 py-4">
//           <div className="relative">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between h-16">
//                 <MoveBackButton onClick={onBack} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           {/* Card Header */}
//           <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8 text-center relative">

//             <div className="flex justify-center mb-3">
//               <div className="p-3 bg-white/10 rounded-full">
//                 <Clock size={28} className="text-white" />
//               </div>
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
//               Edit Operating Hours
//             </h2>
//             <p className="text-sm text-gray-200">
//               Update your business operating hours and schedule
//             </p>
//           </div>

//           {/* Card Content */}
//           <div className="px-4 py-6 sm:p-8">
//             {/* Success Message */}
//             {showSuccess && (
//               <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
//                 <div className="flex items-center justify-center gap-3 text-center">
//                   <CheckCircle2
//                     size={20}
//                     className="text-green-600 flex-shrink-0"
//                   />
//                   <div>
//                     <h4 className="text-sm font-semibold text-green-800">
//                       Operating hours updated successfully!
//                     </h4>
//                     <p className="text-xs text-green-700 mt-1">
//                       Your changes have been saved and are now active.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-6">
//               {/* Operating Hours Selection */}
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
//                     <Clock size={16} className="text-gray-400" />
//                     Operating Hours
//                   </label>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <button
//                     type="button"
//                     onClick={() => handleInputChange("operatingType", "24/7")}
//                     className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-center hover:scale-[1.02] active:scale-[0.98] ${
//                       formData.operatingType === "24/7"
//                         ? "border-black bg-gray-800 text-white shadow-lg"
//                         : "border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="text-base sm:text-lg font-semibold">
//                       24/7
//                     </div>
//                     <div className="text-xs sm:text-sm opacity-75 mt-1">
//                       Always Open
//                     </div>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => handleInputChange("operatingType", "manual")}
//                     className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-center hover:scale-[1.02] active:scale-[0.98] ${
//                       formData.operatingType === "manual"
//                         ? "border-black bg-gray-800 text-white shadow-lg"
//                         : "border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="text-base sm:text-lg font-semibold">
//                       Custom Hours
//                     </div>
//                     <div className="text-xs sm:text-sm opacity-75 mt-1">
//                       Set Specific Times
//                     </div>
//                   </button>
//                 </div>

//                 {errors.operatingType && (
//                   <div className="flex items-center justify-center gap-1 text-xs text-red-500">
//                     <AlertCircle size={12} />
//                     {errors.operatingType}
//                   </div>
//                 )}
//               </div>

//               {/* Manual Time Selection */}
//               {formData.operatingType === "manual" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-gray-100">
//                   <TimeSelect
//                     label="Opening Time"
//                     icon={Clock}
//                     value={formData.openingTime}
//                     onTimeChange={(time) =>
//                       handleInputChange("openingTime", time)
//                     }
//                     error={errors.openingTime}
//                   />
//                   <TimeSelect
//                     label="Closing Time"
//                     icon={Clock}
//                     value={formData.closingTime}
//                     onTimeChange={(time) =>
//                       handleInputChange("closingTime", time)
//                     }
//                     error={errors.closingTime}
//                   />
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
//                 <button
//                   onClick={handleSave}
//                   disabled={isLoading}
//                   className="flex-1 sm:flex-initial sm:px-8 py-3.5 bg-gray-800 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-gray-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 size={20} />
//                       Save Changes
//                     </>
//                   )}
//                 </button>

//                 <button
//                   onClick={handleReset}
//                   disabled={isLoading}
//                   className="flex-1 sm:flex-initial sm:px-8 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Reset
//                 </button>
//               </div>

//               {/* Current Status Display */}
//               {formData.operatingType && (
//                 <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2">
//                     Current Settings Preview:
//                   </h4>
//                   <div className="text-sm text-gray-600">
//                     {formData.operatingType === "24/7" ? (
//                       <span className="inline-flex items-center gap-2 font-medium text-green-600">
//                         <CheckCircle2 size={16} />
//                         Open 24/7 - Always Available
//                       </span>
//                     ) : (
//                       <span className="font-medium">
//                         Daily Hours: {formatTime(formData.openingTime)} -{" "}
//                         {formatTime(formData.closingTime)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditOperatingHours;
