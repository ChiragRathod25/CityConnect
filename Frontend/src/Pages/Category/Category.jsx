import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Star, Heart, Bookmark } from "lucide-react";
import { 
  COLOR_PALETTE, 
  CATEGORIES_DATA, 
  FILTER_OPTIONS, 
  CATEGORY_TYPE_OPTIONS 
} from "../../constants/Category";
import { 
  SearchInput, 
  FilterDropdown, 
  Pagination, 
  CategorySkeleton 
} from "./ReusableComponent";
import { useNavigate } from "react-router-dom";

// Category Card Component
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
      onClick={() => typeof onClick === 'function' && onClick(category)}
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
          
          {/* Badge if exists */}
          {category.badge && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className={`inline-block px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-sm ${
                  category.badge === "Popular" 
                    ? "bg-blue-100/80 text-blue-800 border-blue-200/50"
                    : "bg-gray-100/80 text-gray-800 border-gray-200/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tracking-wide uppercase">
                  {category.badge}
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
            {category.providers && (
              <motion.div 
                className="bg-blue-50/60 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.providers.length} providers
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

const CategoryPage = () => {
  const navigate = useNavigate();
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

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = showAllCategories
    ? filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)
    : filteredCategories.slice(0, 3);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div
      className="min-h-screen w-full relative bg-white"
      style={{ scrollBehavior: "smooth" }}
    >
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-gray-200">
                {CATEGORY_TYPE_OPTIONS.map(({ key, label, icon: Icon }) => (
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

              <FilterDropdown
                value={filterType}
                setValue={setFilterType}
                options={FILTER_OPTIONS}
                className="hidden lg:block"
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
                          onClick={handleCategoryClick}
                        />
                      </motion.div>
                    ))}
                  </div>

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
                      >
                        Show Less
                      </button>
                    </motion.div>
                  )}

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

export default CategoryPage;