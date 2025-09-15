import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Users, 
  Star, 
  Heart, 
  Bookmark, 
  ArrowLeft 
} from "lucide-react";
import { 
  COLOR_PALETTE, 
  CATEGORIES_DATA, 
  FILTER_OPTIONS, 
  SORT_OPTIONS 
} from "../../constants/Category";
import { 
  SearchInput, 
  FilterDropdown, 
  Pagination, 
  CategorySkeleton,
  parseOperatingHours,
  isOpenNow 
} from "./ReusableComponent";

// Provider Card Component (unchanged)
const ProviderCard = ({ provider, onClick, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(provider.liked);
  const [isSaved, setIsSaved] = useState(provider.saved);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const hours = parseOperatingHours(provider.operatingHours);
  const isOpen = isOpenNow(hours);

  return (
    <motion.div
      className={`relative group block p-1 h-full w-full ${className}`}
      onClick={() => onClick(provider)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100/50"></div>
        <div 
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: "radial-gradient(circle at top right, rgba(70, 130, 180, 0.3), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white/90 backdrop-blur-lg rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
            </div>
            <motion.div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-sm ${
                isOpen
                  ? "bg-green-100/80 text-green-800 border-green-200/50"
                  : "bg-gray-100/80 text-gray-800 border-gray-200/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? "Open" : "Closed"}
            </motion.div>
          </div>

          <div className="flex-1">
            <motion.h3 
              className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-900 transition-colors"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {provider.name}
            </motion.h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2 font-medium">
              {provider.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {provider.categories.map((cat, index) => (
                <span
                  key={index}
                  className="text-xs font-medium bg-blue-50/60 text-blue-800 px-2 py-1 rounded-full border border-blue-100/50"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-blue-100/50">
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex items-center gap-1.5 bg-blue-50/60 px-2.5 py-1 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4 text-blue-600 fill-current" />
                <span className="text-sm font-semibold text-gray-800">
                  {provider.rating}
                </span>
              </motion.div>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {provider.views.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {provider.distance} km
            </div>
          </div>

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

// SubcategoryPage Component
const SubcategoryPage = ({ onProviderClick }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("distance"); // Default to distance
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
        filtered = filtered.filter((provider) => provider.experience.includes("5+"));
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
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
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
    <div className="min-h-screen w-full relative bg-white" style={{ scrollBehavior: "smooth" }}>
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
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>
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
                className="hidden lg:block"
              />
              <FilterDropdown
                value={sortType}
                setValue={setSortType}
                options={SORT_OPTIONS}
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