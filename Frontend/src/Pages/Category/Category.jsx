import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Zap,
  Award,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Tag,
  Wrench,
  ShirtIcon,
  Hammer,
  BookOpen,
  Utensils,
  Sprout,
  Gift,
  ChevronDown,
  X,
  Heart,
  Bookmark,
  ChevronLeftIcon,
  ChevronRightIcon,
  Navigation,
  Fullscreen,
} from "lucide-react";

// Color palette from the image
const COLOR_PALETTE = {
  lightBg: "#f8fafc",
  darkText: "#1f2937",
  black: "#000000",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  blue50: "#eff6ff",
  blue100: "#dbeafe",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  emerald50: "#ecfdf5",
  emerald100: "#d1fae5",
  emerald500: "#10b981",
  emerald600: "#059669",
  emerald700: "#047857",
  amber50: "#fffbeb",
  amber100: "#fef3c7",
  amber500: "#f59e0b",
  amber600: "#d97706",
  amber700: "#b45309",
  rose50: "#fff1f2",
  rose100: "#ffe4e6",
  rose500: "#f43f5e",
  rose600: "#e11d48",
  rose700: "#be123c",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  lime50: "#f7fee7",
  lime100: "#ecfccb",
  lime500: "#84cc16",
  lime600: "#65a30d",
  lime700: "#4d7c0f",
  purple50: "#faf5ff",
  purple100: "#f3e8ff",
  purple500: "#a855f7",
  purple600: "#9333ea",
  purple700: "#7e22ce",
  teal50: "#f0fdfa",
  teal100: "#ccfbf1",
  teal500: "#14b8a6",
  teal600: "#0d9488",
  teal700: "#0f766e",
  cyan50: "#ecfeff",
  cyan100: "#cffafe",
  cyan500: "#06b6d4",
  cyan600: "#0891b2",
  cyan700: "#0e7490",
  orange50: "#fff7ed",
  orange100: "#ffedd5",
  orange500: "#f97316",
  orange600: "#ea580c",
  orange700: "#c2410c",
  red50: "#fef2f2",
  red100: "#fee2e2",
  red500: "#ef4444",
  red600: "#dc2626",
  red700: "#b91c1c",
  indigo50: "#eef2ff",
  indigo100: "#e0e7ff",
  indigo500: "#6366f1",
  indigo600: "#4f46e5",
  indigo700: "#4338ca",
  steelBlue: "rgba(70, 130, 180, 0.5)",
};

