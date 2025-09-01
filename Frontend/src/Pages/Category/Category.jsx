import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, TrendingUp, Zap, Award, ArrowLeft, MapPin, Clock, Users, Tag, Wrench, ShirtIcon, Hammer, BookOpen, Utensils, Sprout, Gift, ChevronDown, X, Heart, Bookmark } from 'lucide-react';

// Constants with updated data including images
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
    color: "from-blue-500 to-cyan-500",
    subcategories: [
      { 
        id: 101, 
        name: "Emergency Plumbing", 
        description: "24/7 urgent repairs", 
        distance: 0.5, 
        location: "Sayajigunj",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"
      },
      { 
        id: 102, 
        name: "Pipe Installation", 
        description: "New pipe fitting services", 
        distance: 1.2, 
        location: "Alkapuri",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
      },
      { 
        id: 103, 
        name: "Drain Cleaning", 
        description: "Blocked drain solutions", 
        distance: 0.8, 
        location: "Fatehgunj",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
      },
      { 
        id: 104, 
        name: "Water Heater Repair", 
        description: "Geyser maintenance & repair", 
        distance: 2.1, 
        location: "Manjalpur",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
      }
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
      { 
        id: 201, 
        name: "Shoe Repair", 
        description: "Fix worn out shoes", 
        distance: 0.3, 
        location: "RC Dutt Road",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop"
      },
      { 
        id: 202, 
        name: "Leather Polishing", 
        description: "Professional shoe shine", 
        distance: 1.5, 
        location: "Karelibaug",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop"
      },
      { 
        id: 203, 
        name: "Sole Replacement", 
        description: "Replace old soles", 
        distance: 0.9, 
        location: "Gotri",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop"
      }
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
    color: "from-slate-600 to-slate-800",
    subcategories: [
      { 
        id: 301, 
        name: "Tool Making", 
        description: "Custom tool forging", 
        distance: 1.8, 
        location: "Waghodia Road",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
      },
      { 
        id: 302, 
        name: "Gate Repair", 
        description: "Metal gate services", 
        distance: 0.7, 
        location: "Nizampura",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
      },
      { 
        id: 303, 
        name: "Key Making", 
        description: "Duplicate keys & locks", 
        distance: 1.1, 
        location: "Subhanpura",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop"
      }
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
    color: "from-emerald-500 to-teal-500",
    subcategories: [
      { 
        id: 401, 
        name: "Academic Books", 
        description: "Educational textbooks", 
        distance: 0.6, 
        location: "University Road",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
      },
      { 
        id: 402, 
        name: "Fiction & Novels", 
        description: "Stories and literature", 
        distance: 2.3, 
        location: "Productivity Road",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"
      },
      { 
        id: 403, 
        name: "Stationery", 
        description: "Pens, notebooks & supplies", 
        distance: 0.4, 
        location: "Sayajigunj",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
      },
      { 
        id: 404, 
        name: "Children's Books", 
        description: "Books for kids", 
        distance: 1.6, 
        location: "Sama",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
      }
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
    color: "from-rose-500 to-pink-500",
    subcategories: [
      { 
        id: 501, 
        name: "Veg Restaurant", 
        description: "Pure vegetarian cuisine", 
        distance: 0.2, 
        location: "Alkapuri",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
      },
      { 
        id: 502, 
        name: "Non-Veg Restaurant", 
        description: "Meat and seafood dishes", 
        distance: 1.4, 
        location: "Fatehgunj",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"
      },
      { 
        id: 503, 
        name: "Fast Food", 
        description: "Quick bites and snacks", 
        distance: 0.8, 
        location: "Sayajigunj",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
      },
      { 
        id: 504, 
        name: "Bakery & Cafe", 
        description: "Fresh baked goods & coffee", 
        distance: 1.0, 
        location: "RC Dutt Road",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop"
      },
      { 
        id: 505, 
        name: "Street Food", 
        description: "Local street delicacies", 
        distance: 0.5, 
        location: "Mandvi",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"
      },
      { 
        id: 506, 
        name: "Fine Dining", 
        description: "Premium restaurant experience", 
        distance: 2.5, 
        location: "VIP Road",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
      }
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
    color: "from-lime-500 to-green-500",
    subcategories: [
      { 
        id: 601, 
        name: "Garden Maintenance", 
        description: "Regular garden care", 
        distance: 1.3, 
        location: "Gotri",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
      },
      { 
        id: 602, 
        name: "Plant Installation", 
        description: "New plant setup", 
        distance: 0.9, 
        location: "Manjalpur",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop"
      },
      { 
        id: 603, 
        name: "Lawn Care", 
        description: "Grass cutting & maintenance", 
        distance: 1.7, 
        location: "New VIP Road",
        image: "https://images.unsplash.com/photo-1558904541-efa843a96239?w=400&h=300&fit=crop"
      },
      { 
        id: 604, 
        name: "Landscaping", 
        description: "Garden design services", 
        distance: 2.0, 
        location: "Vasna",
        image: "https://images.unsplash.com/photo-1558904541-efa843a96239?w=400&h=300&fit=crop"
      }
    ]
  }
];

// Utility Components
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
      className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeStyles[type]} shadow-xl backdrop-blur-sm z-10`}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
    >
      <IconComponent className="w-3 h-3" />
      {type}
    </motion.div>
  );
};

const TypeBadge = ({ type }) => (
  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
    type === 'service' 
      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }`}>
    {type === 'service' ? 'Service' : 'Product'}
  </div>
);

