import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FILTER_OPTIONS, SORT_OPTIONS } from "../../constants/Category";
import {
  SearchInput,
  FilterDropdown,
  Pagination,
  CategorySkeleton,
  parseOperatingHours,
  AnimatedBackground,
} from "./ReusableComponent";
import { Button } from "@/components/ui/Button";
import { Star, Heart, MapPin, Clock } from "lucide-react";
import databaseService from "@/services/database.services";

const parseExperienceToYears = (experience) => {
  if (!experience || typeof experience !== "string") return 0;
  const match = experience.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const SubcategoryPage = ({ onProviderClick }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("distance");
  const [category, setCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 6;

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const res = await databaseService.getBusinessByCategory(slug);

        const data = res.data; //array of businesses
        if (data.length === 0) {
          alert("No businesses found in this category.");
          navigate("/category");
          return;
        }

        setCategory({ name: slug, slug });
        setProviders(data);

        console.log("Fetched category businesses:", res);
      } catch (error) {
        console.error("Error fetching category businesses:", error);
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, navigate]);

  // ✅ Search suggestions
  useEffect(() => {
    if (searchTerm.length > 0 && providers.length > 0) {
      const newSuggestions = new Set();
      providers.forEach((provider) => {
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
  }, [searchTerm, providers]);

  // ✅ Filter + Sort
  const filteredProviders = useMemo(() => {
    let filtered = [...providers];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.categories?.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    switch (filterType) {
      case "popular":
        filtered = filtered.filter((p) => p.views > 1000);
        break;
      case "top-rated":
        filtered = filtered.filter((p) => p.rating >= 4.5);
        break;
      case "new":
        filtered = filtered.filter((p) => {
          const years = parseExperienceToYears(p.experience);
          return years <= 2;
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
          const aH = parseOperatingHours(a.operatingHours);
          const bH = parseOperatingHours(b.operatingHours);
          return (aH.open || 0) - (bH.open || 0);
        });
      default:
        return filtered;
    }
  }, [providers, searchTerm, filterType, sortType]);

  // ✅ Pagination
  const indexOfLast = currentPage * providersPerPage;
  const indexOfFirst = indexOfLast - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirst, indexOfLast);
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
    <div className="min-h-screen w-full relative bg-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {category.name || slug}
            </h1>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <SearchInput
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {showSuggestions && (
                <div className="absolute z-10 bg-white border rounded-xl mt-2 w-full shadow-lg">
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FilterDropdown
              options={FILTER_OPTIONS}
              value={filterType}
              onChange={(v) => setFilterType(v)}
              label="Filter"
            />
            <FilterDropdown
              options={SORT_OPTIONS}
              value={sortType}
              onChange={(v) => setSortType(v)}
              label="Sort"
            />
          </div>

          {/* Providers */}
          {currentProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProviders.map((provider, index) => (
            <motion.div
  key={provider._id || index}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  <div
    onClick={() => onProviderClick?.(provider)}
    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    {/* Image */}
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={
          provider?.images?.[0]?.url ||
          "/assets/images/default-restaurant.jpg"
        }
        alt={provider.name}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Like Button */}
      <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2 shadow hover:bg-white transition">
        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
      </button>

      {/* Verification Badge */}
      <div
        className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full shadow ${
          provider.isVerified
            ? "bg-green-500 text-white"
            : "bg-yellow-400 text-gray-800"
        }`}
      >
        {provider.isVerified ? "Verified" : "Pending"}
      </div>
    </div>

    {/* Info */}
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900 truncate">
          {provider.name}
        </h3>
        <span className="text-xs text-gray-500">
          {new Date(provider.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Category + Type */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
          {provider.category || "Uncategorized"}
        </span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          {provider.type || "Business"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {provider.description ||
          "No description available for this business."}
      </p>

      {/* Location */}
      {provider.locationDetails && (
        <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span>
            {provider.locationDetails.address ||
              `${provider.locationDetails.city}, ${provider.locationDetails.country}`}
          </span>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            Updated{" "}
            {new Date(provider.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-sm font-medium text-rose-600 border-rose-100 hover:bg-rose-50"
        >
          View Details →
        </Button>
      </div>
    </div>
  </div>
</motion.div>

              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No businesses found for this category.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;
