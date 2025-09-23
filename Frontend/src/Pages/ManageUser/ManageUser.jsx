import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Shield,
  AlertTriangle,
} from "lucide-react";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    username: "johndoe123",
    phone: "+1234567890",
    city: "New York",
    status: "active",
    isEmailVerified: true,
    isPhoneVerified: true,
    dob: "1990-05-15",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    username: "janesmith456",
    phone: "+1234567891",
    city: "Los Angeles",
    status: "suspended",
    isEmailVerified: true,
    isPhoneVerified: false,
    dob: "1988-08-22",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    username: "mikej789",
    phone: "+1234567892",
    city: "Chicago",
    status: "blocked",
    isEmailVerified: false,
    isPhoneVerified: true,
    dob: "1985-12-10",
    joinDate: "2023-03-10",
  },
  ...Array.from({ length: 47 }, (_, i) => ({
    id: i + 4,
    name: `User ${i + 4}`,
    email: `user${i + 4}@email.com`,
    username: `user${i + 4}`,
    phone: `+123456789${i + 4}`,
    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][i % 5],
    status: ["active", "suspended", "blocked"][i % 3],
    isEmailVerified: Math.random() > 0.5,
    isPhoneVerified: Math.random() > 0.5,
    dob: `198${5 + (i % 5)}-0${1 + (i % 9)}-${10 + (i % 20)}`,
    joinDate: "2023-04-01",
  })),
];

// SearchInput Component
const SearchInput = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSuggestionClick,
}) => (
  <div className="relative flex-1 max-w-2xl">
    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
    <input
      type="text"
      placeholder="Search users by name, email, or username..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      className="w-full pl-14 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 placeholder-gray-400 font-medium transition-all duration-300 shadow-lg"
    />
    {searchTerm && (
      <button
        onClick={() => {
          setSearchTerm("");
          setShowSuggestions(false);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}

    {showSuggestions && suggestions.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50"
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{suggestion}</span>
            </div>
          </button>
        ))}
      </motion.div>
    )}
  </div>
);