// Search Input Component
const SearchInput = ({ 
  searchTerm, 
  setSearchTerm, 
  suggestions, 
  showSuggestions, 
  setShowSuggestions, 
  onSuggestionClick 
}) => (
  <div className="relative flex-1 max-w-2xl">
    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
    <input
      type="text"
      placeholder="Search services and products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      className="w-full pl-14 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400 font-medium transition-all duration-300 shadow-lg"
    />
    {searchTerm && (
      <button
        onClick={() => {
          setSearchTerm('');
          setShowSuggestions(false);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}
    
    {showSuggestions && suggestions.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl z-50"
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 font-medium">{suggestion}</span>
            </div>
          </button>
        ))}
      </motion.div>
    )}
  </div>
);

// Filter Dropdown Component
const FilterDropdown = ({ filterType, setFilterType, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const filterOptions = [
    { value: 'all', label: 'All Badges', icon: Filter },
    { value: 'popular', label: 'Popular', icon: Users },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'new', label: 'New', icon: Zap },
    { value: 'top-rated', label: 'Top Rated', icon: Award }
  ];
  
  const currentFilter = filterOptions.find(opt => opt.value === filterType);
  const CurrentIcon = currentFilter?.icon || Filter;
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200 rounded-2xl hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-slate-700 transition-all duration-300 shadow-lg min-w-[180px]"
      >
        <CurrentIcon className="w-5 h-5" />
        <span>{currentFilter?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
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
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                    filterType === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {filterType === option.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
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

// Hover Effect Card Components
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
      className={`relative group block p-2 h-full w-full ${className}`}
      onMouseEnter={() => setHoveredIndex(0)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => onClick(category)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {hoveredIndex === 0 && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-white/80 backdrop-blur-sm block rounded-3xl shadow-2xl border border-slate-200"
            layoutId={`hoverBackground-${category.id}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      
      <div className="rounded-3xl h-full w-full p-6 overflow-hidden bg-white/60 backdrop-blur-sm border border-slate-200 group-hover:border-slate-300 relative z-20 shadow-lg">
        {category.badge && <Badge type={category.badge} />}
        
        {/* Action buttons */}
        <div className="absolute top-4 left-4 flex gap-2 z-30">
          <motion.button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'bg-white/80 border-slate-200 text-slate-600 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
              isSaved 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white/80 border-slate-200 text-slate-600 hover:text-blue-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
        
        <div className="relative z-50 mt-8">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
              whileHover={{ rotate: [0, -8, 8, -4, 4, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <IconComponent className="w-7 h-7 text-white" />
            </motion.div>
            <TypeBadge type={category.type} />
          </div>
          
          <h3 className="text-slate-900 font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {category.name}
          </h3>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {category.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-700">{category.rating}</span>
              <span className="text-slate-400">•</span>
              <span>{category.views.toLocaleString()} views</span>
            </div>
            
            {category.subcategories && (
              <div className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded-full">
                {category.subcategories.length} options
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
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
      className="bg-white/70 backdrop-blur-sm rounded-2xl cursor-pointer group border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(subcategory)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={subcategory.image}
          alt={subcategory.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          <motion.button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'bg-white/90 border-white/50 text-slate-600 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
              isSaved 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white/90 border-white/50 text-slate-600 hover:text-blue-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Distance badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 text-white text-sm bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{subcategory.distance}km</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">
            {subcategory.name}
          </h4>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {subcategory.description}
        </p>
        
        <div className="flex items-center text-sm text-slate-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">{subcategory.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Skeleton
const CategorySkeleton = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg animate-pulse border border-slate-200">
    <div className="flex justify-between mb-4">
      <div className="w-14 h-14 bg-slate-300 rounded-2xl"></div>
      <div className="w-20 h-6 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="h-6 bg-slate-300 rounded-lg mb-3 w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded-lg w-full mb-2"></div>
    <div className="h-4 bg-slate-200 rounded-lg w-2/3 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-slate-200 rounded-lg w-24"></div>
      <div className="h-4 bg-slate-200 rounded-lg w-16"></div>
    </div>
  </div>
);

// Main Components
const CategoriesPage = ({ onCategoryClick }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [categoryType, setCategoryType] = useState('all');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      
      categories.forEach(category => {
        if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          newSuggestions.add(category.name);
        }
        
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

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (categoryType !== 'all') {
      filtered = filtered.filter(cat => cat.type === categoryType);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }

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

  const serviceCount = categories.filter(cat => cat.type === 'service').length;
  const productCount = categories.filter(cat => cat.type === 'product').length;

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen w-full relative font-inter">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
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
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
              Discover Services
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Find the best local services and products in your area
            </p>
            
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{serviceCount}</div>
                <div className="text-sm text-slate-500 font-medium">Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{productCount}</div>
                <div className="text-sm text-slate-500 font-medium">Products</div>
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
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-slate-200">
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
                        ? 'bg-white text-slate-900 shadow-lg border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
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
                <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-14 pr-10 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 appearance-none cursor-pointer min-w-[200px] font-medium text-slate-700 transition-all duration-300"
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
            className="text-3xl font-bold text-slate-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchTerm || filterType !== 'all' || categoryType !== 'all' ? (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        onClick={onCategoryClick}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    No categories found
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or filter criteria
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
        </div>
      </div>
    </div>
  );
};

const SubcategoryPage = ({ category, onBack, onSubcategoryClick }) => {
  const [sortBy, setSortBy] = useState('distance');
  const IconComponent = category.icon;

  const sortedSubcategories = useMemo(() => {
    if (!category.subcategories) return [];
    
    const sorted = [...category.subcategories].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [category.subcategories, sortBy]);

  return (
    <div className="min-h-screen w-full relative font-inter">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
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
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-300"
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
            className="text-center mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center shadow-xl`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <IconComponent className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {category.name}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sortedSubcategories.length}</div>
                <div className="text-sm text-slate-500 font-medium">Available Options</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{category.rating}</div>
                <div className="text-sm text-slate-500 font-medium">Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Sort Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 border border-slate-200">
              <motion.button
                onClick={() => setSortBy('distance')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 text-sm ${
                  sortBy === 'distance'
                    ? 'bg-white text-slate-900 shadow-lg border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-4 h-4" />
                By Distance
              </motion.button>
              <motion.button
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 text-sm ${
                  sortBy === 'name'
                    ? 'bg-white text-slate-900 shadow-lg border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tag className="w-4 h-4" />
                By Name
              </motion.button>
            </div>
          </motion.div>

          {/* Subcategories Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {sortedSubcategories.map((subcategory, index) => (
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

          {/* Distance Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-blue-50/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Distance Information</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Distances are calculated from your current location in Vadodara, Gujarat. 
              The closest options are shown first to help you find the most convenient services.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const CategoryApp = () => {
  const [currentPage, setCurrentPage] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage('subcategory');
  };

  const handleBackToCategories = () => {
    setCurrentPage('categories');
    setSelectedCategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log('Selected subcategory:', subcategory);
    // Here you would typically navigate to a detail page or perform some action
    alert(`You selected: ${subcategory.name} at ${subcategory.location}`);
  };

  return (
    <div className="font-inter antialiased">
      <AnimatePresence mode="wait">
        {currentPage === 'categories' && (
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
        
        {currentPage === 'subcategory' && selectedCategory && (
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