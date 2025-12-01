import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  Package,
  Wrench,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Sparkles,
  Settings,
  Box,
  Zap,
  Star,
  Heart,
  Shield,
  Globe,
  MoreVertical,
  Calendar,
  CheckCircle,
  Utensils,
  Coffee,
  Dumbbell,
  Scissors,
  Truck,
  GraduationCap,
  Stethoscope,
  ShoppingBag,
  Film,
  Hammer,
  Gift,
  Flower,
  Cake,
  Sprout,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MoveBackButton from "@/components/ui/MoveBackButton";

const CategoryManagement = () => {
 const [categories, setCategories] = useState([
  {
    id: 1,
    name: "Restaurant",
    slug: "restaurant",
    description: "Discover top-rated restaurants offering delicious cuisines and cozy ambiance.",
    icon: Utensils,
    type: "service",
    badge: "Popular",
    rating: 4.8,
    views: 2400,
    providers: [{ name: "Food Lounge" }, { name: "Spice Villa" }],
  },
  {
    id: 2,
    name: "Cafe",
    slug: "cafe",
    description: "Find cozy cafes perfect for coffee, conversations, and creativity.",
    icon: Coffee,
    type: "service",
    badge: "Trending",
    rating: 4.7,
    views: 1800,
    providers: [{ name: "Brew Haven" }, { name: "Mocha Magic" }],
  },
  {
    id: 3,
    name: "Gym",
    slug: "gym",
    description: "Stay fit and active with top fitness centers and personal training programs.",
    icon: Dumbbell,
    type: "service",
    badge: "Top Rated",
    rating: 4.9,
    views: 3000,
    providers: [{ name: "PowerZone" }, { name: "FlexHub" }],
  },
  {
    id: 4,
    name: "Salon",
    slug: "salon",
    description: "Premium beauty and grooming salons for men and women near you.",
    icon: Scissors,
    type: "service",
    badge: "New",
    rating: 4.6,
    views: 1600,
    providers: [{ name: "StyleCraft" }, { name: "Glow Studio" }],
  },
  {
    id: 5,
    name: "Transport",
    slug: "transport",
    description: "Reliable transportation and logistics services for your daily needs.",
    icon: Truck,
    type: "service",
    badge: "Popular",
    rating: 4.4,
    views: 1300,
    providers: [{ name: "QuickMove" }, { name: "RidePro" }],
  },
  {
    id: 6,
    name: "Education",
    slug: "education",
    description: "Trusted institutions and learning centers to help you grow your skills.",
    icon: GraduationCap,
    type: "service",
    badge: "Trending",
    rating: 4.8,
    views: 2700,
    providers: [{ name: "Bright Academy" }, { name: "SkillBridge" }],
  },
  {
    id: 7,
    name: "Medical",
    slug: "medical",
    description: "Hospitals, clinics, and pharmacies offering quality healthcare services.",
    icon: Stethoscope,
    type: "service",
    badge: "Top Rated",
    rating: 4.9,
    views: 3500,
    providers: [{ name: "LifeCare" }, { name: "MediTrust" }],
  },
  {
    id: 8,
    name: "Shopping",
    slug: "shopping",
    description: "Explore malls, stores, and boutiques for your favorite brands and trends.",
    icon: ShoppingBag,
    type: "service",
    badge: "Popular",
    rating: 4.7,
    views: 2200,
    providers: [{ name: "StyleKart" }, { name: "ShopNest" }],
  },
  {
    id: 9,
    name: "Entertainment",
    slug: "entertainment",
    description: "Discover movies, events, and fun activities happening around you.",
    icon: Film,
    type: "service",
    badge: "Trending",
    rating: 4.5,
    views: 2000,
    providers: [{ name: "FunZone" }, { name: "EventHub" }],
  },
  {
    id: 10,
    name: "Services",
    slug: "services",
    description: "Professional repair, cleaning, and maintenance services near you.",
    icon: Wrench,
    type: "service",
    badge: "Top Rated",
    rating: 4.8,
    views: 2100,
    providers: [{ name: "FixMate" }, { name: "CleanPro" }],
  },
  {
    id: 11,
    name: "Other",
    slug: "other",
    description: "Miscellaneous businesses offering unique and niche services.",
    icon: MoreHorizontal,
    type: "service",
    badge: "New",
    rating: 4.3,
    views: 900,
    providers: [{ name: "UniServe" }],
  },
]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "product",
    icon: "Box",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const filterDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const iconDropdownRef = useRef(null);
  const itemsPerPage = 6;

  // Available icons with zinc/gray variations
  const availableIcons = [
    { name: "Box", icon: Box, color: "from-zinc-600 to-zinc-700" },
    { name: "Zap", icon: Zap, color: "from-gray-600 to-gray-700" },
    { name: "Settings", icon: Settings, color: "from-zinc-500 to-zinc-600" },
    { name: "Star", icon: Star, color: "from-gray-500 to-gray-600" },
    { name: "Heart", icon: Heart, color: "from-zinc-700 to-zinc-800" },
    { name: "Shield", icon: Shield, color: "from-gray-700 to-gray-800" },
    { name: "Globe", icon: Globe, color: "from-zinc-400 to-zinc-500" },
    { name: "Package", icon: Package, color: "from-gray-800 to-gray-900" },
    { name: "Wrench", icon: Wrench, color: "from-zinc-800 to-zinc-900" },
    { name: "Sparkles", icon: Sparkles, color: "from-gray-400 to-gray-500" },
  ];

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isDeleteModalOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterDropdownOpen(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        setIsTypeDropdownOpen(false);
      }
      if (
        iconDropdownRef.current &&
        !iconDropdownRef.current.contains(event.target)
      ) {
        setIsIconDropdownOpen(false);
      }
      if (activeCard && !event.target.closest(".card-menu")) {
        setActiveCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeCard]);

  // Get icon component by name
  const getIcon = (iconName) => {
    const iconObj = availableIcons.find((icon) => icon.name === iconName);
    return iconObj
      ? { icon: iconObj.icon, color: iconObj.color }
      : { icon: Box, color: "from-zinc-500 to-zinc-600" };
  };

  // Filter and search categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || category.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.name.length > 50)
      newErrors.name = "Name must be less than 50 characters";
    if (formData.description.length > 200)
      newErrors.description = "Description must be less than 200 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToastMessage = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(
      () => setShowToast({ show: false, message: "", type: "" }),
      3000
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (currentCategory) {
      setCategories((cats) =>
        cats.map((cat) =>
          cat.id === currentCategory.id ? { ...cat, ...formData } : cat
        )
      );
      showToastMessage("Category updated successfully!", "success");
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories((cats) => [...cats, newCategory]);
      showToastMessage("Category created successfully!", "success");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", type: "product", icon: "Box" });
    setCurrentCategory(null);
    setIsModalOpen(false);
    setIsTypeDropdownOpen(false);
    setIsIconDropdownOpen(false);
    setErrors({});
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      icon: category.icon,
    });
    setIsModalOpen(true);
    setActiveCard(null);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
    setIsDeleteModalOpen(true);
    setActiveCard(null);
  };

  const confirmDelete = () => {
    setCategories((cats) => cats.filter((cat) => cat.id !== deleteCategory.id));
    showToastMessage("Category deleted successfully!", "success");
    setIsDeleteModalOpen(false);
    setDeleteCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBackToProfile = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-3 sm:p-6">
      <div className="max-w-7xl mb-20 mx-auto">
        {/* Header */}
        <div className="relative z-10">
          <div className="relative mb-5 sm:mb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <MoveBackButton onClick={handleBackToProfile} />
              </div>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <div className="flex text-center flex-col items-center gap-3 sm:gap-4 mb-4">
            <div className="w-16 h-16  bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Package className="w-10 h-10 animate-pulse  text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900">
                Category Management
              </h1>
              <p className="text-zinc-600 pt-2 text-sm sm:text-lg">
                Organize and manage your categories efficiently
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-200 p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                {/* Enhanced Search Bar */}
                <div className="relative flex-1 sm:max-w-md">
                  <motion.div
                    animate={{
                      scale: isSearchFocused ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                      <Search
                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                          isSearchFocused ? "text-zinc-700" : "text-zinc-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pl-10 sm:pl-12 pr-12 sm:pr-16 py-3 sm:py-4 bg-white border border-zinc-400 rounded-2xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all placeholder-zinc-400 text-sm sm:text-base"
                    />
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearchTerm("")}
                          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                        >
                          <div className="p-1 hover:bg-zinc-100 rounded-lg transition-colors">
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500" />
                          </div>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      setIsFilterDropdownOpen(!isFilterDropdownOpen)
                    }
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border border-zinc-300 rounded-xl sm:rounded-2xl hover:bg-zinc-50 hover:shadow-sm transition-all min-w-[140px] sm:min-w-[160px] justify-between"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Filter className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-700 font-medium capitalize text-sm sm:text-base">
                        {filterType === "all" ? "All Types" : filterType}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 transition-transform ${
                        isFilterDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full mt-2 left-0 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-lg z-50 min-w-[140px] sm:min-w-[160px] overflow-hidden"
                      >
                        {["all", "product", "service"].map((type, index) => (
                          <motion.button
                            key={type}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setFilterType(type);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left transition-all flex items-center gap-2 sm:gap-3 group ${
                              filterType === type
                                ? "bg-zinc-100 text-zinc-900"
                                : "hover:bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            {type === "product" && (
                              <Package className="w-4 h-4 text-zinc-600" />
                            )}
                            {type === "service" && (
                              <Wrench className="w-4 h-4 text-zinc-600" />
                            )}
                            {type === "all" && (
                              <Filter className="w-4 h-4 text-zinc-600" />
                            )}
                            <span className="capitalize font-medium text-sm sm:text-base">
                              {type === "all" ? "All Types" : type}
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Add Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Category</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          {paginatedCategories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-8 sm:p-16 text-center border border-zinc-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
              >
                <Package className="w-8 h-8 sm:w-12 sm:h-12 text-zinc-400" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-700 mb-2 sm:mb-3">
                No categories found
              </h3>
              <p className="text-zinc-500 text-sm sm:text-lg">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {paginatedCategories.map((category, index) => {
                const { icon: IconComponent, color } = getIcon(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div
                      className={`h-16 sm:h-20 bg-gradient-to-br ${color} relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="relative card-menu">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setActiveCard(
                                activeCard === category.id ? null : category.id
                              )
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all"
                          >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>

                          {/* Card Menu */}
                          <AnimatePresence>
                            {activeCard === category.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                className="absolute top-full mt-1 sm:mt-2 right-0 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-lg z-50 overflow-hidden min-w-[120px] sm:min-w-[140px]"
                              >
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left hover:bg-zinc-50 transition-all flex items-center gap-2 sm:gap-3 text-zinc-700 text-sm sm:text-base"
                                >
                                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600" />
                                  <span className="font-medium">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(category)}
                                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left hover:bg-red-50 transition-all flex items-center gap-2 sm:gap-3 text-zinc-700 text-sm sm:text-base"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                  <span className="font-medium">Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="relative -mt-5 sm:-mt-6 flex justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-zinc-100">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <h3 className="font-bold text-zinc-900 text-base sm:text-lg truncate flex-1">
                          {category.name}
                        </h3>
                        <div
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl text-xs font-medium ${
                            category.type === "product"
                              ? "bg-zinc-100 text-zinc-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category.type}
                        </div>
                      </div>

                      <p className="text-zinc-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm hover:border-zinc-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
            </motion.button>

            <div className="flex gap-1 sm:gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i + 1}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all text-sm sm:text-base ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-sm"
                      : "bg-white border border-zinc-200 hover:shadow-sm hover:border-zinc-300 text-zinc-700"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm hover:border-zinc-300 transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed overflow-y-auto inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => resetForm()}
            />
            <div className="fixed inset-0 flex items-center justify-center px-4 pt-20 z-50 overflow-y-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto border border-zinc-200 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                        {currentCategory ? "Edit Category" : "Add Category"}
                      </h2>
                      <p className="text-zinc-600 mt-1 text-sm sm:text-base">
                        {currentCategory
                          ? "Update category information"
                          : "Create a new category"}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetForm}
                      className="p-2 sm:p-3 hover:bg-zinc-50 rounded-xl sm:rounded-2xl transition-all"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
                    </motion.button>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-3">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 sm:py-4 bg-white border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all placeholder-zinc-400 text-sm sm:text-base ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-zinc-300"
                        }`}
                        placeholder="Enter category name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-3">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-4 py-3 sm:py-4 bg-white border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all resize-none placeholder-zinc-400 text-sm sm:text-base ${
                          errors.description
                            ? "border-red-300 bg-red-50"
                            : "border-zinc-300"
                        }`}
                        placeholder="Enter category description"
                      />
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </motion.p>
                      )}
                    </div>

                    {/* Type Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-3">
                        Category Type
                      </label>
                      <div className="relative" ref={typeDropdownRef}>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="button"
                          onClick={() =>
                            setIsTypeDropdownOpen(!isTypeDropdownOpen)
                          }
                          className="w-full px-4 py-3 sm:py-4 bg-white border border-zinc-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all text-left flex items-center justify-between text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-3">
                            {formData.type === "product" ? (
                              <Package className="w-4 h-4 text-zinc-600" />
                            ) : (
                              <Wrench className="w-4 h-4 text-zinc-600" />
                            )}
                            <span className="capitalize text-zinc-700 font-medium">
                              {formData.type}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-zinc-500 transition-transform ${
                              isTypeDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </motion.button>

                        <AnimatePresence>
                          {isTypeDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute top-full mt-2 left-0 right-0 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-lg z-50 overflow-hidden"
                            >
                              {["product", "service"].map((type, index) => (
                                <motion.button
                                  key={type}
                                  type="button"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, type }));
                                    setIsTypeDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${
                                    formData.type === type
                                      ? "bg-zinc-100 text-zinc-900"
                                      : "hover:bg-zinc-50 text-zinc-700"
                                  }`}
                                >
                                  {type === "product" ? (
                                    <Package className="w-4 h-4 text-zinc-600" />
                                  ) : (
                                    <Wrench className="w-4 h-4 text-zinc-600" />
                                  )}
                                  <span className="capitalize font-medium">
                                    {type}
                                  </span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Icon Selection Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-3">
                        Choose Icon
                      </label>
                      <div className="relative" ref={iconDropdownRef}>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="button"
                          onClick={() =>
                            setIsIconDropdownOpen(!isIconDropdownOpen)
                          }
                          className="w-full px-4 py-3 sm:py-4 bg-white border border-zinc-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all text-left flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                                getIcon(formData.icon).color
                              } flex items-center justify-center`}
                            >
                              {React.createElement(
                                getIcon(formData.icon).icon,
                                {
                                  className: "w-4 h-4 text-white",
                                }
                              )}
                            </div>
                            <span className="text-zinc-700 font-medium">
                              {formData.icon}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-zinc-500 transition-transform ${
                              isIconDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </motion.button>

                        <AnimatePresence>
                          {isIconDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute top-full mt-2 left-0 right-0 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto"
                            >
                              {availableIcons.map((iconItem, index) => {
                                const IconComponent = iconItem.icon;
                                const isSelected =
                                  formData.icon === iconItem.name;
                                return (
                                  <motion.button
                                    key={iconItem.name}
                                    type="button"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        icon: iconItem.name,
                                      }));
                                      setIsIconDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 relative ${
                                      isSelected
                                        ? "bg-zinc-100 text-zinc-900"
                                        : "hover:bg-zinc-50 text-zinc-700"
                                    }`}
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconItem.color} flex items-center justify-center`}
                                    >
                                      <IconComponent className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium flex-1">
                                      {iconItem.name}
                                    </span>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-zinc-600" />
                                    )}
                                  </motion.button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-6 py-3 sm:py-4 bg-white border border-zinc-300 rounded-xl sm:rounded-2xl hover:bg-zinc-50 hover:shadow-sm transition-all font-medium text-zinc-700 text-sm sm:text-base"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl sm:rounded-2xl hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                      >
                        {currentCategory
                          ? "Update Category"
                          : "Create Category"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-zinc-200"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
                  >
                    <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2 sm:mb-3">
                    Delete Category
                  </h3>
                  <p className="text-zinc-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-zinc-800">
                      "{deleteCategory?.name}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 px-6 py-3 sm:py-4 bg-white border border-zinc-300 rounded-xl sm:rounded-2xl hover:bg-zinc-50 hover:shadow-sm transition-all font-medium text-zinc-700 text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={confirmDelete}
                      className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                    >
                      Delete Category
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
          >
            <div
              className={`flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border text-sm sm:text-base ${
                showToast.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400"
              }`}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center">
                {showToast.type === "success" ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
