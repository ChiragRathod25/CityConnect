import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, TrendingUp, Zap, Award, ChevronDown, ChevronUp, Wrench, ShirtIcon, Hammer, BookOpen, Utensils, Sprout, Bike, Car, Home, Heart, Camera, Gamepad2, Plane, Gift, Users, Tag, MapPin, Clock } from 'lucide-react';

// Enhanced category data structure with services and products
const mockCategories = [
  {
    id: 1,
    name: "Plumber",
    type: "service",
    icon: Wrench,
    description: "Professional plumbing services for your home",
    badge: "Popular",
    views: 1890,
    rating: 4.8,
    color: "from-blue-500 to-cyan-500",
    subcategories: [
      { id: 101, name: "Emergency Plumbing", description: "24/7 urgent repairs" },
      { id: 102, name: "Pipe Installation", description: "New pipe fitting services" },
      { id: 103, name: "Drain Cleaning", description: "Blocked drain solutions" },
      { id: 104, name: "Water Heater Repair", description: "Geyser maintenance & repair" }
    ]
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
    color: "from-amber-500 to-orange-500",
    subcategories: [
      { id: 201, name: "Shoe Repair", description: "Fix worn out shoes" },
      { id: 202, name: "Leather Polishing", description: "Professional shoe shine" },
      { id: 203, name: "Sole Replacement", description: "Replace old soles" }
    ]
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
    color: "from-gray-600 to-gray-800",
    subcategories: [
      { id: 301, name: "Tool Making", description: "Custom tool forging" },
      { id: 302, name: "Gate Repair", description: "Metal gate services" },
      { id: 303, name: "Key Making", description: "Duplicate keys & locks" }
    ]
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
    color: "from-green-500 to-emerald-500",
    subcategories: [
      { id: 401, name: "Academic Books", description: "Educational textbooks" },
      { id: 402, name: "Fiction & Novels", description: "Stories and literature" },
      { id: 403, name: "Stationery", description: "Pens, notebooks & supplies" },
      { id: 404, name: "Children's Books", description: "Books for kids" }
    ]
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
    color: "from-red-500 to-pink-500",
    subcategories: [
      { id: 501, name: "Veg Restaurant", description: "Pure vegetarian cuisine" },
      { id: 502, name: "Non-Veg Restaurant", description: "Meat and seafood dishes" },
      { id: 503, name: "Fast Food", description: "Quick bites and snacks" },
      { id: 504, name: "Bakery & Cafe", description: "Fresh baked goods & coffee" },
      { id: 505, name: "Street Food", description: "Local street delicacies" },
      { id: 506, name: "Fine Dining", description: "Premium restaurant experience" }
    ]
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
    color: "from-green-400 to-lime-500",
    subcategories: [
      { id: 601, name: "Garden Maintenance", description: "Regular garden care" },
      { id: 602, name: "Plant Installation", description: "New plant setup" },
      { id: 603, name: "Lawn Care", description: "Grass cutting & maintenance" },
      { id: 604, name: "Landscaping", description: "Garden design services" }
    ]
  },
  {
    id: 7,
    name: "Rickshawala",
    type: "service",
    icon: Bike,
    description: "Local transportation services",
    badge: null,
    views: 654,
    rating: 4.2,
    color: "from-yellow-500 to-orange-500",
    subcategories: [
      { id: 701, name: "Auto Rickshaw", description: "Three-wheeler transport" },
      { id: 702, name: "Cycle Rickshaw", description: "Eco-friendly rides" },
      { id: 703, name: "Goods Transport", description: "Small cargo delivery" }
    ]
  },
  {
    id: 8,
    name: "Electronics Shop",
    type: "product",
    icon: Camera,
    description: "Latest gadgets and electronic devices",
    badge: "Trending",
    views: 2134,
    rating: 4.4,
    color: "from-purple-500 to-indigo-500",
    subcategories: [
      { id: 801, name: "Mobile Phones", description: "Smartphones & accessories" },
      { id: 802, name: "Laptops & Computers", description: "Computing devices" },
      { id: 803, name: "Home Appliances", description: "Kitchen & household items" },
      { id: 804, name: "Audio & Video", description: "Entertainment systems" }
    ]
  },
  {
    id: 9,
    name: "Salon & Spa",
    type: "service",
    icon: Heart,
    description: "Beauty and wellness services",
    badge: "Popular",
    views: 1789,
    rating: 4.6,
    color: "from-pink-500 to-rose-500",
    subcategories: [
      { id: 901, name: "Hair Cut & Styling", description: "Professional hair services" },
      { id: 902, name: "Facial & Skincare", description: "Beauty treatments" },
      { id: 903, name: "Massage Therapy", description: "Relaxation & wellness" },
      { id: 904, name: "Bridal Services", description: "Wedding preparation" }
    ]
  }
];