const CATEGORIES_DATA = [
  {
    id: 1,
    name: "Plumber",
    type: "service",
    icon: Wrench,
    description: "Professional plumbing services for your home",
    badge: "Popular",
    views: 1890,
    rating: 4.8,
    color: COLOR_PALETTE.gray700,
    subcategories: [
      {
        id: 101,
        name: "Emergency Plumbing",
        description: "24/7 urgent repairs",
        distance: 0.5,
        location: "Sayajigunj",
        image:
          "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop",
        rating: 4.9,
        views: 1245,
        operatingHours: "24/7",
        serviceType: "Emergency",
      },
      {
        id: 102,
        name: "Pipe Installation",
        description: "New pipe fitting services",
        distance: 1.2,
        location: "Alkapuri",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        rating: 4.7,
        views: 890,
        operatingHours: "9:00 AM - 6:00 PM",
        serviceType: "Installation",
      },
      {
        id: 103,
        name: "Drain Cleaning",
        description: "Blocked drain solutions",
        distance: 0.8,
        location: "Fatehgunj",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        rating: 4.6,
        views: 756,
        operatingHours: "8:00 AM - 8:00 PM",
        serviceType: "Cleaning",
      },
      {
        id: 104,
        name: "Water Heater Repair",
        description: "Geyser maintenance & repair",
        distance: 2.1,
        location: "Manjalpur",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
        rating: 4.8,
        views: 634,
        operatingHours: "10:00 AM - 7:00 PM",
        serviceType: "Repair",
      },
    ],
  },
  {
    id: 2,
    name: "Cobbler",
    type: "service",
    icon: ShirtIcon,
    description: "Expert shoe repair and leather services",
    badge: null,
    views: 456,
    rating: 4.3,
    color: COLOR_PALETTE.gray800,
    subcategories: [
      {
        id: 201,
        name: "Shoe Repair",
        description: "Fix worn out shoes",
        distance: 0.3,
        location: "RC Dutt Road",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
        rating: 4.4,
        views: 234,
        operatingHours: "9:00 AM - 7:00 PM",
        serviceType: "Repair",
      },
      {
        id: 202,
        name: "Leather Polishing",
        description: "Professional shoe shine",
        distance: 1.5,
        location: "Karelibaug",
        image:
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop",
        rating: 4.2,
        views: 189,
        operatingHours: "10:00 AM - 6:00 PM",
        serviceType: "Polishing",
      },
      {
        id: 203,
        name: "Sole Replacement",
        description: "Replace old soles",
        distance: 0.9,
        location: "Gotri",
        image:
          "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop",
        rating: 4.5,
        views: 167,
        operatingHours: "8:30 AM - 5:30 PM",
        serviceType: "Replacement",
      },
    ],
  },
  {
    id: 3,
    name: "Blacksmith",
    type: "service",
    icon: Hammer,
    description: "Traditional metalwork and forging services",
    badge: "Trending",
    views: 324,
    rating: 4.5,
    color: COLOR_PALETTE.gray900,
    subcategories: [
      {
        id: 301,
        name: "Tool Making",
        description: "Custom tool forging",
        distance: 1.8,
        location: "Waghodia Road",
        image:
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
        rating: 4.6,
        views: 198,
        operatingHours: "8:00 AM - 6:00 PM",
        serviceType: "Forging",
      },
      {
        id: 302,
        name: "Gate Repair",
        description: "Metal gate services",
        distance: 0.7,
        location: "Nizampura",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        rating: 4.4,
        views: 145,
        operatingHours: "9:00 AM - 5:00 PM",
        serviceType: "Repair",
      },
      {
        id: 303,
        name: "Key Making",
        description: "Duplicate keys & locks",
        distance: 1.1,
        location: "Subhanpura",
        image:
          "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop",
        rating: 4.7,
        views: 210,
        operatingHours: "10:00 AM - 8:00 PM",
        serviceType: "Key Making",
      },
    ],
  },
  {
    id: 4,
    name: "Bookstore",
    type: "product",
    icon: BookOpen,
    description: "Wide collection of books and stationery",
    badge: "New",
    views: 1245,
    rating: 4.7,
    color: COLOR_PALETTE.gray600,
    subcategories: [
      {
        id: 401,
        name: "Academic Books",
        description: "Educational textbooks",
        distance: 0.6,
        location: "University Road",
        image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        rating: 4.8,
        views: 890,
        operatingHours: "9:00 AM - 9:00 PM",
        productType: "Academic",
      },
      {
        id: 402,
        name: "Fiction & Novels",
        description: "Stories and literature",
        distance: 2.3,
        location: "Productivity Road",
        image:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        rating: 4.6,
        views: 765,
        operatingHours: "10:00 AM - 8:00 PM",
        productType: "Fiction",
      },
      {
        id: 403,
        name: "Stationery",
        description: "Pens, notebooks & supplies",
        distance: 0.4,
        location: "Sayajigunj",
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        rating: 4.5,
        views: 654,
        operatingHours: "8:00 AM - 10:00 PM",
        productType: "Stationery",
      },
      {
        id: 404,
        name: "Children's Books",
        description: "Books for kids",
        distance: 1.6,
        location: "Sama",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        rating: 4.9,
        views: 432,
        operatingHours: "9:30 AM - 7:30 PM",
        productType: "Children",
      },
    ],
  },
  {
    id: 5,
    name: "Restaurant",
    type: "product",
    icon: Utensils,
    description: "Delicious food and dining experiences",
    badge: "Popular",
    views: 3456,
    rating: 4.6,
    color: COLOR_PALETTE.gray700,
    subcategories: [
      {
        id: 501,
        name: "Veg Restaurant",
        description: "Pure vegetarian cuisine",
        distance: 0.2,
        location: "Alkapuri",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        rating: 4.8,
        views: 2340,
        operatingHours: "11:00 AM - 11:00 PM",
        restaurantType: "Vegetarian",
        cuisine: "Indian",
      },
      {
        id: 502,
        name: "Non-Veg Restaurant",
        description: "Meat and seafood dishes",
        distance: 1.4,
        location: "Fatehgunj",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        rating: 4.7,
        views: 1980,
        operatingHours: "12:00 PM - 12:00 AM",
        restaurantType: "Non-Vegetarian",
        cuisine: "Multi-cuisine",
      },
      {
        id: 503,
        name: "Fast Food",
        description: "Quick bites and snacks",
        distance: 0.8,
        location: "Sayajigunj",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        rating: 4.4,
        views: 1560,
        operatingHours: "10:00 AM - 10:00 PM",
        restaurantType: "Fast Food",
        cuisine: "International",
      },
      {
        id: 504,
        name: "Bakery & Cafe",
        description: "Fresh baked goods & coffee",
        distance: 1.0,
        location: "RC Dutt Road",
        image:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
        rating: 4.6,
        views: 1230,
        operatingHours: "8:00 AM - 10:00 PM",
        restaurantType: "Cafe",
        cuisine: "Continental",
      },
      {
        id: 505,
        name: "Street Food",
        description: "Local street delicacies",
        distance: 0.5,
        location: "Mandvi",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
        rating: 4.5,
        views: 2100,
        operatingHours: "6:00 PM - 11:00 PM",
        restaurantType: "Street Food",
        cuisine: "Local",
      },
      {
        id: 506,
        name: "Fine Dining",
        description: "Premium restaurant experience",
        distance: 2.5,
        location: "VIP Road",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        rating: 4.9,
        views: 890,
        operatingHours: "7:00 PM - 11:30 PM",
        restaurantType: "Fine Dining",
        cuisine: "International",
      },
    ],
  },
  {
    id: 6,
    name: "Mali (Gardener)",
    type: "service",
    icon: Sprout,
    description: "Professional gardening and landscaping",
    badge: "Top Rated",
    views: 876,
    rating: 4.9,
    color: COLOR_PALETTE.gray800,
    subcategories: [
      {
        id: 601,
        name: "Garden Maintenance",
        description: "Regular garden care",
        distance: 1.3,
        location: "Gotri",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
        rating: 4.9,
        views: 540,
        operatingHours: "7:00 AM - 6:00 PM",
        serviceType: "Maintenance",
      },
      {
        id: 602,
        name: "Plant Installation",
        description: "New plant setup",
        distance: 0.9,
        location: "Manjalpur",
        image:
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
        rating: 4.8,
        views: 390,
        operatingHours: "8:00 AM - 5:00 PM",
        serviceType: "Installation",
      },
      {
        id: 603,
        name: "Lawn Care",
        description: "Grass cutting & maintenance",
        distance: 1.7,
        location: "New VIP Road",
        image:
          "https://images.unsplash.com/photo-1558904541-efa843a96239?w=400&h=300&fit=crop",
        rating: 4.7,
        views: 320,
        operatingHours: "6:30 AM - 7:00 PM",
        serviceType: "Lawn Care",
      },
      {
        id: 604,
        name: "Landscaping",
        description: "Garden design services",
        distance: 2.0,
        location: "Vasna",
        image:
          "https://images.unsplash.com/photo-1558904541-efa843a96239?w=400&h=300&fit=crop",
        rating: 4.8,
        views: 280,
        operatingHours: "8:00 AM - 6:00 PM",
        serviceType: "Landscaping",
      },
    ],
  },
];

