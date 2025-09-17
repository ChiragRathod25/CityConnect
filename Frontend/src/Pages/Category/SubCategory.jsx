import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Star, Heart, Bookmark, ArrowLeft } from "lucide-react";
import {
  CATEGORIES_DATA,
  FILTER_OPTIONS,
  SORT_OPTIONS,
} from "../../constants/Category";
import {
  SearchInput,
  FilterDropdown,
  Pagination,
  CategorySkeleton,
  parseOperatingHours,
  isOpenNow,
  AnimatedBackground,
} from "./ReusableComponent";
import { Button } from "@/components/ui/Button";

// Utility to parse experience string to years
const parseExperienceToYears = (experience) => {
  if (!experience || typeof experience !== "string") return 0;
  const match = experience.match(/(\d+)/); // Extract first number
  return match ? parseInt(match[1], 10) : 0;
};

import { Share2, X } from "lucide-react";
import { SocialIcon } from "react-social-icons";

// Share Modal Component
const ShareModal = ({ isOpen, onClose, provider }) => {
  const shareUrl = `https://example.com/provider/${provider.name
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const shareText = `Check out ${provider.name} - ${provider.description}`;

  const socialPlatforms = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
      socialUrl: "https://whatsapp.com",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      socialUrl: "https://facebook.com",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com",
      socialUrl: "https://instagram.com",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      socialUrl: "https://telegram.org",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      socialUrl: "https://twitter.com",
    },
  ];

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleShare = (platform) => {
    if (platform.name === "Instagram") {
      navigator.clipboard.writeText(shareText + " " + shareUrl);
      alert("Link copied to clipboard! You can paste it in Instagram.");
    } else {
      window.open(platform.url, "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Share Provider
                </h3>
                <p className="text-sm text-gray-600">{provider.name}</p>
              </div>

              {/* Social platforms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialPlatforms.map((platform, index) => (
                  <motion.button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className="flex items-center gap-3 p-3 sm:p-3 rounded-xl border transition-all duration-200 w-full justify-start"
                    style={{
                      backgroundColor: "#f9fafb",
                      borderColor: "#e5e7eb",
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "#f3f4f6",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SocialIcon
                      url={platform.socialUrl}
                      style={{ height: 36, width: 36 }}
                    />
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      {platform.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Copy link option */}
              <motion.button
                onClick={handleCopyLink}
                className="w-full mt-4 p-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#f9fafb",
                  borderColor: "#e5e7eb",
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#f3f4f6",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center text-white">
                  🔗
                </div>
                <span className="font-semibold text-gray-700">Copy Link</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProviderCard = ({ provider, onClick, className = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(provider.liked || false);
  const [isSaved, setIsSaved] = useState(provider.saved || false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  // Operating hours logic - proper time-based checking
  const parseOperatingHours = (hours) => {
    if (!hours) return { open: 9, close: 18 }; // Default 9am-6pm

    // Parse "3am-9pm" format
    const match = hours.match(/(\d+)(am|pm)-(\d+)(am|pm)/i);
    if (match) {
      let openHour = parseInt(match[1]);
      let closeHour = parseInt(match[3]);

      // Convert to 24-hour format
      if (match[2].toLowerCase() === "pm" && openHour !== 12) openHour += 12;
      if (match[2].toLowerCase() === "am" && openHour === 12) openHour = 0;
      if (match[4].toLowerCase() === "pm" && closeHour !== 12) closeHour += 12;
      if (match[4].toLowerCase() === "am" && closeHour === 12) closeHour = 0;

      return { open: openHour, close: closeHour };
    }

    // Parse "9:00 AM - 6:00 PM" format
    const timeMatch = hours.match(
      /(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i
    );
    if (timeMatch) {
      let openHour = parseInt(timeMatch[1]);
      let closeHour = parseInt(timeMatch[4]);

      // Convert to 24-hour format
      if (timeMatch[3].toLowerCase() === "pm" && openHour !== 12)
        openHour += 12;
      if (timeMatch[3].toLowerCase() === "am" && openHour === 12) openHour = 0;
      if (timeMatch[6].toLowerCase() === "pm" && closeHour !== 12)
        closeHour += 12;
      if (timeMatch[6].toLowerCase() === "am" && closeHour === 12)
        closeHour = 0;

      return { open: openHour, close: closeHour };
    }

    return { open: 9, close: 18 }; // Default fallback
  };

  const isOpenNow = (operatingHours) => {
    const now = new Date();
    const currentHour = now.getHours();
    const { open, close } = parseOperatingHours(operatingHours);

    // Handle cases where closing time is next day (e.g., 11pm-3am)
    if (close < open) {
      return currentHour >= open || currentHour < close;
    }

    return currentHour >= open && currentHour < close;
  };

  const isOpen = isOpenNow(provider.operatingHours);

  const handleCardClick = () => {
    if (typeof onClick === "function") {
      onClick(provider);
    } else {
      // Dynamic routing - navigate to provider page
      const providerSlug = provider.name.toLowerCase().replace(/\s+/g, "-");
      window.location.href = `/provider/${providerSlug}`;
    }
  };

  return (
    <>
      <motion.div
        className={`relative group block p-3 h-full w-full max-w-sm mx-auto ${className}`}
        onMouseEnter={() => setHoveredIndex(0)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleCardClick}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-2xl shadow-md transition-all duration-300 border"
          style={{
            backgroundColor: "#f9fafb",
            borderColor: hoveredIndex === 0 ? "#9ca3af" : "#d1d5db",
            boxShadow:
              hoveredIndex === 0
                ? "0 8px 25px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(156, 163, 175, 0.4)"
                : "0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(209, 213, 219, 0.3)",
          }}
        >
          {/* Scrolling light effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: hoveredIndex === 0 ? "100%" : "-100%" }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: hoveredIndex === 0 ? Infinity : 0,
              repeatDelay: 1,
            }}
          />

          {/* Card content */}
          <div className="relative z-10 p-5 h-full flex flex-col">
            {/* Header section */}
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className="w-14 h-14 rounded-xl overflow-hidden shadow-md relative"
                style={{
                  backgroundColor: hoveredIndex === 0 ? "#111827" : "#1f2937",
                  transition: "background-color 0.3s ease",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {provider.image ? (
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border"
                style={{
                  backgroundColor: isOpen ? "#10b981" : "#6b7280",
                  color: "#ffffff",
                  borderColor: isOpen ? "#34d399" : "#9ca3af",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tracking-wide uppercase">
                  {isOpen ? "Open" : "Closed"}
                </span>
              </motion.div>
            </div>

            {/* Categories as badges */}
            {provider.categories && provider.categories.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {provider.categories.slice(0, 2).map((cat, index) => (
                    <motion.div
                      key={index}
                      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border"
                      style={{
                        backgroundColor: "#374151",
                        color: "#ffffff",
                        borderColor: "#9ca3af",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="tracking-wide uppercase">{cat}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Title and description */}
            <div className="flex-1">
              <motion.h3
                className="text-lg font-bold mb-2 leading-tight transition-colors tracking-tight"
                style={{
                  color: hoveredIndex === 0 ? "#111827" : "#1f2937",
                  transition: "color 0.3s ease",
                }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {provider.name}
              </motion.h3>
              <p
                className="text-sm leading-relaxed mb-3 line-clamp-2 font-medium"
                style={{ color: "#6b7280" }}
              >
                {provider.description}
              </p>
            </div>

            {/* Operating Hours */}
            {/* <div className="mb-3">
              <motion.div
                className="flex items-center gap-2 text-xs"
                style={{ color: '#6b7280' }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isOpen ? '#10b981' : '#6b7280' }}></span>
                <span className="font-medium">{provider.operatingHours}</span>
              </motion.div>
            </div> */}

            {/* Operating Hours */}
            <div className="mb-3">
              <motion.div
                className="flex w-fit items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                }}
                 whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <span
                  className="w-2 h-2 text-gray-700 rounded-full"
                  style={{ backgroundColor: isOpen ? "#10b981" : "#6b7280" }}
                ></span>
                <span className="font-semibold" style={{ color: isOpen ? "#065F46" : "#1F2A44" }}>{provider.operatingHours}</span>
              </motion.div>
            </div>

            {/* Stats section */}
            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{ borderColor: "#e2e8f0" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: "#f3f4f6" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#374151" }}
                  >
                    {provider.rating}
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  style={{ color: "#dc2626" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-xs sm:text-sm font-medium">
                    {provider.views > 1000
                      ? `${(provider.views / 1000).toFixed(1)}k`
                      : provider.views.toLocaleString()}
                  </span>
                </motion.div>
              </div>
              {provider.distance && (
                <motion.div
                  className="text-sm font-medium px-2 py-1 rounded-lg"
                  style={{
                    color: "#1F2A44",
                    backgroundColor: "#f3f4f6",
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {provider.distance} km
                </motion.div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <motion.button
                onClick={handleFavorite}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: isFavorite ? "#dc2626" : "#ffffff",
                  color: isFavorite ? "#ffffff" : "#374151",
                  borderColor: isFavorite ? "#dc2626" : "#e5e7eb",
                  boxShadow: isFavorite
                    ? "0 4px 12px rgba(220, 38, 38, 0.3)"
                    : "0 2px 8px rgba(220, 38, 38, 0.15)",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: isFavorite
                    ? "0 6px 20px rgba(220, 38, 38, 0.4)"
                    : "0 4px 16px rgba(220, 38, 38, 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={
                    isFavorite
                      ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 15, -15, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.6, type: "spring", stiffness: 400 }}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </motion.div>
                <span className="hidden sm:inline">
                  {isFavorite ? "Liked" : "Like"}
                </span>
              </motion.button>

              <motion.button
                onClick={handleSave}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: isSaved ? "#2563eb" : "#ffffff",
                  color: isSaved ? "#ffffff" : "#374151",
                  borderColor: isSaved ? "#2563eb" : "#e5e7eb",
                  boxShadow: isSaved
                    ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                    : "0 2px 8px rgba(37, 99, 235, 0.15)",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: isSaved
                    ? "0 6px 20px rgba(37, 99, 235, 0.4)"
                    : "0 4px 16px rgba(37, 99, 235, 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={
                    isSaved
                      ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5, type: "spring", stiffness: 500 }}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </motion.div>
                <span className="hidden sm:inline">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </motion.button>

              <motion.button
                onClick={handleShare}
                className="py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#374151",
                  borderColor: "#e5e7eb",
                  boxShadow: "0 2px 8px rgba(107, 114, 128, 0.15)",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 16px rgba(107, 114, 128, 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        provider={provider}
      />
    </>
  );
};

// Provider Card Component (updated for stunning modern look)
// const ProviderCard = ({ provider, onClick, className = "" }) => {
//   const [isFavorite, setIsFavorite] = useState(provider.liked);
//   const [isSaved, setIsSaved] = useState(provider.saved);

//   const handleFavorite = (e) => {
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };

//   const handleSave = (e) => {
//     e.stopPropagation();
//     setIsSaved(!isSaved);
//   };

//   const hours = parseOperatingHours(provider.operatingHours);
//   const isOpen = isOpenNow(hours);

//   return (
//     <motion.div
//       className={`relative group block p-2 h-full w-full ${className}`}
//       onClick={() => onClick(provider)}
//       whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
//       whileTap={{ scale: 0.98 }}
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, type: "spring", stiffness: 400 }}
//       style={{
//         perspective: 1000,
//         transformStyle: "preserve-3d",
//       }}
//     >
//       <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md border border-blue-200/30">
//         {/* Neumorphic background with vibrant gradient */}
//         <div
//           className="absolute inset-0 rounded-2xl"
//           style={{
//             background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(147,197,253,0.3))",
//             boxShadow: "6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)",
//           }}
//         />
//         {/* Hover glow effect */}
//         <motion.div
//           className="absolute inset-0 rounded-2xl"
//           initial={{ opacity: 0 }}
//           whileHover={{ opacity: 0.5 }}
//           transition={{ duration: 0.3 }}
//           style={{
//             background: "radial-gradient(circle at center, rgba(59,130,246,0.4), transparent 70%)",
//             filter: "blur(20px)",
//           }}
//         />

//         <div className="relative z-10 p-6 h-full flex flex-col">
//           {/* Header section */}
//           <div className="flex items-start justify-between mb-4">
//             <motion.div
//               className="w-16 h-16 rounded-xl overflow-hidden shadow-lg"
//               whileHover={{ scale: 1.1, rotate: 10 }}
//               transition={{ type: "spring", stiffness: 500 }}
//             >
//               <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
//             </motion.div>
//             <motion.div
//               className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-sm ${
//                 isOpen
//                   ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-300/50"
//                   : "bg-gradient-to-r from-gray-400 to-gray-600 text-white border-gray-300/50"
//               }`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {isOpen ? "Open" : "Closed"}
//             </motion.div>
//           </div>

//           {/* Title and description */}
//           <div className="flex-1">
//             <motion.h3
//               className="text-xl font-bold text-gray-900 mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors"
//               whileHover={{ x: 5 }}
//               transition={{ type: "spring", stiffness: 400 }}
//             >
//               {provider.name}
//             </motion.h3>
//             <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 font-medium">
//               {provider.description}
//             </p>
//             <div className="flex flex-wrap gap-2 mb-3">
//               {provider.categories.map((cat, index) => (
//                 <motion.span
//                   key={index}
//                   className="text-xs font-semibold bg-blue-100/50 text-blue-700 px-2 py-1 rounded-full border border-blue-200/50"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   {cat}
//                 </motion.span>
//               ))}
//             </div>
//           </div>

//           {/* Stats section */}
//           <div className="flex items-center justify-between pt-4 border-t border-blue-100/30">
//             <div className="flex items-center gap-3">
//               <motion.div
//                 className="flex items-center gap-1.5 bg-blue-100/50 px-2.5 py-1 rounded-lg"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                 <span className="text-sm font-semibold text-gray-800">
//                   {provider.rating}
//                 </span>
//               </motion.div>
//               <motion.div
//                 className="flex items-center gap-1 text-gray-600"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <Users className="w-4 h-4" />
//                 <span className="text-sm font-medium">
//                   {provider.views.toLocaleString()}
//                 </span>
//               </motion.div>
//             </div>
//             <motion.div
//               className="text-sm font-medium text-gray-600"
//               whileHover={{ scale: 1.05 }}
//             >
//               {provider.distance} km
//             </motion.div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-2 mt-4">
//             <motion.button
//               onClick={handleFavorite}
//               className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
//                 isFavorite
//                   ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
//                   : "bg-white/50 text-blue-700 border border-blue-200/50"
//               }`}
//               whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <motion.div
//                 animate={{ rotate: isFavorite ? [0, 15, -15, 0] : 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <Heart
//                   className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
//                 />
//               </motion.div>
//               <span>{isFavorite ? "Liked" : "Like"}</span>
//             </motion.button>
//             <motion.button
//               onClick={handleSave}
//               className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
//                 isSaved
//                   ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
//                   : "bg-white/50 text-blue-700 border border-blue-200/50"
//               }`}
//               whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <motion.div
//                 animate={{ rotate: isSaved ? [0, 15, -15, 0] : 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <Bookmark
//                   className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
//                 />
//               </motion.div>
//               <span>{isSaved ? "Saved" : "Save"}</span>
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// SubcategoryPage Component
const SubcategoryPage = ({ onProviderClick }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("distance");
  const [category, setCategory] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundCategory = CATEGORIES_DATA.find((cat) => cat.slug === slug);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        navigate("/");
      }
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [slug, navigate]);

  useEffect(() => {
    if (searchTerm.length > 0 && category) {
      const newSuggestions = new Set();
      category.providers?.forEach((provider) => {
        if (provider.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(provider.name);
        }
        provider.categories?.forEach((cat) => {
          if (cat.toLowerCase().includes(searchTerm.toLowerCase())) {
            newSuggestions.add(cat);
          }
        });
      });
      setSuggestions(Array.from(newSuggestions).slice(0, 5));
      setShowSuggestions(newSuggestions.size > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchTerm, category]);

  const filteredProviders = useMemo(() => {
    if (!category) return [];
    let filtered = [...category.providers];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.description.toLowerCase().includes(query) ||
          provider.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    switch (filterType) {
      case "popular":
        filtered = filtered.filter((provider) => provider.views > 1000);
        break;
      case "top-rated":
        filtered = filtered.filter((provider) => provider.rating >= 4.5);
        break;
      case "new":
        filtered = filtered.filter((provider) => {
          const years = parseExperienceToYears(provider.experience);
          return years > 0 && years <= 2; // New providers: 0-2 years
        });
        break;
      default:
        break;
    }

    switch (sortType) {
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "distance":
        return filtered.sort((a, b) => a.distance - b.distance);
      case "views":
        return filtered.sort((a, b) => b.views - a.views);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "time":
        return filtered.sort((a, b) => {
          const aHours = parseOperatingHours(a.operatingHours);
          const bHours = parseOperatingHours(b.operatingHours);
          if (aHours.is24h) return -1;
          if (bHours.is24h) return 1;
          return (aHours.open || 0) - (bHours.open || 0);
        });
      default:
        return filtered;
    }
  }, [category, searchTerm, filterType, sortType]);

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(
    indexOfFirstProvider,
    indexOfLastProvider
  );
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
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
      </div>
    );
  }

  if (!category) return null;

  return (
    <div
      className="min-h-screen w-full relative bg-white"
      style={{ scrollBehavior: "smooth" }}
    >
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="small"
              iconRight={true}
              icon={<ArrowLeft className="w-5 h-5" />}
              className="flex max-w-56 relative sm:left-10  sm:max-w-xs items-center gap-2 text-gray-600 hover:text-gray-900 mb-10 "
            >
              Back to Categories
            </Button>
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ backgroundColor: category.color }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <category.icon className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent leading-tight">
              {category.name}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
              <FilterDropdown
                value={filterType}
                setValue={setFilterType}
                options={FILTER_OPTIONS}
              />
              <FilterDropdown
                value={sortType}
                setValue={setSortType}
                options={SORT_OPTIONS}
              />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchTerm || filterType !== "all" || sortType !== "distance" ? (
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Filtered Providers ({filteredProviders.length})
              </span>
            ) : (
              `All Providers (${filteredProviders.length})`
            )}
          </motion.h2>

          {currentProviders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProviderCard
                      provider={provider}
                      onClick={onProviderClick}
                    />
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
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
                No providers found
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filter criteria
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setSortType("distance");
                }}
                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;
