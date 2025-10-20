import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Edit3,
  Save,
  X,
  Camera,
  Check,
  Sparkles,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import databaseService from "@/services/database.services";
import { updateUser } from "@/slices/userSlice/authSlices";

const Button = ({
  children,
  onClick,
  loading,
  variant = "primary",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#1f2937] text-white hover:bg-[#374151] active:scale-95",
    success: "bg-green-600 text-white hover:bg-green-700 active:scale-95",
    outline: "bg-transparent border-2 hover:bg-gray-50 active:scale-95",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
      {!loading && icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

// Enhanced Date Picker Component with Working Dropdowns
const DatePicker = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    }
  }, [value]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isFutureDate = (day) => {
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return dateToCheck > today;
  };

  const handleDateSelect = (day) => {
    if (isFutureDate(day)) return;

    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), monthIndex));
    setMonthDropdownOpen(false);
  };

  const handleYearSelect = (year) => {
    setCurrentMonth((prev) => new Date(year, prev.getMonth()));
    setYearDropdownOpen(false);
  };

  // Generate years range (1900 to current year only)
  const generateYears = () => {
    const years = [];
    for (let year = 1900; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // Show recent years first
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10"
        ></div>
      );
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      const isToday =
        today.toDateString() ===
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        ).toDateString();
      const isFuture = isFutureDate(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={isFuture}
          className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
            isFuture
              ? "text-gray-300 cursor-not-allowed"
              : isSelected
              ? "bg-[#1f2937] text-white shadow-lg"
              : isToday
              ? "bg-[#e5e7eb] text-[#1f2937] font-bold"
              : "text-[#374151] hover:bg-[#1f2937] hover:text-white hover:scale-105"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (disabled) {
    return (
      <div className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-[#f3f4f6] border-2 border-[#e5e7eb] rounded-xl sm:rounded-2xl text-[#9ca3af] font-medium cursor-not-allowed text-sm md:text-base">
        {selectedDate
          ? selectedDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Select date"}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-left bg-white/80 backdrop-blur-sm border-2 border-[#e2e8f0] rounded-xl sm:rounded-2xl font-medium text-[#1f2937] hover:border-[#1f2937] hover:shadow-lg transition-all duration-300 flex items-center justify-between group text-sm md:text-base"
      >
        <span className={selectedDate ? "text-[#1f2937]" : "text-[#9ca3af]"}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Select date"}
        </span>
        <ChevronDown
          className={`w-4 h-4 md:w-5 md:h-5 text-[#6b7280] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } group-hover:text-[#1f2937]`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border-2 border-[#e5e7eb] z-50 overflow-hidden backdrop-blur-xl">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Month/Year Header - Mobile Optimized */}
              <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1.5 sm:p-2 md:p-3 hover:bg-[#f3f4f6] rounded-lg md:rounded-xl transition-colors group"
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rotate-90 text-[#6b7280] group-hover:text-[#1f2937]" />
                </button>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Month Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMonthDropdownOpen(!monthDropdownOpen);
                        setYearDropdownOpen(false);
                      }}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-[#f8fafc] hover:bg-[#e5e7eb] border border-[#e5e7eb] rounded-lg md:rounded-xl text-xs sm:text-sm font-bold text-[#1f2937] transition-all duration-200 hover:shadow-md"
                    >
                      <span className="block sm:hidden">
                        {shortMonths[currentMonth.getMonth()]}
                      </span>
                      <span className="hidden sm:block">
                        {months[currentMonth.getMonth()]}
                      </span>
                      <ChevronDown
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-transform ${
                          monthDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {monthDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMonthDropdownOpen(false);
                          }}
                        />
                        <div className="absolute top-full left-0 mt-1 w-28 sm:w-32 md:w-40 max-h-40 sm:max-h-48 md:max-h-60 overflow-y-auto bg-white rounded-lg md:rounded-xl shadow-2xl border border-[#e5e7eb] z-40">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMonthSelect(index);
                              }}
                              className={`w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left hover:bg-[#f8fafc] transition-colors text-xs sm:text-sm font-medium ${
                                currentMonth.getMonth() === index
                                  ? "bg-[#1f2937] text-white hover:bg-[#374151]"
                                  : "text-[#1f2937]"
                              }`}
                            >
                              <span className="block sm:hidden">
                                {shortMonths[index]}
                              </span>
                              <span className="hidden sm:block">{month}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Year Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setYearDropdownOpen(!yearDropdownOpen);
                        setMonthDropdownOpen(false);
                      }}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-[#f8fafc] hover:bg-[#e5e7eb] border border-[#e5e7eb] rounded-lg md:rounded-xl text-xs sm:text-sm font-bold text-[#1f2937] transition-all duration-200 hover:shadow-md"
                    >
                      <span>{currentMonth.getFullYear()}</span>
                      <ChevronDown
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-transform ${
                          yearDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {yearDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setYearDropdownOpen(false);
                          }}
                        />
                        <div className="absolute top-full right-0 mt-1 w-18 sm:w-20 md:w-24 max-h-40 sm:max-h-48 md:max-h-60 overflow-y-auto bg-white rounded-lg md:rounded-xl shadow-2xl border border-[#e5e7eb] z-40">
                          {generateYears().map((year) => (
                            <button
                              key={year}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleYearSelect(year);
                              }}
                              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-center hover:bg-[#f8fafc] transition-colors text-xs sm:text-sm font-medium ${
                                currentMonth.getFullYear() === year
                                  ? "bg-[#1f2937] text-white hover:bg-[#374151]"
                                  : "text-[#1f2937]"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1.5 sm:p-2 md:p-3 hover:bg-[#f3f4f6] rounded-lg md:rounded-xl transition-colors group"
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 -rotate-90 text-[#6b7280] group-hover:text-[#1f2937]" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-[#6b7280] p-1 sm:p-2 uppercase"
                    >
                      <span className="block sm:hidden">{day[0]}</span>
                      <span className="hidden sm:block">{day}</span>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {renderCalendar()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const EditUserProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeField, setActiveField] = useState("");
  const dispatch = useDispatch();

  // const [profileData, setProfileData] = useState({
  //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  //   username: "alex_creative",
  //   email: "alex@creative.studio",
  //   phone: "+1 (555) 987-6543",
  //   dob: "1995-06-15",
  //   bio: "Digital artist & UX designer crafting beautiful experiences. Passionate about minimalist design, emerging technologies, and creating meaningful connections through design."
  // });
  const [profileData, setProfileData] = useState(
    useSelector((state) => state.auth.userData?.user)
  );
  const existingUserData= useSelector((state) => state.auth.userData);
  
  useEffect(() => {
    setEditedData({ ...profileData });
  }, [profileData]);

  const [editedData, setEditedData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
    setActiveField("");
  };

  const updateProfileAvatar = async (avatarFile) => {
    try {
      const response = await databaseService.updateUserAvatar(avatarFile);
      // response should contain Cloudinary URL
      return response.data.avatarUrl;
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      //2 phase - first check, if the avatar is updated then first update it

      if (editedData?.avatar !== profileData?.avatar) {
        try {
          const updatedAvatarUrl = await updateProfileAvatar(editedData?.avatar);
          editedData.avatar = updatedAvatarUrl; // now a Cloudinary URL
        } catch (error) {
          console.error("Error updating avatar:", error);
          setLoading(false);
          return;
        }
      }

      console.log("Begging to update other profile info");
      console.log("Cloudinary Avatar URL:", editedData?.avatar);
      //2nd phase - upadte other profile info
      const response = await databaseService.updateUserProfile(editedData);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      return;
    }
    setProfileData({ ...editedData });

    dispatch(updateUser({ ...existingUserData, user: { ...editedData } }));
    
    setLastUpdated(new Date()); // Update the last modified date
    setIsEditing(false);
    setLoading(false);
    setActiveField("");
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For preview
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange("avatarPreview", event.target.result); // for image preview
      };
      reader.readAsDataURL(file);

      // Store the actual file for uploading
      handleInputChange("avatar", file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#ffffff] to-[#f1f5f9] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#f3f4f6]/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#e5e7eb]/20 rounded-full blur-3xl animate-pulse-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-[#e2e8f0]/10 to-[#cbd5e1]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex  items-center justify-center p-2 sm:p-3 md:p-4 bg-white/70 backdrop-blur-xl rounded-full shadow-xl border-amber-450 border-2 mb-3 sm:mb-4 md:mb-6 hover:scale-105 transition-all duration-500 group">
            <div className="flex  items-center space-x-2 sm:space-x-3 md:space-x-5">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-r from-[#1f2937] to-[#374151] rounded-full group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-4 animate-bounce h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1f2937] tracking-tight">
                Profile Studio
              </h1>
            </div>
          </div>
          <p className="text-[#6b7280] text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-2">
            {isEditing
              ? "Edit your profile information"
              : "Manage your personal information"}
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-3xl border border-white/50 overflow-hidden hover:shadow-4xl transition-all duration-700 group">
          {/* Card Header with Avatar */}
          <div className="relative bg-gradient-to-br from-[#1f2937] via-[#374151] to-[#4b5563] p-4 sm:p-6 md:p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative flex flex-col items-center space-y-4 sm:space-y-6 md:flex-row md:space-y-0 md:space-x-6 lg:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl hover:scale-105 transition-all duration-500 group">
                  <img
                    src={
                      isEditing
                        ? editedData?.avatarPreview || profileData?.avatar
                        : profileData?.avatar
                    }
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  />
                </div>

                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-2 sm:p-3 md:p-4 bg-white text-[#1f2937] rounded-full cursor-pointer hover:bg-[#f8fafc] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                    />
                  </label>
                )}

                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 border-2 sm:border-4 border-white rounded-full shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>

              {/* Profile Header Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                  @{profileData?.username}
                </h2>
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2 sm:mb-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 font-medium text-sm sm:text-base">
                    Active now
                  </span>
                </div>

                {/* Edit Button */}
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 group text-sm sm:text-base"
                  >
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold">Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
             
              {/* Username Field */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#fef3c7] text-[#d97706]">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                   User Name
                  </h3>
                  <div className="flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#fef3c7] rounded-md sm:rounded-lg">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d97706]" />
                    <span className="text-xs font-bold text-[#d97706] uppercase">
                      Protected
                    </span>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border-2 border-[#fde68a] bg-[#fef3c7]/30">
                  <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium text-[#92400e]">
                    {profileData?.username}
                  </div>
                </div>
              </div>

              {/* Email Field - Protected */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#fef3c7] text-[#d97706]">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                    Email Address
                  </h3>
                  <div className="flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#fef3c7] rounded-md sm:rounded-lg">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d97706]" />
                    <span className="text-xs font-bold text-[#d97706] uppercase">
                      Protected
                    </span>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border-2 border-[#fde68a] bg-[#fef3c7]/30">
                  <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium text-[#92400e]">
                    {profileData?.email}
                  </div>
                </div>
              </div>

                {/* firstName Field */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div
                    className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                      activeField === "firstName" && isEditing
                        ? "bg-[#1f2937] text-white shadow-lg"
                        : "bg-[#f8fafc] text-[#6b7280]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                    First Name
                  </h3>
                </div>

                <div
                  className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                    activeField === "firstName" && isEditing
                      ? "border-[#1f2937] bg-white shadow-lg"
                      : "border-[#e2e8f0] bg-[#f8fafc]"
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      onFocus={() => setActiveField("firstName")}
                      onBlur={() => setActiveField("")}
                      className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-transparent border-none outline-none text-sm sm:text-base md:text-lg font-semibold text-[#1f2937] placeholder-[#9ca3af]"
                      placeholder="Enter first name..."
                    />
                  ) : (
                    <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-[#1f2937]">
                      {profileData?.firstName}
                    </div>
                  )}
                </div>
              </div>

                {/* lastName Field */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div
                    className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                      activeField === "lastName" && isEditing
                        ? "bg-[#1f2937] text-white shadow-lg"
                        : "bg-[#f8fafc] text-[#6b7280]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                    Last Name
                  </h3>
                </div>

                <div
                  className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                    activeField === "lastName" && isEditing
                      ? "border-[#1f2937] bg-white shadow-lg"
                      : "border-[#e2e8f0] bg-[#f8fafc]"
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      onFocus={() => setActiveField("lastName")}
                      onBlur={() => setActiveField("")}
                      className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-transparent border-none outline-none text-sm sm:text-base md:text-lg font-semibold text-[#1f2937] placeholder-[#9ca3af]"
                      placeholder="Enter last name..."
                    />
                  ) : (
                    <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-[#1f2937]">
                      {profileData?.lastName}
                    </div>
                  )}
                </div>
              </div>


              {/* Phone Field - Protected */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#fef3c7] text-[#d97706]">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                    Phone Number
                  </h3>
                  <div className="flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#fef3c7] rounded-md sm:rounded-lg">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d97706]" />
                    <span className="text-xs font-bold text-[#d97706] uppercase">
                      Protected
                    </span>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border-2 border-[#fde68a] bg-[#fef3c7]/30">
                  <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium text-[#92400e]">
                    {profileData?.phoneNumber}
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-3 sm:space-y-4 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div
                    className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                      activeField === "dob" && isEditing
                        ? "bg-[#1f2937] text-white shadow-lg"
                        : "bg-[#f8fafc] text-[#6b7280]"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">
                    Date of Birth
                  </h3>
                </div>

                <div
                  onFocus={() => setActiveField("dob")}
                  onBlur={() => setActiveField("")}
                >
                  {isEditing ? (
                    <DatePicker
                      value={editedData?.dob}
                      onChange={(value) => handleInputChange("dob", value)}
                    />
                  ) : (
                    <div className="rounded-xl sm:rounded-2xl border-2 border-[#e2e8f0] bg-[#f8fafc]">
                      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-[#1f2937]">
                        {new Date(profileData?.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section - Full Width */}
            {/* <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  activeField === 'bio' && isEditing
                    ? 'bg-[#1f2937] text-white shadow-lg' 
                    : 'bg-[#f8fafc] text-[#6b7280]'
                }`}>
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6b7280]">About Me</h3>
              </div>
              
              <div className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                activeField === 'bio' && isEditing
                  ? 'border-[#1f2937] bg-white shadow-lg' 
                  : 'border-[#e2e8f0] bg-[#f8fafc]'
              }`}>
                {isEditing ? (
                  <textarea
                    value={editedData?.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    onFocus={() => setActiveField('bio')}
                    onBlur={() => setActiveField('')}
                    rows={4}
                    className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-transparent border-none outline-none text-sm sm:text-base md:text-lg font-medium text-[#1f2937] placeholder-[#9ca3af] resize-none"
                    placeholder="Tell your story..."
                  />
                ) : (
                  <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium text-[#1f2937] leading-relaxed min-h-[80px] sm:min-h-[100px] md:min-h-[120px] flex items-center">
                    {profileData?.bio}
                  </div>
                )}
              </div>
            </div> */}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t-2 border-[#e5e7eb]">
                <Button
                  onClick={handleSave}
                  loading={loading}
                  variant="success"
                  icon={<Check className="w-4  h-4 sm:w-5 sm:h-5" />}
                  className="sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-3xl"
                >
                  {loading ? "Saving Changes..." : "Save Profile"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-xl sm:rounded-2xl md:rounded-3xl text-[#1f2937] hover:bg-[#f3f4f6] border-2 border-[#e5e7eb] hover:border-[#1f2937] shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  Cancel Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <div className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/60 backdrop-blur-xl rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[#6b7280] font-medium text-xs sm:text-sm md:text-base">
                Last updated:{" "}
                {lastUpdated.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rounded-4xl {
          border-radius: 2rem;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slow-reverse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1.1) rotate(0deg);
          }
          50% {
            opacity: 0.3;
            transform: scale(1) rotate(180deg);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 6s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .shadow-4xl {
          box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 640px) {
          .rounded-4xl {
            border-radius: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .rounded-4xl {
            border-radius: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditUserProfileInfo;
