// AdminBusinessmanManagement.realdata.jsx
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
  Briefcase,
  Package,
  ShoppingBag,
  Clock,
  
} from "lucide-react";

import MoveBackButton from "@/components/ui/MoveBackButton";
import { useNavigate } from "react-router-dom";
import databaseService from "@/services/database.services";


// --------------------
// Smaller reusable components (SearchInput, FilterDropdown, Pagination, Badges, Dropdowns)
// I kept these components almost exactly as you had them but updated a couple of props
// to accept the real backend fields.
// --------------------

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
      placeholder="Search businesses by name, owner or username..."
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => setInputPage(currentPage.toString()), [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
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

      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-auto justify-center">
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          Page
        </span>
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={() => {
            const pageNum = parseInt(inputPage);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
              setInputPage(currentPage.toString());
            } else {
              setInputPage(pageNum.toString());
            }
          }}
          className="w-16 sm:w-20 text-center border-2 border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-lg font-semibold sm:font-bold text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/20 shadow-inner"
        />
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          of {totalPages}
        </span>
      </div>

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

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: "text-green-700",
      bg: "bg-green-100",
      icon: CheckCircle,
      text: "Active",
    },
    pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-100",
      icon: AlertTriangle,
      text: "Pending",
    },
    approved: {
      color: "text-green-700",
      bg: "bg-green-100",
      icon: CheckCircle,
      text: "Approved",
    },
    rejected: {
      color: "text-red-700",
      bg: "bg-red-100",
      icon: Ban,
      text: "Rejected",
    },
    blocked: {
      color: "text-red-700",
      bg: "bg-red-100",
      icon: Ban,
      text: "Blocked",
    },
  };

  const config = statusConfig[status] || {
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: AlertTriangle,
    text: status,
  };
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