// Enhanced Badge Component
const Badge = ({ type }) => {
  const badgeStyles = {
    'New': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    'Trending': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    'Popular': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    'Top Rated': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  };

  const badgeIcons = {
    'New': Zap,
    'Trending': TrendingUp,
    'Popular': Users,
    'Top Rated': Award
  };

  const IconComponent = badgeIcons[type];

  return (
    <motion.div 
      className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeStyles[type]} shadow-xl backdrop-blur-sm`}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <IconComponent className="w-3 h-3" />
      {type}
    </motion.div>
  );
};

// Type Badge Component
const TypeBadge = ({ type }) => (
  <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
    type === 'service' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800'
  }`}>
    {type === 'service' ? '🛠️ Service' : '🏪 Product'}
  </div>
);

// Subcategory Item Component
const SubcategoryItem = ({ subcategory, onClick }) => (
  <motion.div
    className="bg-gray-50 rounded-xl p-4 cursor-pointer group hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(subcategory)}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {subcategory.name}
    </h4>
    <p className="text-sm text-gray-600 leading-relaxed">
      {subcategory.description}
    </p>
  </motion.div>
);

// Enhanced Category Card with Expandable Subcategories
const CategoryCard = ({ category, onClick, isExpanded, onToggleExpand }) => {
  const IconComponent = category.icon;
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  
  return (
    <motion.div
      className="relative bg-white rounded-3xl shadow-lg cursor-pointer overflow-hidden group border border-gray-100 hover:border-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: isExpanded ? 1 : 1.03, 
        y: isExpanded ? 0 : -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      layout
      style={{
        boxShadow: isExpanded ? '0 20px 60px rgba(0,0,0,0.15)' : '0 10px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* Main Card Content */}
      <div className="p-6" onClick={() => hasSubcategories ? onToggleExpand() : onClick(category)}>
        {/* Gradient Background on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
          initial={false}
        />
        
        {/* Badge */}
        {category.badge && <Badge type={category.badge} />}
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon and Type */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:shadow-2xl`}
              whileHover={{ 
                rotate: [0, -8, 8, -4, 4, 0],
                scale: 1.1,
                transition: { duration: 0.6 }
              }}
            >
              <IconComponent className="w-7 h-7 text-white" />
            </motion.div>
            <TypeBadge type={category.type} />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {category.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
            {category.description}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{category.rating}</span>
              <span>•</span>
              <span>{category.views.toLocaleString()} views</span>
            </div>
            
            {/* Expand Button */}
            {hasSubcategories && (
              <motion.div
                className="flex items-center gap-1 text-blue-600 font-medium"
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                <span className="text-xs">{category.subcategories.length} options</span>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Subcategories Section */}
      <AnimatePresence>
        {isExpanded && hasSubcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-200 bg-gray-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Available Options ({category.subcategories.length})
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence>
                  {category.subcategories.map((subcategory, index) => (
                    <motion.div
                      key={subcategory.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SubcategoryItem
                        subcategory={subcategory}
                        onClick={(sub) => onClick(category, sub)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Loading Skeleton Component
const CategorySkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-lg animate-pulse border border-gray-200">
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

// Main Component
const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [categoryType, setCategoryType] = useState('all'); // all, service, product
  const [categories, setCategories] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = new Set();
      
      categories.forEach(category => {
        // Add category names
        if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(category.name);
        }
        
        // Add subcategory names
        category.subcategories?.forEach(sub => {
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

  // Enhanced filtering logic
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Apply category type filter (service/product)
    if (categoryType !== 'all') {
      filtered = filtered.filter(cat => cat.type === categoryType);
    }

    // Apply search filter (search in categories and subcategories)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.subcategories?.some(sub => 
          sub.name.toLowerCase().includes(query) ||
          sub.description.toLowerCase().includes(query)
        )
      );
    }

    // Apply badge filter
    switch (filterType) {
      case 'popular':
        filtered = filtered.filter(cat => cat.badge === 'Popular');
        break;
      case 'trending':
        filtered = filtered.filter(cat => cat.badge === 'Trending');
        break;
      case 'new':
        filtered = filtered.filter(cat => cat.badge === 'New');
        break;
      case 'top-rated':
        filtered = filtered.filter(cat => cat.badge === 'Top Rated');
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => b.views - a.views);
  }, [categories, searchTerm, filterType, categoryType]);

  const handleCategoryClick = (category, subcategory = null) => {
    if (subcategory) {
      console.log(`Navigating to ${category.name} -> ${subcategory.name}`);
    } else {
      console.log(`Navigating to ${category.name}`);
    }
  };

  const handleToggleExpand = (categoryId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Stats
  const serviceCount = categories.filter(cat => cat.type === 'service').length;
  const productCount = categories.filter(cat => cat.type === 'product').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg  top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-black  mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Discover Services & Products
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Find the best local services and products with expandable subcategories
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{serviceCount}</div>
                <div className="text-sm text-gray-500">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{productCount}</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Options</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category Type Tabs */}
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
                {[
                  { key: 'all', label: 'All Categories', icon: Users },
                  { key: 'service', label: 'Services', icon: Wrench },
                  { key: 'product', label: 'Products', icon: Gift }
                ].map(({ key, label, icon: Icon }) => (
                  <motion.button
                    key={key}
                    onClick={() => setCategoryType(key)}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                      categoryType === key
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-6 max-w-3xl mx-auto">
              {/* Search Bar with Suggestions */}
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  placeholder="Search categories and subcategories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-inner"
                />
                
                {/* Enhanced Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-gray-700 capitalize border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Search className="w-4 h-4 inline mr-3 text-gray-400" />
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Badge Filter Dropdown */}
              <motion.div className="relative">
                <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-14 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 appearance-none cursor-pointer min-w-[200px] font-medium text-gray-700 shadow-inner transition-all duration-300"
                >
                  <option value="all">All Badges</option>
                  <option value="popular">Popular</option>
                  <option value="trending">Trending</option>
                  <option value="new">New</option>
                  <option value="top-rated">Top Rated</option>
                </select>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2 className="text-3xl font-bold text-gray-900 mb-8">
            {searchTerm || filterType !== 'all' || categoryType !== 'all' ? (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Filtered Results
              </span>
            ) : (
              'All Categories'
            )}
            {!loading && (
              <motion.span 
                className="ml-4 text-lg font-normal text-gray-500 bg-gray-100 px-4 py-2 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredCategories.length} found
              </motion.span>
            )}
          </motion.h2>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          {/* Categories Grid with Expandable Cards */}
          {!loading && (
            <AnimatePresence mode="wait">
              {filteredCategories.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence>
                    {filteredCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                      >
                        <CategoryCard
                          category={category}
                          onClick={handleCategoryClick}
                          isExpanded={expandedCards.has(category.id)}
                          onToggleExpand={() => handleToggleExpand(category.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-200"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No categories found
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Try adjusting your search terms, category type, or filter criteria to find what you're looking for
                  </p>
                  <motion.button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setCategoryType('all');
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.section>

        {/* Quick Actions Section */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Popular Services Card */}
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Popular Services</h3>
              </div>
              
              <div className="space-y-4">
                {categories
                  .filter(cat => cat.type === 'service' && cat.views > 800)
                  .slice(0, 3)
                  .map(service => (
                    <motion.div
                      key={service.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer"
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)", x: 5 }}
                      onClick={() => handleCategoryClick(service)}
                    >
                      <div className="flex items-center gap-3">
                        <service.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.views.toLocaleString()} views</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Top Products Card */}
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Top Products</h3>
              </div>
              
              <div className="space-y-4">
                {categories
                  .filter(cat => cat.type === 'product')
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 3)
                  .map(product => (
                    <motion.div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer"
                      whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.05)", x: 5 }}
                      onClick={() => handleCategoryClick(product)}
                    >
                      <div className="flex items-center gap-3">
                        <product.icon className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.subcategories?.length || 0} options
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Progress & Tips Section */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-gray-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Exploration Progress */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Category Explorer</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {expandedCards.size}/{categories.length} explored
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-3 rounded-full shadow-inner"
                      initial={{ width: 0 }}
                      animate={{ width: `${(expandedCards.size / categories.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Expand category cards to explore subcategories and unlock detailed options! 
                    <span className="font-semibold text-purple-600"> Click on cards with subcategories to discover more.</span>
                  </p>
                </div>
              </div>

              {/* Tips & Instructions */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">How It Works</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Browse Categories</div>
                      <div className="text-sm text-gray-600">Filter by Services or Products using the tabs above</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Expand Options</div>
                      <div className="text-sm text-gray-600">Click cards with subcategories to see detailed options</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Search & Filter</div>
                      <div className="text-sm text-gray-600">Use real-time search to find specific services or products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;