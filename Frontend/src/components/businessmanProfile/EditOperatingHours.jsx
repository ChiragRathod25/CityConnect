import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, AlertCircle, Save, Loader2 } from "lucide-react";
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

  useEffect(() => {
    setSelectedTime(props.value || "");
  }, [props.value]);

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

const BusinessHoursEditor = ({ onBack, businessId, databaseService }) => {
  const [businessHours, setBusinessHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Convert 12-hour format to 24-hour format (8:00 AM -> 08:00)
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    
    try {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");
      
      if (hours === "12") {
        hours = modifier === "AM" ? "00" : "12";
      } else {
        hours = modifier === "PM" ? String(parseInt(hours, 10) + 12) : hours;
      }
      
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    } catch (error) {
      console.error("Error converting time to 24-hour format:", error);
      return "";
    }
  };

  // Convert 24-hour format to 12-hour format (08:00 -> 8:00 AM)
  const convertTo12Hour = (time24h) => {
    if (!time24h) return "";
    
    try {
      const [hours, minutes] = time24h.split(":");
      const hour = parseInt(hours, 10);
      const modifier = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      
      return `${displayHour}:${minutes} ${modifier}`;
    } catch (error) {
      console.error("Error converting time to 12-hour format:", error);
      return "";
    }
  };

  const fetchBusinessHours = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await databaseService.getBusinessHours(businessId);
      console.log("Fetched business hours:", response.data);
      
      // Sort by day of week and convert times to 24-hour format
      const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const sortedHours = response.data
        .map(day => ({
          ...day,
          openTime: convertTo24Hour(day.openTime),
          closeTime: convertTo24Hour(day.closeTime)
        }))
        .sort((a, b) => {
          return daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek);
        });
      
      setBusinessHours(sortedHours);
    } catch (error) {
      console.error("Error fetching business hours:", error);
      setFetchError(error.message || "Failed to load business hours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessHours();
    }
  }, [businessId]);

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

  const validateAndSave = async () => {
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

    setSaving(true);
    setErrors({});

    try {
      // Update each business hour - convert times back to 12-hour format for backend
      const updatePromises = businessHours.map((day) => {
        return databaseService.updateBusinessHoursById(businessId,day._id, {
          dayOfWeek: day.dayOfWeek,
          openTime: day.isClosed ? "" : convertTo12Hour(day.openTime),
          closeTime: day.isClosed ? "" : convertTo12Hour(day.closeTime),
          isClosed: day.isClosed,
        });
      });

      await Promise.all(updatePromises);
      
      console.log("Business hours saved successfully");
      setSaved(true);

      // Reset saved message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving business hours:", error);
      setErrors({ general: error.message || "Failed to save business hours" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading business hours...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Hours</h3>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={fetchBusinessHours}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 px-4 pt-4 sm:p-6 lg:p-8">
      {onBack && (
      <div className="relative z-10 pb-4 sm:pb-0">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={onBack} />
            </div>
          </div>
        </div>
      </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="text-white" size={30} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Business Hours Editor
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Set your operating hours for each day
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm mb-6 bg-red-50 p-4 rounded-lg"
            >
              <AlertCircle size={16} />
              {errors.general}
            </motion.div>
          )}

          {/* Business Hours Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Clock size={20} className="text-gray-600" />
              Weekly Business Hours *
            </h4>

            <div className="space-y-3">
              {businessHours.map((day, index) => (
                <motion.div
                  key={day._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200"
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
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            onClick={validateAndSave}
            disabled={saving}
            className="w-full mt-6 bg-gradient-to-r from-gray-600 to-slate-600 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Business Hours
              </>
            )}
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