const TypeBadge = ({ type }) => {
  const typeConfig = {
    service: {
      color: "text-blue-700",
      bg: "bg-blue-100",
      icon: Briefcase,
      text: "Service",
    },
    product: {
      color: "text-purple-700",
      bg: "bg-purple-100",
      icon: Package,
      text: "Product",
    },
  };

  const config = typeConfig[type] || {
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: ShoppingBag,
    text: type || "Unknown",
  };
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

const StatusActionDropdown = ({
  business,
  onStatusChange,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  //  status: {
  //       type: String,
  //       enum: ["pending", "active", "suspended", "closed"],
  //       default: "pending",
  //       index: true,
  //   },

  // status options for businesses - you can adjust to match backend allowed actions
  const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 hover:bg-yellow-50",
  },
  {
    value: "active",
    label: "Activate",
    icon: CheckCircle,
    color: "text-green-600 hover:bg-green-50",
  },
  {
    value: "suspended",
    label: "Suspend",
    icon: Ban,
    color: "text-orange-600 hover:bg-orange-50",
  },
  {
    value: "closed",
    label: "Close",
    icon: X,
    color: "text-gray-600 hover:bg-gray-100",
  },
];


  const availableOptions = statusOptions.filter(
    (option) => option.value !== business.status
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentStatusConfig = () => {
    return statusOptions.find((option) => option.value === business.status) || {
      icon: AlertTriangle,
    };
  };

  const currentConfig = getCurrentStatusConfig();

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
            >
              <div className={isMobile ? "p-2" : ""}>
                {availableOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{
                        backgroundColor:
                          option.value === "approved"
                            ? "#f0f9ff"
                            : option.value === "rejected"
                            ? "#fff1f2"
                            : "#fef2f2",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onStatusChange(business._id, option.value);
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
                        <span className="font-medium block">{option.label}</span>
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

// BusinessmanDetailsModal - now maps ownerDetails, locationDetails, contactDetails, workingHoursDetails
const BusinessmanDetailsModal = ({ business, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen || !business) return null;

  // Helper getters to safely access arrays
  const owner = (business.ownerDetails && business.ownerDetails[0]) || null;
  const location =
    (business.locationDetails && business.locationDetails[0]) || null;
  const contact =
    (business.contactDetails && business.contactDetails[0]) || null;

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
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            Business Details
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
                  Business Name
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {business.name}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Description
                </label>
                <p className="text-sm text-gray-700">{business.description}</p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Contact Email
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-1 min-w-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">
                      {(contact && contact.email) ||
                        (owner && owner.email) ||
                        "—"}
                    </span>
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      business.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {business.isVerified ? "✓ Verified" : "✗ Not Verified"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Contact Phone
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-1 min-w-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                    <span>{(contact && contact.phone) || (owner && owner.phoneNumber) || "—"}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Owner
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {owner ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() : "—"}
                  <span className="text-sm text-gray-500 ml-2">@{owner?.username || "—"}</span>
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Type & Category
                </label>
                <div className="flex items-center gap-3">
                  <TypeBadge type={business.type} />
                  <span className="text-sm text-gray-600 font-medium">{business.category || "—"}</span>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Location
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {location ? location.address || `${location.city}, ${location.state}` : "—"}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Created At
                </label>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  {new Date(business.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-xl shadow-sm">
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                  Status
                </label>
                <div className="mt-2">
                  <StatusBadge status={business.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Working hours expanded */}
          {business.workingHoursDetails && business.workingHoursDetails.length > 0 && (
            <div className="mt-6 p-3 sm:p-4 md:p-5 bg-blue-50 rounded-xl shadow-sm">
              <label className="text-xs sm:text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                Working Hours
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {business.workingHoursDetails.map((w) => (
                  <div key={w._id} className="p-2 bg-white rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-700">{w.dayOfWeek}</div>
                    <div className="text-xs text-gray-500">{w.isClosed ? "Closed" : `${w.openTime} - ${w.closeTime}`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --------------------
// MAIN PAGE (uses real backend)
// --------------------
export default function AdminBusinessmanManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // name, city, service, product, pending, approved, rejected
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const businessmenPerPage = 10;

  // sort options (display labels only)
  const sortOptions = [
    { value: "name", label: "Sort by Name", icon: User },
    { value: "city", label: "Sort by City", icon: MapPin },
    { value: "service", label: "Service Based", icon: Briefcase },
    { value: "product", label: "Product Based", icon: Package },
    { value: "pending", label: "Pending", icon: AlertTriangle },
    { value: "approved", label: "Approved", icon: CheckCircle },
    { value: "rejected", label: "Rejected", icon: Ban },
  ];

  // Fetch businesses from backend
  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await databaseService.getAllBusinessesWithAllDetails(); 
      // Handle both res.data or direct array
      const arr = Array.isArray(res) ? res : res?.data ?? [];
      setBusinesses(arr);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      setError("Failed to load businesses.");
      alert("Failed to load businesses. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update status: optimistic local update + call backend
  const handleUpdateStatus = async (businessId, newStatus) => {
    // Optimistic update locally
    setBusinesses((prev) =>
      prev.map((b) => (b._id === businessId ? { ...b, status: newStatus } : b))
    );

    try {
      // call backend - adjust function name/path if different
      await databaseService.updateBusinessStatus(businessId, newStatus);
      // success - optionally refetch or trust optimistic update
      // fetchBusinesses(); // uncomment to force fresh data from server
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Reverting.");
      // revert (refetch)
      fetchBusinesses();
    }
  };

  const handleBackToProfile = () => {
    navigate("/admin");
  };

  // Filtering + searching based on backend fields
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filtered = businesses
    .filter((b) => {
      if (!normalizedSearch) return true;

      // candidate fields to search: business name (b.name), owner username, owner first/last, contact email
      const owner = (b.ownerDetails && b.ownerDetails[0]) || {};
      const contact = (b.contactDetails && b.contactDetails[0]) || {};

      const tokens = [
        b.name,
        b.type,
        b.category,
        owner.username,
        owner.firstName,
        owner.lastName,
        owner.email,
        contact.email,
        contact.phone,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());

      return tokens.some((t) => t.includes(normalizedSearch));
    })
    .filter((b) => {
      // filter by sortBy where sortBy represents a category
      if (sortBy === "service") return b.type === "service";
      if (sortBy === "product") return b.type === "product";
      if (["pending", "approved", "rejected", "blocked", "active"].includes(sortBy))
        return b.status === sortBy;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "city") {
        const cityA = (a.locationDetails && a.locationDetails[0]?.city) || "";
        const cityB = (b.locationDetails && b.locationDetails[0]?.city) || "";
        return cityA.localeCompare(cityB);
      }
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / businessmenPerPage));
  useEffect(() => {
    // keep page in range
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * businessmenPerPage;
  const currentBusinessmen = filtered.slice(
    startIndex,
    startIndex + businessmenPerPage
  );

  // Suggestions: show business names and owner names that match
  const suggestions =
    normalizedSearch.length > 0
      ? [
          ...new Set(
            businesses
              .filter((b) => {
                const owner = (b.ownerDetails && b.ownerDetails[0]) || {};
                const tokens = [
                  b.name,
                  owner.username,
                  owner.firstName,
                  owner.lastName,
                ]
                  .filter(Boolean)
                  .map((s) => String(s).toLowerCase());
                return tokens.some((t) => t.includes(normalizedSearch));
              })
              .slice(0, 8)
              .map((b) => {
                const owner = (b.ownerDetails && b.ownerDetails[0]) || {};
                return `${b.name}${owner.firstName ? ` — ${owner.firstName} ${owner.lastName || ""}` : ""}`.trim();
              })
          ),
        ]
      : [];

  const handleSuggestionClick = (s) => {
    setSearchTerm(s);
    setShowSuggestions(false);
  };

  const handleEmailClick = (email) => {
    if (!email) {
      alert("Email not available");
      return;
    }
    window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`, "_blank");
  };

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handleBusinessmanAction = (businessId, action) => {
    // action is status value
    if (!businessId || !action) return;
    // confirmation for destructive actions
    if (action === "rejected" || action === "blocked") {
      const ok = window.confirm(`Are you sure you want to ${action} this business?`);
      if (!ok) return;
    }
    handleUpdateStatus(businessId, action);
  };

  // Quick stats for cards
  const totalCount = businesses.length;
  const serviceCount = businesses.filter((b) => b.type === "service").length;
  const productCount = businesses.filter((b) => b.type === "product").length;
  const blockedCount = businesses.filter((b) => b.status === "blocked").length;

  return (
    <div className="min-h-screen py-5 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10">
        <div className="relative mb-5 sm:mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={handleBackToProfile} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl pb-5 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-3 w-16 h-16 bg-gray-800 rounded-2xl shadow-lg">
              <Briefcase className="w-10 animate-pulse h-10  text-gray-400" />
            </div>
            <h1 className="mt-4 text-2xl lg:text-4xl font-bold text-gray-800">
              Businesses Management
            </h1>
          </div>
          <p className="text-gray-600 text-md  lg:text-lg max-w-2xl mx-auto">
            Manage and monitor business accounts with advanced controls
          </p>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-800 rounded-xl shadow-lg">
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {loading ? "..." : totalCount}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-xl shadow-lg">
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {serviceCount}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Service
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-purple-600 rounded-xl shadow-lg">
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {productCount}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Product
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-500 rounded-xl shadow-lg">
                <Ban className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {blockedCount}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Blocked
                </p>
              </div>
            </div>
          </div> */}

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative"
        >
          {loading && (
            <div className="p-6 text-center text-gray-600">Loading businesses...</div>
          )}

          {!loading && (
            <>
              <div className="hidden md:block overflow-x-auto overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
                    <tr>
                      <th className="px-6  py-5 text-center font-semibold text-lg border-r border-gray-600">
                        Name
                      </th>
                      <th className="px-6 py-5 text-center font-semibold text-lg border-r border-gray-600">
                        Type
                      </th>
                      <th className="px-6 py-5 text-center font-semibold text-lg border-r border-gray-600">
                        City
                      </th>
                      <th className="px-6 py-5 text-center font-semibold text-lg border-r border-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-5 text-center font-semibold text-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBusinessmen.map((b, index) => {
                      const owner = (b.ownerDetails && b.ownerDetails[0]) || {};
                      const location = (b.locationDetails && b.locationDetails[0]) || {};
                      const contact = (b.contactDetails && b.contactDetails[0]) || {};
                      return (
                        <motion.tr
                          key={b._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 relative"
                        >
                          <td className="px-6 py-5 border-r border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">
                                  {(b.name || " ").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 text-lg">
                                  {b.name}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                  {owner.username || (contact.email ? contact.email.split("@")[0] : "")}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 border-r border-gray-100">
                            <TypeBadge type={b.type} />
                          </td>
                          <td className="px-6 py-5 text-gray-700 font-medium border-r border-gray-100">
                            {location.city || location.address || "—"}
                          </td>
                          <td className="px-6 py-5 border-r border-gray-100">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-6 py-5 relative">
                            <div className="flex items-center justify-center gap-3 relative">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewDetails(b)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden lg:inline">View</span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEmailClick((contact && contact.email) || owner.email)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                                <span className="hidden lg:inline">Email</span>
                              </motion.button>

                              <StatusActionDropdown
                                business={b}
                                onStatusChange={handleBusinessmanAction}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4 p-4 sm:p-6">
                {currentBusinessmen.map((b, index) => {
                  const owner = (b.ownerDetails && b.ownerDetails[0]) || {};
                  const location = (b.locationDetails && b.locationDetails[0]) || {};
                  const contact = (b.contactDetails && b.contactDetails[0]) || {};
                  return (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {(b.name || " ").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
                            {b.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">
                            {owner.username || (contact.email ? contact.email.split("@")[0] : "")}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate mb-1">
                            {location.city || location.address || "—"}
                          </p>
                          <TypeBadge type={b.type} />
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={b.status} />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 relative z-10">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewDetails(b)}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-all duration-200 font-medium shadow-sm text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>View</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEmailClick((contact && contact.email) || owner.email)}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-200 font-medium shadow-sm text-xs sm:text-sm"
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Email</span>
                        </motion.button>

                        <StatusActionDropdown
                          business={b}
                          onStatusChange={handleBusinessmanAction}
                          isMobile={true}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No businesses found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your search or filter criteria to find the businesses you're looking for.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <BusinessmanDetailsModal
            business={selectedBusiness}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
