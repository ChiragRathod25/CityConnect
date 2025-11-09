import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Bookmark, Heart, Star } from "lucide-react";
import {
  COLOR_PALETTE,
  CATEGORIES_DATA,
  FILTER_OPTIONS,
  CATEGORY_TYPE_OPTIONS,
} from "../../constants/Category";
import {
  SearchInput,
  FilterDropdown,
  Pagination,
  CategorySkeleton,
  AnimatedBackground,
} from "./ReusableComponent";

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
      className={`relative group block p-3 h-full w-full max-w-sm mx-auto ${className}`}
      onMouseEnter={() => setHoveredIndex(0)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => typeof onClick === "function" && onClick(category)}
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

        <div className="relative z-10 p-5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden"
              style={{
                backgroundColor: hoveredIndex === 0 ? "#111827" : "#1f2937",
                transition: "background-color 0.3s ease",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <IconComponent className="w-6 h-6 text-white relative z-10" />
            </motion.div>

            <motion.div
              className="px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border"
              style={{
                backgroundColor:
                  category.type === "service" ? "#374151" : "#6b7280",
                color: "#ffffff",
                borderColor: "#9ca3af",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tracking-wide uppercase">
                {category.type === "service" ? "Service" : "Product"}
              </span>
            </motion.div>
          </div>

          {category.badge && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border"
                style={{
                  backgroundColor:
                    category.badge === "Popular" ? "#374151" : "#6b7280",
                  color: "#ffffff",
                  borderColor: "#9ca3af",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tracking-wide uppercase">
                  {category.badge}
                </span>
              </motion.div>
            </motion.div>
          )}

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
              {category.name}
            </motion.h3>
            <p
              className="text-sm leading-relaxed mb-3 line-clamp-2 font-medium"
              style={{ color: "#6b7280" }}
            >
              {category.description}
            </p>
          </div>

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
                  {category.rating}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                style={{ color: "#dc2626" }}
                whileHover={{ scale: 1.02 }}
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-xs sm:text-sm font-medium">
                  {category.views > 1000
                    ? `${(category.views / 1000).toFixed(1)}k`
                    : category.views.toLocaleString()}
                </span>
              </motion.div>
            </div>
            {category.providers && (
              <motion.div
                className="text-sm font-medium"
                style={{ color: "#6b7280" }}
                whileHover={{ scale: 1.02 }}
              >
                {category.providers.length} providers
              </motion.div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              onClick={handleFavorite}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border"
              style={{
                backgroundColor: isFavorite ? "#dc2626" : "#ffffff",
                color: isFavorite ? "#ffffff" : "#374151",
                borderColor: isFavorite ? "#dc2626" : "#e5e7eb",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
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
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              />
              <span className="hidden sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categoryType, setCategoryType] = useState("all");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(CATEGORIES_DATA);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = new Set();
      categories.forEach((category) => {
        if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(category.name);
        }
        category.providers?.forEach((provider) => {
          if (provider.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            newSuggestions.add(provider.name);
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

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: "#f8fafc", scrollBehavior: "smooth" }}
    >
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ backgroundColor: "#1f2937" }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <Search className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse text-white" />
              </motion.div>
            </div>
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 leading-tight"
              style={{ color: "#1f2937" }}
            >
              Discover Businesses 
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#6b7280" }}
            >
              Find the best local services and products in your area
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center"
            style={{ color: "#1f2937" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            All Categories ({filteredCategories.length})
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          ) : (
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HoverEffectCard
                      category={category}
                      onClick={handleCategoryClick}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
