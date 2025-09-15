import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

// SearchInput Component (unchanged)
export const SearchInput = ({
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
      placeholder="Search services and products..."
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

// Updated FilterDropdown Component
export const FilterDropdown = ({ value, setValue, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = options.find((opt) => opt.value === value || opt.key === value) || options[0];
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
              const optionValue = option.value || option.key;
              return (
                <button
                  key={optionValue}
                  onClick={() => {
                    setValue(optionValue);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    value === optionValue
                      ? "bg-gray-50 text-gray-700"
                      : "text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {value === optionValue && (
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

// Pagination Component (unchanged)
export const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        } transition-colors`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              currentPage === page
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-100 transition-colors"
            } ${page === "..." ? "cursor-default" : ""}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        } transition-colors`}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// CategorySkeleton (unchanged)
export const CategorySkeleton = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg animate-pulse border border-gray-200">
    <div className="flex justify-between mb-4">
      <div className="w-14 h-14 bg-gray-300 rounded-2xl"></div>
      <div className="w-20 h-6 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-6 bg-gray-300 rounded-lg mb-3 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
    </div>
  </div>
);

// Utility functions (unchanged)
export const parseOperatingHours = (hoursStr) => {
  if (hoursStr === "24/7") return { open: 0, close: 24 * 60, is24h: true };
  if (hoursStr === "By Appointment") return { open: null, close: null, is24h: false };
  
  try {
    const [openStr, closeStr] = hoursStr.split(" - ");
    return {
      open: parseTimeToMinutes(openStr.trim()),
      close: parseTimeToMinutes(closeStr.trim()),
      is24h: false
    };
  } catch (e) {
    console.error("Error parsing hours:", hoursStr, e);
    return { open: null, close: null, is24h: false };
  }
};

const parseTimeToMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+):?(\d*)\s*(AM|PM)?/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3] ? match[3].toUpperCase() : null;
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

export const isOpenNow = (hours) => {
  if (hours.is24h) return true;
  if (hours.open === null || hours.close === null) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  if (hours.close < hours.open) {
    return currentMinutes >= hours.open || currentMinutes <= hours.close;
  }
  
  return currentMinutes >= hours.open && currentMinutes <= hours.close;
};