const Badge = ({ type }) => {
  const badgeStyles = {
    New: `bg-gradient-to-r from-${COLOR_PALETTE.emerald500} to-${COLOR_PALETTE.teal500} text-white`,
    Trending: `bg-gradient-to-r from-${COLOR_PALETTE.orange500} to-${COLOR_PALETTE.red500} text-white`,
    Popular: `bg-gradient-to-r from-${COLOR_PALETTE.blue500} to-${COLOR_PALETTE.cyan500} text-white`,
    "Top Rated": `bg-gradient-to-r from-${COLOR_PALETTE.purple500} to-${COLOR_PALETTE.pink500} text-white`,
  };
  const badgeIcons = {
    New: Zap,
    Trending: TrendingUp,
    Popular: Users,
    "Top Rated": Award,
  };
  const IconComponent = badgeIcons[type];
  return (
    <motion.div
      className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeStyles[type]} shadow-xl backdrop-blur-sm z-10`}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
    >
      <IconComponent className="w-3 h-3" />
      {type}
    </motion.div>
  );
};


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

// Filter Dropdown Component with outside click handling
const FilterDropdown = ({ filterType, setFilterType, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { value: "all", label: "All Badges", icon: Filter },
    { value: "popular", label: "Popular", icon: Users },
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "new", label: "New", icon: Zap },
    { value: "top-rated", label: "Top Rated", icon: Award },
  ];

  const currentFilter = filterOptions.find((opt) => opt.value === filterType);
  const CurrentIcon = currentFilter?.icon || Filter;

  // Close dropdown when clicking outside
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
        <span>{currentFilter?.label}</span>
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
            {filterOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterType(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    filterType === option.value
                      ? "bg-gray-50 text-gray-700"
                      : "text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {filterType === option.value && (
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

// Pagination Component
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
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

const HoverEffectCard = ({ category, onClick, className = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const IconComponent = category.icon;
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };
  
  return (
    <motion.div
      className={`relative group block p-1 h-full w-full ${className}`}
      onMouseEnter={() => setHoveredIndex(0)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => onClick(category)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Modern glassmorphism card with blue accent */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100/50"></div>
        
        {/* Subtle blue accent overlay */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: "radial-gradient(circle at top right, rgba(70, 130, 180, 0.3), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        
        {/* Hover overlay */}
        <AnimatePresence>
          {hoveredIndex === 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white/90 backdrop-blur-lg rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Card content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Header section */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon with blue accent styling */}
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Gradient background for icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
              <IconComponent className="w-8 h-8 text-white relative z-10" />
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                initial={{ x: -100 }}
                whileHover={{ x: 100 }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Type badge with consistent styling */}
            <motion.div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-sm ${
                category.type === "service"
                  ? "bg-blue-100/80 text-blue-800 border-blue-200/50"
                  : "bg-gray-100/80 text-gray-800 border-gray-200/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tracking-wide uppercase">
                {category.type === "service" ? "Service" : "Product"}
              </span>
            </motion.div>
          </div>
          
          {/* Badge if exists - Consistent with product tag */}
          {category.badge && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className={`inline-block px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-sm ${
                  category.badge === "popular" 
                    ? "bg-blue-100/80 text-blue-800 border-blue-200/50"
                    : "bg-gray-100/80 text-gray-800 border-gray-200/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tracking-wide uppercase">
                  {category.badge === "popular" ? "Popular" : category.badge}
                </span>
              </motion.div>
            </motion.div>
          )}
          
          {/* Title and description */}
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-900 transition-colors tracking-tight"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {category.name}
            </motion.h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
              {category.description}
            </p>
          </div>
          
          {/* Stats section */}
          <div className="flex items-center justify-between pt-4 border-t border-blue-100/50">
            <div className="flex items-center gap-3">
              {/* Rating */}
              <motion.div 
                className="flex items-center gap-1.5 bg-blue-50/60 px-2.5 py-1 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4 text-blue-600 fill-current" />
                <span className="text-sm font-semibold text-gray-800">
                  {category.rating}
                </span>
              </motion.div>
              {/* Views */}
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {category.views.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Options count */}
            {category.subcategories && (
              <motion.div 
                className="bg-blue-50/60 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.subcategories.length} options
              </motion.div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <motion.button
              onClick={handleFavorite}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                isFavorite
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50/60 text-blue-800 hover:bg-blue-100/60"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ 
                scale: 0.95,
                backgroundColor: isFavorite ? "#1d4ed8" : "#dbeafe"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: isFavorite ? [0, 15, -15, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </motion.div>
              <span className="font-medium">{isFavorite ? "Liked" : "Like"}</span>
            </motion.button>
            <motion.button
              onClick={handleSave}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                isSaved
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50/60 text-blue-800 hover:bg-blue-100/60"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ 
                scale: 0.95,
                backgroundColor: isSaved ? "#1d4ed8" : "#dbeafe"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: isSaved ? [0, 15, -15, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                />
              </motion.div>
              <span className="font-medium">{isSaved ? "Saved" : "Save"}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const parseOperatingHours = (hoursStr) => {
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

const isOpenNow = (hours) => {
  if (hours.is24h) return true;
  if (hours.open === null || hours.close === null) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Handle cases where closing time is after midnight
  if (hours.close < hours.open) {
    return currentMinutes >= hours.open || currentMinutes <= hours.close;
  }
  
  return currentMinutes >= hours.open && currentMinutes <= hours.close;
};

// Subcategory Card Component

const SubcategoryCard = ({ subcategory, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl cursor-pointer group border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(subcategory)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
    
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={subcategory.image}
          alt={subcategory.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold tracking-wide shadow-lg">
            {subcategory.serviceType ||
              subcategory.productType ||
              subcategory.restaurantType ||
              "Service"}
          </div>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            <span>{subcategory.rating}</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-bold text-gray-900 text-xl group-hover:text-blue-600 transition-colors duration-300 leading-tight tracking-tight">
            {subcategory.name}
          </h4>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium">
          {subcategory.description}
        </p>
        
        {/* Location and Distance */}
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Location</p>
              <p className="text-sm font-semibold text-gray-800">{subcategory.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Distance</p>
              <p className="text-sm font-semibold text-gray-800">{subcategory.distance} km</p>
            </div>
          </div>
        </div>
        
        {/* Timing and Likes */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-medium">{subcategory.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-gray-700 font-medium">{subcategory.likes || 0} likes</span>
          </div>
        </div>
        
        {/* Action buttons at bottom */}
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
          <motion.button
            onClick={handleFavorite}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isFavorite
                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isSaved
                ? "bg-blue-500 border-blue-500 text-white shadow-md"
                : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};


// Loading Skeleton
const CategorySkeleton = () => (
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

// Main Components
const CategoriesPage = ({ onCategoryClick }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categoryType, setCategoryType] = useState("all");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(CATEGORIES_DATA);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = new Set();

      categories.forEach((category) => {
        if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(category.name);
        }

        category.subcategories?.forEach((sub) => {
          if (sub.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            newSuggestions.add(sub.name);
          }
        });
      });

      setSuggestions(Array.from(newSuggestions).slice(0, 5));
      setShowSuggestions(newSuggestions.size > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchTerm, categories]);

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (categoryType !== "all") {
      filtered = filtered.filter((cat) => cat.type === categoryType);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query)
      );
    }

    switch (filterType) {
      case "popular":
        filtered = filtered.filter((cat) => cat.badge === "Popular");
        break;
      case "trending":
        filtered = filtered.filter((cat) => cat.badge === "Trending");
        break;
      case "new":
        filtered = filtered.filter((cat) => cat.badge === "New");
        break;
      case "top-rated":
        filtered = filtered.filter((cat) => cat.badge === "Top Rated");
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => b.views - a.views);
  }, [categories, searchTerm, filterType, categoryType]);

  const serviceCount = categories.filter(
    (cat) => cat.type === "service"
  ).length;
  const productCount = categories.filter(
    (cat) => cat.type === "product"
  ).length;

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };
  // Calculate categories to display
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = showAllCategories
    ? filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)
    : filteredCategories.slice(0, 3);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <div
      className="min-h-screen w-full relative bg-white"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Cool Gray Glow Top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top center,
              ${COLOR_PALETTE.steelBlue},
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ backgroundColor: COLOR_PALETTE.gray800 }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <Search className="w-10 animate-pulse h-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent leading-tight">
              Discover Services
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Find the best local services and products in your area
            </p>

            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: COLOR_PALETTE.gray800 }}
                >
                  {serviceCount}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Services
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: COLOR_PALETTE.gray900 }}
                >
                  {productCount}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Products
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-gray-200">
                {[
                  { key: "all", label: "All Categories", icon: Users },
                  { key: "service", label: "Services", icon: Wrench },
                  { key: "product", label: "Products", icon: Gift },
                ].map(({ key, label, icon: Icon }) => (
                  <motion.button
                    key={key}
                    onClick={() => setCategoryType(key)}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                      categoryType === key
                        ? "bg-white text-gray-900 shadow-lg border border-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />

              {/* Mobile Filter Select */}
              <div className="relative lg:hidden">
                <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-14 pr-10 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 appearance-none cursor-pointer min-w-[200px] font-medium text-gray-700 transition-all duration-300"
                >
                  <option value="all">All Badges</option>
                  <option value="popular">Popular</option>
                  <option value="trending">Trending</option>
                  <option value="new">New</option>
                  <option value="top-rated">Top Rated</option>
                </select>
              </div>

              {/* Desktop/Tablet Dropdown */}
              <FilterDropdown
                filterType={filterType}
                setFilterType={setFilterType}
                className="hidden lg:block"
              />
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchTerm || filterType !== "all" || categoryType !== "all" ? (
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Filtered Results ({filteredCategories.length})
              </span>
            ) : (
              `All Categories (${filteredCategories.length})`
            )}
          </motion.h2>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CategorySkeleton />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && (
            <AnimatePresence mode="wait">
              {currentCategories.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HoverEffectCard
                          category={category}
                          onClick={onCategoryClick}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* View All / Show Less Button */}
                  {!showAllCategories && filteredCategories.length > 3 && (
                    <motion.div
                      className="flex justify-center mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <button
                        onClick={() => setShowAllCategories(true)}
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All Categories
                      </button>
                    </motion.div>
                  )}

                  {showAllCategories && (
                    <motion.div
                      className="flex justify-center mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <button
                        onClick={() => setShowAllCategories(false)}
                        className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Show Less
                      </button>
                    </motion.div>
                  )}

                  {/* Pagination */}
                  {showAllCategories && totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No categories found
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or filter criteria
                  </p>
                  <motion.button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                      setCategoryType("all");
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};


import Confetti from 'react-confetti';

const FireworksBackground = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    // Set window dimensions
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Reset confetti every 2 seconds to create continuous effect
    const interval = setInterval(() => {
      setConfettiKey(prevKey => prevKey + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
      <Confetti
        key={confettiKey}
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={250}
        gravity={0.05}
        colors={['#FF5252', '#FFD740', '#7C4DFF', '#18FFFF', '#69F0AE', '#FF4081']}
        confettiSource={{
          x: windowDimension.width / 2,
          y: windowDimension.height / 3,
          w: 30,
          h: 20
        }}
      />
    </div>
  );
};




const SubcategoryPage = ({ category, onBack, onSubcategoryClick }) => {
   const [sortBy, setSortBy] = useState("distance");
  const [filterType, setFilterType] = useState("all");
  const [distanceOrder, setDistanceOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const subcategoriesPerPage = 6;
  const IconComponent = category.icon;

const sortedSubcategories = useMemo(() => {
  if (!category.subcategories) return [];
  let sorted = [...category.subcategories];
  
  // Apply type filter
  if (filterType !== "all") {
    sorted = sorted.filter((sub) => {
      if (category.name === "Restaurant") {
        return sub.restaurantType === filterType;
      } else if (category.type === "service") {
        return sub.serviceType === filterType;
      } else if (category.type === "product") {
        return sub.productType === filterType;
      }
      return true;
    });
  }
  
  // Apply search filter
  if (searchTerm.trim()) {
    const query = searchTerm.toLowerCase().trim();
    sorted = sorted.filter(
      (sub) =>
        sub.name.toLowerCase().includes(query) ||
        sub.description.toLowerCase().includes(query) ||
        sub.location.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  sorted.sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return distanceOrder === "asc"
          ? a.distance - b.distance
          : b.distance - a.distance;
      case "rating":
        return b.rating - a.rating;
      case "views":
        return b.views - a.views;
      case "name":
        return a.name.localeCompare(b.name);
      case "time": {
        const aHours = parseOperatingHours(a.operatingHours);
        const bHours = parseOperatingHours(b.operatingHours);
        const aOpen = isOpenNow(aHours);
        const bOpen = isOpenNow(bHours);
        
        // Both open or both closed - sort by closing time
        if (aOpen === bOpen) {
          // If both open, sort by closing time (soonest first)
          if (aOpen) {
            return aHours.close - bHours.close;
          }
          // If both closed, sort by opening time (soonest first)
          return aHours.open - bHours.open;
        }
        
        // One open, one closed - open comes first
        return aOpen ? -1 : 1;
      }
      default:
        return 0;
    }
  });
  
  return sorted;
}, [category.subcategories, sortBy, filterType, distanceOrder, searchTerm]);

  const getFilterOptions = () => {
    if (category.name === "Restaurant") {
      const types = [
        ...new Set(category.subcategories.map((sub) => sub.restaurantType)),
      ];
      return [
        { value: "all", label: "All Types" },
        ...types.map((type) => ({ value: type, label: type })),
      ];
    } else if (category.type === "service") {
      const types = [
        ...new Set(category.subcategories.map((sub) => sub.serviceType)),
      ];
      return [
        { value: "all", label: "All Services" },
        ...types.map((type) => ({ value: type, label: type })),
      ];
    } else if (category.type === "product") {
      const types = [
        ...new Set(category.subcategories.map((sub) => sub.productType)),
      ];
      return [
        { value: "all", label: "All Products" },
        ...types.map((type) => ({ value: type, label: type })),
      ];
    }
    return [{ value: "all", label: "All" }];
  };

  const filterOptions = getFilterOptions();

  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = new Set();
      category.subcategories?.forEach((sub) => {
        if (sub.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(sub.name);
        }
        if (sub.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(sub.description.substring(0, 30) + "...");
        }
      });
      setSuggestions(Array.from(newSuggestions).slice(0, 5));
      setShowSuggestions(newSuggestions.size > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchTerm, category.subcategories]);

   const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Calculate subcategories to display
  const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
  const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;
  const currentSubcategories = sortedSubcategories.slice(
    indexOfFirstSubcategory,
    indexOfLastSubcategory
  );
  const totalPages = Math.ceil(
    sortedSubcategories.length / subcategoriesPerPage
  );

  return (
    <div
      className="min-h-screen w-full relative bg-white"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Cool Gray Glow Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top left,
              ${COLOR_PALETTE.steelBlue},
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </motion.button>
          </motion.div>

          {/* Category Header */}

            
            <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center sm:mx-10 mb-8 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-100/50 relative overflow-hidden"
    >
      {/* Fireworks Background */}
      <FireworksBackground />
      
      {/* Content with higher z-index to appear above fireworks */}
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}
            style={{ backgroundColor: category.color }}
            whileHover={{ rotate: 360, scale: 1.3 }}
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 2, 
              repeatType: "reverse"
            }}
          >
            {/* Icon with glow effect */}
            <div className="absolute inset-0 bg-white opacity-20 blur-md"></div>
            <IconComponent className="w-8 h-8 text-white relative z-10" />
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"
        >
          {category.name}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-base max-w-xl mx-auto mb-6"
        >
          {category.description}
        </motion.p>
        
        <div className="flex justify-center gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center bg-gradient-to-br from-gray-50 to-white py-2 px-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="p-1 rounded-md bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: COLOR_PALETTE.gray800 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-bold" style={{ color: COLOR_PALETTE.gray800 }}>
                {sortedSubcategories.length}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Options</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center bg-gradient-to-br from-gray-50 to-white py-2 px-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="p-1 rounded-md bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: COLOR_PALETTE.gray900 }} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-xl font-bold" style={{ color: COLOR_PALETTE.gray900 }}>
                {category.rating}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Rating</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-gradient-to-br from-gray-50 to-white py-2 px-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="p-1 rounded-md bg-red-50">
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-red-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </motion.svg>
              </div>
              <div className="text-xl font-bold text-red-500">
                {category.likes || 0}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Likes</div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Explore
          </motion.button>
        </motion.div>
      </div>
    </motion.div>

          
          
          {/* <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl`}
                style={{ backgroundColor: category.color }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <IconComponent className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
              {category.name}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              {category.description}
            </p>

            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: COLOR_PALETTE.gray800 }}
                >
                  {sortedSubcategories.length}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Available Options
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: COLOR_PALETTE.gray900 }}
                >
                  {category.rating}
                </div>
                <div className="text-sm text-gray-500 font-medium">Rating</div>
              </div>
            </div>
          </motion.div> */}



           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </motion.div>
          {/* Filter and Sort Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >

            <div className="bg-white/80  backdrop-blur-md p-2 sm:p-1 rounded-2xl flex overflow-x-auto gap-2 sm:gap-1 border border-gray-200 scrollbar-hide">
              {filterOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setFilterType(option.value)}
                  className={`px-5 py-3 sm:px-4 sm:py-2 rounded-xl font-semibold transition-all duration-300 text-base sm:text-sm flex-shrink-0 ${
                    filterType === option.value
                      ? "bg-white text-gray-900 shadow-lg border border-gray-200"
                      : "text-gray-600 hover:text-gray-900 active:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          
            <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-gray-200 overflow-x-auto scrollbar-hide">
              {[
                { key: "distance", label: "Distance", icon: MapPin },
                { key: "rating", label: "Rating", icon: Star },
                { key: "views", label: "Views", icon: Users },
                { key: "time", label: "Time", icon: Clock },
                { key: "name", label: "Name", icon: Tag },
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 text-sm flex-shrink-0 ${
                    sortBy === key
                      ? "bg-white text-gray-900 shadow-lg border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Distance Order Toggle (only when sorting by distance) */}
            {sortBy === "distance" && (
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-gray-200">
                {[
                  { key: "asc", label: "Near First" },
                  { key: "desc", label: "Far First" },
                ].map((option) => (
                  <motion.button
                    key={option.key}
                    onClick={() => setDistanceOrder(option.key)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      distanceOrder === option.key
                        ? "bg-white text-gray-900 shadow-lg border border-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Subcategories Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {currentSubcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SubcategoryCard
                    subcategory={subcategory}
                    onClick={onSubcategoryClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          )}

          {/* Distance Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 rounded-2xl p-6 border"
            style={{
              backgroundColor: `${COLOR_PALETTE.gray100}70`,
              borderColor: COLOR_PALETTE.gray300,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLOR_PALETTE.gray700 }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Distance & Time Information
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Distances are calculated from your current location in Vadodara,
              Gujarat. The closest options are shown first to help you find the
              most convenient services. Operating hours are displayed to help
              you choose services that are currently available.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const CategoryApp = () => {
  const [currentPage, setCurrentPage] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage("subcategory");
  };

  const handleBackToCategories = () => {
    setCurrentPage("categories");
    setSelectedCategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log("Selected subcategory:", subcategory);
    // Here you would typically navigate to a detail page or perform some action
    alert(`You selected: ${subcategory.name} at ${subcategory.location}`);
  };

  return (
    <div className="font-inter antialiased">
      <AnimatePresence mode="wait">
        {currentPage === "categories" && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <CategoriesPage onCategoryClick={handleCategoryClick} />
          </motion.div>
        )}

        {currentPage === "subcategory" && selectedCategory && (
          <motion.div
            key="subcategory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <SubcategoryPage
              category={selectedCategory}
              onBack={handleBackToCategories}
              onSubcategoryClick={handleSubcategoryClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryApp;