// FilterDropdown Component
const FilterDropdown = ({ value, setValue, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption =
    options.find((opt) => opt.value === value) || options[0];
  const CurrentIcon = currentOption?.icon || Filter;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 font-medium text-gray-700 transition-all duration-300 shadow-lg min-w-[180px]"
      >
        <CurrentIcon className="w-5 h-5" />
        <span>{currentOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ml-auto ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    value === option.value
                      ? "bg-gray-50 text-gray-700"
                      : "text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-gray-500 rounded-full ml-auto"></div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pagination Component (responsive for mobile)
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInputPage(page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputPage(value);

    const pageNum = parseInt(value);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden font-medium">Previous</span>
        </div>
      </motion.button>

      {/* Page Input */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-auto justify-center">
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          Page
        </span>
        <input
          type="text"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={() => {
            const pageNum = parseInt(inputPage);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
              setInputPage(currentPage.toString());
            }
          }}
          className="w-16 sm:w-20 text-center border-2 border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-lg font-semibold sm:font-bold text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/20 shadow-inner"
        />
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="sm:hidden font-medium">Next</span>
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </motion.button>
    </div>
  );
};

// StatusBadge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: "text-green-700",
      bg: "bg-green-100",
      icon: CheckCircle,
      text: "Active",
    },
    suspended: {
      color: "text-yellow-700",
      bg: "bg-yellow-100",
      icon: AlertTriangle,
      text: "Suspended",
    },
    blocked: {
      color: "text-red-700",
      bg: "bg-red-100",
      icon: Ban,
      text: "Blocked",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

// StatusActionDropdown Component (fixed z-index)
const StatusActionDropdown = ({ user, onStatusChange, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = [
    {
      value: "active",
      label: "Activate",
      icon: CheckCircle,
      color: "text-green-600 hover:bg-green-50",
    },
    {
      value: "suspended",
      label: "Suspend",
      icon: AlertTriangle,
      color: "text-yellow-600 hover:bg-yellow-50",
    },
    {
      value: "blocked",
      label: "Block",
      icon: Ban,
      color: "text-red-600 hover:bg-red-50",
    },
  ];

  const availableOptions = statusOptions.filter(
    (option) => option.value !== user.status
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getCurrentStatusConfig = () => {
    return statusOptions.find((option) => option.value === user.status);
  };

  const currentConfig = getCurrentStatusConfig();

  // Animation variants for different screen sizes
  const getAnimationProps = () => {
    if (isMobile) {
      return {
        initial: { opacity: 0, y: 10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.95 },
      };
    } else {
      return {
        initial: { opacity: 0, y: -10, scale: 1 },
        animate: { opacity: 1, y: -150, x: -10, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 },
      };
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-50" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md justify-center relative z-30 ${
            isMobile ? "w-full" : "min-w-[140px]"
          }`}
        >
          <currentConfig.icon className="w-4 h-4" />
          <span className="hidden lg:inline">Manage</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...getAnimationProps()}
              transition={{ duration: 0.15 }}
              className={`absolute bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                isMobile
                  ? "fixed bottom-4 left-4 right-4 mx-auto max-w-sm"
                  : "top-full right-0 mt-2 min-w-[160px]"
              }`}
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Options */}
              <div className={isMobile ? "p-2" : ""}>
                {availableOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{
                        backgroundColor:
                          option.value === "active"
                            ? "#f0f9ff"
                            : option.value === "suspended"
                            ? "#fffbeb"
                            : "#fef2f2",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onStatusChange(user.id, option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 transition-colors ${
                        isMobile
                          ? "px-4 py-4 rounded-xl mb-1 last:mb-0"
                          : "px-4 py-3 border-b border-gray-100 last:border-b-0"
                      } ${option.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="text-left">
                        <span className="font-medium block">
                          {option.label}
                        </span>
                        {isMobile && (
                          <span className="text-xs text-gray-500">
                            {option.value === "active"}
                            {option.value === "suspended"}
                            {option.value === "blocked"}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// UserDetailsModal Component (fully responsive with inline verified badges)
const UserDetailsModal = ({ user, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh]  overflow-hidden border border-gray-200"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-1 sm:p-2 rounded-full hover:bg-gray-600"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-250px)] sm:max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Full Name
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {user.name}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Email
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-1 min-w-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      user.isEmailVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isEmailVerified ? "✓ Verified" : "✗ Not Verified"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Phone
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-1 min-w-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                    <span>{user.phone}</span>
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      user.isPhoneVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isPhoneVerified ? "✓ Verified" : "✗ Not Verified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Username
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  @{user.username}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  City
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {user.city}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Date of Birth
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {new Date(user.dob).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Status
                </label>
                <div className="mt-2">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-5 bg-blue-50 rounded-xl shadow-sm">
            <label className="text-xs sm:text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Account Information
            </label>
            <p className="text-xs sm:text-sm text-blue-600">
              Member since: {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Component
export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const usersPerPage = 10;

  // Sort options
  const sortOptions = [
    { value: "name", label: "Sort by Name", icon: User },
    { value: "city", label: "Sort by City", icon: MapPin },
    { value: "blocked", label: "Blocked Users", icon: Ban },
  ];

  // Filter and sort users
  const filteredUsers = mockUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (sortBy === "blocked") return user.status === "blocked";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "city") return a.city.localeCompare(b.city);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Search suggestions
  const suggestions =
    searchTerm.length > 0
      ? [
          ...new Set(
            mockUsers
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, 5)
              .map((user) => user.name)
          ),
        ]
      : [];

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleEmailClick = (email) => {
    window.open(`https://mail.google.com/mail/?view=cm&to=${email}`, "_blank");
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUserAction = (userId, action) => {
    console.log(`${action} user:`, userId);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl shadow-lg">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              User Management
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Manage and monitor user accounts with advanced controls
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-10 flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto"
        >
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />

          <FilterDropdown
            value={sortBy}
            setValue={setSortBy}
            options={sortOptions}
            className="w-full sm:w-auto"
          />
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-800 rounded-xl shadow-lg">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {mockUsers.length}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Total Users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-700 rounded-xl shadow-lg">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {mockUsers.filter((u) => u.status === "active").length}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Active Users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-600 rounded-xl shadow-lg">
                <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {mockUsers.filter((u) => u.status === "suspended").length}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Suspended
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-500 rounded-xl shadow-lg">
                <Ban className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {mockUsers.filter((u) => u.status === "blocked").length}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Blocked Users
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-5 text-left font-semibold text-lg border-r border-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left font-semibold text-lg border-r border-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left font-semibold text-lg border-r border-gray-600">
                    City
                  </th>
                  <th className="px-6 py-5 text-left font-semibold text-lg border-r border-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-5 text-center font-semibold text-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 relative"
                  >
                    <td className="px-6 py-5 border-r border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-lg">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-medium border-r border-gray-100">
                      {user.email}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-medium border-r border-gray-100">
                      {user.city}
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-5 relative">
                      <div className="flex items-center justify-center gap-3 relative ">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(user)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">View</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEmailClick(user.email)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="hidden lg:inline">Email</span>
                        </motion.button>

                        <StatusActionDropdown
                          user={user}
                          onStatusChange={handleUserAction}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4 sm:p-6">
            {currentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">
                      @{user.username}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate mb-1">
                      {user.email}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {user.city}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(user)}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-all duration-200 font-medium shadow-sm text-xs sm:text-sm"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>View</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEmailClick(user.email)}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-200 font-medium shadow-sm text-xs sm:text-sm"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Email</span>
                  </motion.button>

                  <StatusActionDropdown
                    user={user}
                    onStatusChange={handleUserAction}
                    isMobile={true}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {currentUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find the users
                you're looking for.
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && (
          <UserDetailsModal
            user={selectedUser}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
