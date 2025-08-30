import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Play,
  Users,
  Store,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Heart,
  Clock,
  Phone,
  TrendingUp,
  Zap,
  Shield,
  Award,
  Search,
  Verified,
  ThumbsUp,
  Gauge,
  Calendar,
  MessageCircle,
  Bookmark,
  Pause,
} from "lucide-react";
import { StylingHomePageBackground } from "../../components/CustomAnimation";
import { ParticleSystem } from "../../components/GsapAnimation";

// Mock data
const mockSlides = [
  {
    title: "Discover Local Businesses",
    subtitle: "Find the best services and shops in your neighborhood with our AI-powered platform",
    features: ["Verified Reviews", "Instant Booking", "Local Focus"],
    image: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=1920&h=1080&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    title: "Connect With Your Community", 
    subtitle: "Support local entrepreneurs and discover hidden gems in your area",
    features: ["Community Driven", "Local Support", "Quality Service"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    title: "Seamless Experience",
    subtitle: "Book appointments, make reservations, and discover services effortlessly",
    features: ["Easy Booking", "Real-time Updates", "Secure Payments"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  }
];

const mockBusinessList = [
  {
    _id: "1",
    businessName: "Artisan Coffee House",
    categoryOfBusiness: "Café & Restaurant",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 124,
    distance: "0.5 km",
    price: "₹₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 1 hour",
    isVerified: true,
    specialOffer: "20% OFF"
  },
  {
    _id: "2", 
    businessName: "Urban Fitness Studio",
    categoryOfBusiness: "Fitness & Wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 89,
    distance: "1.2 km",
    price: "₹₹₹",
    isOpen: false,
    nextAvailable: "Tomorrow",
    responseTime: "< 30 min",
    isVerified: true
  },
  {
    _id: "3",
    businessName: "Tech Repair Hub",
    categoryOfBusiness: "Electronics & Repair",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 156,
    distance: "2.1 km", 
    price: "₹₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 2 hours",
    isVerified: true
  },
  {
    _id: "4",
    businessName: "Fresh Market Deli",
    categoryOfBusiness: "Grocery & Food",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 203,
    distance: "0.8 km",
    price: "₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 15 min",
    isVerified: false,
    specialOffer: "Free Delivery"
  }
];

const mockRecommendations = [
  {
    ...mockBusinessList[0],
    matchScore: 92
  },
  {
    ...mockBusinessList[1], 
    matchScore: 88
  },
  {
    ...mockBusinessList[2],
    matchScore: 85
  }
];

// Optimized Button Component
const GradientButton = React.memo(({ 
  children, 
  className = "", 
  variant = "primary", 
  loading = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 hover:shadow-xl transform hover:scale-105",
    secondary: "bg-white text-black border-2 border-black hover:bg-black hover:text-white transform hover:scale-105",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transform hover:scale-105",
    ghost: "bg-gray-100 text-gray-800 hover:bg-gray-200 transform hover:scale-105"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
});

// Enhanced Business Card Component
const BusinessCard = React.memo(({ business, showMatchScore = false, onLike, onSave, isLiked, isSaved }) => (
  <div className="group relative">
    <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 transform hover:scale-105">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={business.image}
          alt={business.businessName}
          className="w-full h-40 sm:h-48 md:h-52 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        {/* Top badges row */}
        <div className="absolute top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {business.isVerified && (
              <div className="bg-black/80 backdrop-blur-sm text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Verified size={10} />
                Verified
              </div>
            )}
            {showMatchScore && business.matchScore && (
              <div className="bg-green-600/90 backdrop-blur-sm text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                {business.matchScore}% Match
              </div>
            )}
          </div>

          {business.specialOffer && (
            <div className="bg-red-600/90 backdrop-blur-sm text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
              {business.specialOffer}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 flex gap-2">
          <button
            onClick={() => onSave?.(business._id)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              isSaved
                ? "bg-blue-600 text-white"
                : "bg-white/90 text-gray-700 hover:bg-blue-600 hover:text-white"
            } shadow-lg transform hover:scale-110`}
          >
            <Bookmark
              size={12}
              className={isSaved ? "fill-current" : ""}
            />
          </button>

          <button
            onClick={() => onLike?.(business._id)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              isLiked
                ? "bg-red-600 text-white"
                : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white"
            } shadow-lg transform hover:scale-110`}
          >
            <Heart
              size={12}
              className={isLiked ? "fill-current" : ""}
            />
          </button>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-3 md:p-5">
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
              {business.businessName}
            </h3>

            <p className="text-gray-600 text-sm flex items-center gap-2 mb-2">
              <ShoppingBag size={12} className="text-gray-400" />
              {business.categoryOfBusiness}
            </p>
          </div>

          <div className="text-gray-500 text-sm font-medium">
            {business.price}
          </div>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(business.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-gray-600 font-medium">
              {business.rating} ({business.reviews})
            </span>
          </div>

          <div className="flex items-center text-xs md:text-sm text-gray-500 gap-1">
            <MapPin size={10} />
            {business.distance}
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div
            className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
              business.isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <Clock size={10} />
            {business.isOpen ? "Open Now" : "Closed"}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={10} />
            {business.nextAvailable}
          </div>
        </div>

        {/* Response time */}
        <div className="mb-3 md:mb-4 px-2 md:px-3 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <MessageCircle size={12} />
              Response Time
            </span>
            <span className="font-medium text-gray-900">
              {business.responseTime}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-black text-white py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base transform hover:scale-105">
            View Details
            <ArrowRight size={14} />
          </button>

          <button className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 transform hover:scale-105">
            <MessageCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  </div>
));

// Modern Video Player Component
const ModernVideoPlayer = React.memo(({ src, poster, className = "" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.play();
      setIsPlaying(true);
    }
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={isMuted}
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button
          onClick={toggleMute}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
        >
          <span className="text-xs font-bold">{isMuted ? 'M' : 'U'}</span>
        </button>
      </div>
    </div>
  );
});

// Animated Background Components
const AnimatedBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ))}
    
    {/* Geometric shapes */}
    <div className="absolute top-20 left-10 w-20 h-20 border border-white/10 rounded-full animate-spin opacity-30"
         style={{ animationDuration: '20s' }} />
    <div className="absolute bottom-20 right-20 w-16 h-16 border border-white/10 rotate-45 animate-pulse opacity-30" />
    <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-bounce opacity-50"
         style={{ animationDuration: '4s' }} />
  </div>
));

const StunningLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedBusinesses, setLikedBusinesses] = useState(new Set());
  const [savedBusinesses, setSavedBusinesses] = useState(new Set());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-advance slider with optimization
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = useCallback((businessId) => {
    setLikedBusinesses(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(businessId)) {
        newLiked.delete(businessId);
      } else {
        newLiked.add(businessId);
      }
      return newLiked;
    });
  }, []);

  const handleSave = useCallback((businessId) => {
    setSavedBusinesses(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(businessId)) {
        newSaved.delete(businessId);
      } else {
        newSaved.add(businessId);
      }
      return newSaved;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);
  }, []);

  return (
    <>
    <StylingHomePageBackground/>
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      {/* Hero Section with Video Background */}
      <div className="relative h-screen overflow-hidden">
        <AnimatedBackground />
        
        {/* Background Video */}
        <div className="absolute inset-0">
          <ModernVideoPlayer
            src={mockSlides[currentSlide].video}
            poster={mockSlides[currentSlide].image}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-full text-white px-4">
          <div className="text-center max-w-6xl">
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium"
                   style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Sparkles size={14} className="text-yellow-400" />
                New Platform Launch
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 md:mb-6 leading-tight">
              {mockSlides[currentSlide].title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/95 font-light max-w-4xl mx-auto">
              {mockSlides[currentSlide].subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
              {mockSlides[currentSlide].features.map((feature, index) => (
                <div
                  key={feature}
                  className="px-4 md:px-6 py-2 md:py-3 rounded-full border transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <span className="text-white/95 font-medium text-sm md:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <GradientButton variant="secondary">
                <Search size={16} />
                Explore Now
              </GradientButton>

              <GradientButton variant="outline">
                <Store size={16} />
                Become a Seller
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={nextSlide}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {mockSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 md:w-12 h-2 md:h-3 bg-white"
                  : "w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Trusted by Thousands
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
              Join our growing community of businesses and customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: Store,
                number: "5,000+",
                label: "Verified Businesses",
                color: "#3b82f6",
              },
              {
                icon: Users,
                number: "100K+",
                label: "Happy Customers", 
                color: "#10b981",
              },
              {
                icon: MapPin,
                number: "250+",
                label: "Cities Covered",
                color: "#8b5cf6",
              },
              {
                icon: Award,
                number: "4.9★",
                label: "Average Rating",
                color: "#f59e0b",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg border transform hover:scale-105 transition-all duration-300"
                style={{ borderColor: '#e5e7eb' }}
              >
                <div
                  className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: stat.color }}
                >
                  <stat.icon size={24} className="md:hidden" />
                  <stat.icon size={36} className="hidden md:block" />
                </div>

                <div className="text-2xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-2" style={{ color: '#1f2937' }}>
                  {stat.number}
                </div>

                <div className="text-sm md:text-lg font-semibold" style={{ color: '#6b7280' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-12 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium mb-4 md:mb-6"
                 style={{ backgroundColor: '#f3f4f6', borderColor: '#d1d5db' }}>
              <Play size={14} style={{ color: '#6b7280' }} />
              Watch Our Story
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6" style={{ color: '#1f2937' }}>
              Experience the Future
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto font-light" style={{ color: '#6b7280' }}>
              See how our platform revolutionizes local business discovery
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl"
                 style={{ borderColor: '#e5e7eb' }}>
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <ModernVideoPlayer
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  poster="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=675&fit=crop"
                  className="w-full h-full"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-4 md:p-6">
                  <div className="text-white text-center">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Platform Overview
                    </h3>
                    <p className="text-white/80 text-sm md:text-base">
                      Discover how businesses and customers connect seamlessly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Recommendations Section */}
      <div className="py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style={{ color: '#1f2937' }}>
              Recommended for You
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#6b7280' }}>
              Discover handpicked businesses that match your preferences and needs
            </p>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {mockRecommendations.map((business, index) => (
              <div key={business._id}>
                <BusinessCard 
                  business={business} 
                  showMatchScore={true}
                  onLike={handleLike}
                  onSave={handleSave}
                  isLiked={likedBusinesses.has(business._id)}
                  isSaved={savedBusinesses.has(business._id)}
                />
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border max-w-2xl mx-auto" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4" style={{ color: '#1f2937' }}>
                Discover More Businesses
              </h3>
              <p className="mb-4 md:mb-6" style={{ color: '#6b7280' }}>
                Explore our complete directory of verified local businesses in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton variant="primary">
                  <Search size={20} />
                  View All Recommendations
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Listings */}
      <div className="py-12 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style={{ color: '#1f2937' }}>
              Explore All Businesses
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#6b7280' }}>
              Discover amazing local services and businesses in your area with verified reviews and instant booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
            {mockBusinessList.map((business, index) => (
              <div key={business._id}>
                <BusinessCard 
                  business={business}
                  onLike={handleLike}
                  onSave={handleSave}
                  isLiked={likedBusinesses.has(business._id)}
                  isSaved={savedBusinesses.has(business._id)}
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <GradientButton variant="primary">
              <Store size={20} />
              View All Categories
            </GradientButton>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-20 bg-black relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium text-white mb-4 md:mb-6"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Award size={16} />
              Premium Features
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Why Choose Us?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of local business discovery with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Find and book services in seconds with our smart search engine and recommendations.",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "Your data and transactions are protected with bank-level security and encrypted payments.",
                gradient: "from-green-400 to-blue-500",
              },
              {
                icon: Gauge,
                title: "Real-time Updates",
                description: "Get instant notifications about availability, confirmations, and business updates.",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: Award,
                title: "Quality Guaranteed",
                description: "All businesses are verified and rated by real customers with authentic reviews.",
                gradient: "from-blue-400 to-indigo-500",
              },
              {
                icon: ThumbsUp,
                title: "Customer First",
                description: "24/7 support and money-back guarantee for complete peace of mind.",
                gradient: "from-pink-400 to-red-500",
              },
              {
                icon: TrendingUp,
                title: "Growth Partner",
                description: "Help local businesses grow with powerful analytics, insights, and marketing tools.",
                gradient: "from-indigo-400 to-purple-500",
              },
            ].map((feature, index) => (
              <div key={index}>
                <div className="h-full text-center p-4 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 transform hover:scale-105"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div
                    className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-r ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl`}
                  >
                    <feature.icon size={24} className="md:hidden" />
                    <feature.icon size={32} className="hidden md:block" />
                  </div>

                  <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <ParticleSystem particles={500} speed={50} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 md:mb-8">
                <Store size={60} className="mx-auto mb-4 md:mb-6" style={{ color: '#1f2937' }} />
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: '#1f2937' }}>
                Ready to Transform Your Business?
              </h2>

              <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto" style={{ color: '#6b7280' }}>
                Join thousands of successful businesses and reach more customers in your local area
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12">
                <GradientButton variant="primary">
                  <Store size={20} />
                  Start Selling Today
                </GradientButton>

                <GradientButton variant="secondary">
                  <Phone size={20} />
                  Contact Our Team
                </GradientButton>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8" style={{ color: '#6b7280' }}>
                {[
                  { icon: Verified, text: "Verified Platform" },
                  { icon: Shield, text: "Secure & Safe" },
                  { icon: Award, text: "Award Winning" },
                  { icon: Users, text: "100K+ Users" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-full shadow-sm border transform hover:scale-105 transition-all duration-300"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <item.icon size={16} style={{ color: '#374151' }} />
                    <span className="font-medium text-sm md:text-base">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              What Our Community Says
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
            >
              Real stories from real people in your neighborhood
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Miguel Rodriguez",
                role: "Restaurant Owner",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
                quote: "Since joining LocalConnect, our customer base has grown by 40%. The platform brings us customers who truly appreciate local dining and return regularly.",
                rating: 5
              },
              {
                name: "Priya Patel", 
                role: "Community Advocate",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
                quote: "I love seeing the real economic impact my spending has on my community. The local impact tracker shows exactly how my choices support neighborhood jobs and growth.",
                rating: 5
              },
              {
                name: "Lisa Chang",
                role: "Salon Owner",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
                quote: "LocalConnect has helped us reach customers we never would have found otherwise. The quality of bookings and customer loyalty has been incredible.",
                rating: 5
              },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{ 
                  backgroundColor: '#fff',
                  border: `1px solid $fff` 
                }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm"
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                <p 
                  className="leading-relaxed italic"
                >
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
    </>
  );
};

export default StunningLandingPage;







// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Star,
//   Play,
//   Users,
//   Store,
//   ShoppingBag,
//   ArrowRight,
//   Sparkles,
//   Heart,
//   Clock,
//   Phone,
//   TrendingUp,
//   Zap,
//   Shield,
//   Award,
//   Search,
//   Verified,
//   ThumbsUp,
//   Gauge,
//   Calendar,
//   MessageCircle,
//   Bookmark,
// } from "lucide-react";
// import {
//   GeometricShapes,
//   MovingDots,
//   MovingLines,
//   MovingSnakes,
//   StylingHomePageBackground
// } from "../../components/CustomAnimation";
// import {
//   mockBusinessList,
//   mockRecommendations,
//   mockSlides,
// } from "../../constants/Home";




// const GlassCard = ({ children, className = "", hover = false, ...props }) => (
//   <div
//     className={`bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl transition-all duration-300 ${className}`}
//     {...props}
//   >
//     {children}
//   </div>
// );

// const GradientButton = ({
//   children,
//   className = "",
//   variant = "primary",
//   loading = false,
//   ...props
// }) => {
//   const baseClasses =
//     "px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
//   const variants = {
//     primary: "bg-black text-white hover:bg-gray-800 hover:shadow-xl",
//     secondary:
//       "bg-white text-black border-2 border-black hover:bg-black hover:text-white",
//     outline:
//       "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black",
//     ghost: "bg-gray-100 text-gray-800 hover:bg-gray-200",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant]} ${className}`}
//       disabled={loading}
//       {...props}
//     >
//       {loading ? (
//         <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
//       ) : (
//         children
//       )}
//     </button>
//   );
// };

// const StunningLandingPage = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [likedBusinesses, setLikedBusinesses] = useState(new Set());
//   const [savedBusinesses, setSavedBusinesses] = useState(new Set());

//   // Auto-advance slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLike = (businessId) => {
//     const newLiked = new Set(likedBusinesses);
//     if (newLiked.has(businessId)) {
//       newLiked.delete(businessId);
//     } else {
//       newLiked.add(businessId);
//     }
//     setLikedBusinesses(newLiked);
//   };

//   const handleSave = (businessId) => {
//     const newSaved = new Set(savedBusinesses);
//     if (newSaved.has(businessId)) {
//       newSaved.delete(businessId);
//     } else {
//       newSaved.add(businessId);
//     }
//     setSavedBusinesses(newSaved);
//   };

//   // Enhanced Business Card Component
//   const BusinessCard = ({ business, showMatchScore = false }) => (
//     <div className="group relative">
//       <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
//         {/* Image Container */}
//         <div className="relative overflow-hidden">
//           <img
//             src={business.image}
//             alt={business.businessName}
//             className="w-full h-52 object-cover"
//           />

//           {/* Top badges row */}
//           <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
//             <div className="flex flex-col gap-2">
//               {business.isVerified && (
//                 <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                   <Verified size={10} />
//                   Verified
//                 </div>
//               )}
//               {showMatchScore && business.matchScore && (
//                 <div className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
//                   {business.matchScore}% Match
//                 </div>
//               )}
//             </div>

//             {business.specialOffer && (
//               <div className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
//                 {business.specialOffer}
//               </div>
//             )}
//           </div>

//           {/* Action buttons */}
//           <div className="absolute bottom-3 right-3 flex gap-2">
//             <button
//               onClick={() => handleSave(business._id)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
//                 savedBusinesses.has(business._id)
//                   ? "bg-blue-600 text-white"
//                   : "bg-white/90 text-gray-700 hover:bg-blue-600 hover:text-white"
//               } shadow-lg`}
//             >
//               <Bookmark
//                 size={14}
//                 className={
//                   savedBusinesses.has(business._id) ? "fill-current" : ""
//                 }
//               />
//             </button>

//             <button
//               onClick={() => handleLike(business._id)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
//                 likedBusinesses.has(business._id)
//                   ? "bg-red-600 text-white"
//                   : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white"
//               } shadow-lg`}
//             >
//               <Heart
//                 size={14}
//                 className={
//                   likedBusinesses.has(business._id) ? "fill-current" : ""
//                 }
//               />
//             </button>
//           </div>
//         </div>

//         {/* Enhanced Content */}
//         <div className="p-5">
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
//                 {business.businessName}
//               </h3>

//               <p className="text-gray-600 text-sm flex items-center gap-2 mb-2">
//                 <ShoppingBag size={12} className="text-gray-400" />
//                 {business.categoryOfBusiness}
//               </p>
//             </div>

//             <div className="text-gray-500 text-sm font-medium">
//               {business.price}
//             </div>
//           </div>

//           {/* Rating and reviews */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={14}
//                     className={
//                       i < Math.floor(business.rating)
//                         ? "text-yellow-400 fill-current"
//                         : "text-gray-300"
//                     }
//                   />
//                 ))}
//               </div>
//               <span className="text-sm text-gray-600 font-medium">
//                 {business.rating} ({business.reviews})
//               </span>
//             </div>

//             <div className="flex items-center text-sm text-gray-500 gap-1">
//               <MapPin size={12} />
//               {business.distance}
//             </div>
//           </div>

//           {/* Status row */}
//           <div className="flex items-center justify-between mb-4">
//             <div
//               className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                 business.isOpen
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               <Clock size={10} />
//               {business.isOpen ? "Open Now" : "Closed"}
//             </div>

//             <div className="text-xs text-gray-500 flex items-center gap-1">
//               <Calendar size={10} />
//               {business.nextAvailable}
//             </div>
//           </div>

//           {/* Response time */}
//           <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-600 flex items-center gap-1">
//                 <MessageCircle size={12} />
//                 Response Time
//               </span>
//               <span className="font-medium text-gray-900">
//                 {business.responseTime}
//               </span>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-2">
//             <button className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2">
//               View Details
//               <ArrowRight size={14} />
//             </button>

//             <button className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//               <MessageCircle size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <StylingHomePageBackground />
//       <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">

//         <div className="relative h-screen overflow-hidden">
//           <MovingDots density={520} speed={100} />
//           <GeometricShapes />

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentSlide}
//               initial={{ opacity: 0, scale: 1.02 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.98 }}
//               transition={{ duration: 1.5, ease: "easeInOut" }}
//               className="absolute inset-0"
//               style={{
//                 backgroundImage: `url(${mockSlides[currentSlide].image})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
//             </motion.div>
//           </AnimatePresence>

//           {/* Hero Content */}
//           <div className="relative z-10 flex items-center justify-center min-h-full text-white px-4">
//             <div className="text-center max-w-6xl">
//               <motion.div
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.2, duration: 0.8 }}
//                 className="mb-6"
//               >
//                 <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-medium">
//                   <Sparkles size={16} className="text-yellow-400" />
//                   New Platform Launch
//                 </div>
//               </motion.div>

//               <motion.h1
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
//                 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight"
//               >
//                 {mockSlides[currentSlide].title}
//               </motion.h1>

//               <motion.p
//                 initial={{ y: 40, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
//                 className="text-lg md:text-xl lg:text-2xl mb-8 text-white/95 font-light max-w-4xl mx-auto"
//               >
//                 {mockSlides[currentSlide].subtitle}
//               </motion.p>

//               {/* Feature Pills */}
//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.9, duration: 1 }}
//                 className="flex flex-wrap justify-center gap-4 mb-12"
//               >
//                 {mockSlides[currentSlide].features.map((feature, index) => (
//                   <motion.div
//                     key={feature}
//                     initial={{ opacity: 0, scale: 0.8, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
//                   >
//                     <GlassCard className="px-6 py-3 hover:bg-white/20">
//                       <span className="text-white/95 font-medium">
//                         {feature}
//                       </span>
//                     </GlassCard>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               {/* CTA Buttons */}
//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 1.3, duration: 1 }}
//                 className="flex flex-col md:flex-row gap-6 justify-center items-center"
//               >
//                 <GradientButton variant="secondary">
//                   <Search size={20} />
//                   Explore Now
//                 </GradientButton>

//                 <GradientButton variant="outline">
//                   <Store size={20} />
//                   Become a Seller
//                 </GradientButton>
//               </motion.div>
//             </div>
//           </div>

//           {/* Slider Controls */}
//           <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20">
//             <button
//               onClick={() =>
//                 setCurrentSlide(
//                   (prev) => (prev - 1 + mockSlides.length) % mockSlides.length
//                 )
//               }
//               className="w-14 h-14 bg-black/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300"
//             >
//               <ChevronLeft size={24} />
//             </button>
//           </div>

//           <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20">
//             <button
//               onClick={() =>
//                 setCurrentSlide((prev) => (prev + 1) % mockSlides.length)
//               }
//               className="w-14 h-14 bg-black/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>

//           {/* Slider Indicators */}
//           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//             {mockSlides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`transition-all duration-300 rounded-full ${
//                   index === currentSlide
//                     ? "w-12 h-3 bg-white"
//                     : "w-3 h-3 bg-white/50 hover:bg-white/75"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
//           <MovingLines count={8} />
//           <GeometricShapes />

//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
//                 Trusted by Thousands
//               </h2>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 Join our growing community of businesses and customers
//               </p>
//             </motion.div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {[
//                 {
//                   icon: Store,
//                   number: "5,000+",
//                   label: "Verified Businesses",
//                   color: "bg-blue-500",
//                 },
//                 {
//                   icon: Users,
//                   number: "100K+",
//                   label: "Happy Customers",
//                   color: "bg-green-500",
//                 },
//                 {
//                   icon: MapPin,
//                   number: "250+",
//                   label: "Cities Covered",
//                   color: "bg-purple-500",
//                 },
//                 {
//                   icon: Award,
//                   number: "4.9★",
//                   label: "Average Rating",
//                   color: "bg-yellow-500",
//                 },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50, scale: 0.8 }}
//                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                   transition={{ delay: index * 0.15, duration: 0.8 }}
//                   viewport={{ once: true }}
//                 >
//                   <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-200">
//                     <div
//                       className={`w-20 h-20 mx-auto mb-6 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
//                     >
//                       <stat.icon size={36} />
//                     </div>

//                     <div className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
//                       {stat.number}
//                     </div>

//                     <div className="text-gray-600 font-semibold text-lg">
//                       {stat.label}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Video Section */}
//         <div className="py-20 bg-white relative overflow-hidden">
//           <MovingSnakes count={100} />
//           <MovingDots density={1500} speed={100} count={1000} />

//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border text-sm font-medium mb-6">
//                 <Play size={16} className="text-gray-600" />
//                 Watch Our Story
//               </div>

//               <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
//                 Experience the Future
//               </h2>
//               <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light">
//                 See how our platform revolutionizes local business discovery
//               </p>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 1.2 }}
//               viewport={{ once: true }}
//               className="max-w-6xl mx-auto"
//             >
//               <div className="relative bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
//                 <div className="aspect-video bg-black flex items-center justify-center relative">
//                   {!isVideoPlaying ? (
//                     <>
//                       <img
//                         src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=675&fit=crop"
//                         alt="Platform demo"
//                         className="absolute inset-0 w-full h-full object-cover opacity-70"
//                       />

//                       <button
//                         onClick={() => setIsVideoPlaying(true)}
//                         className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-2xl"
//                       >
//                         <Play size={40} className="ml-1" />
//                       </button>

//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
//                     </>
//                   ) : (
//                     <iframe
//                       width="100%"
//                       height="100%"
//                       src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
//                       title="Platform Demo Video"
//                       frameBorder="0"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                       className="absolute inset-0"
//                     ></iframe>
//                   )}
//                 </div>

//                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-6">
//                   <div className="text-white text-center">
//                     <h3 className="text-xl font-semibold mb-2">
//                       Platform Overview
//                     </h3>
//                     <p className="text-white/80">
//                       Discover how businesses and customers connect seamlessly
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Recommendations Section */}
//         <div className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
//           <MovingDots density={1500} speed={100} count={1000} />
//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//                 Recommended for You
//               </h2>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                 Discover handpicked businesses that match your preferences and
//                 needs
//               </p>
//             </motion.div>

//             {/* Recommendations Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//               {mockRecommendations.map((business, index) => (
//                 <motion.div
//                   key={business._id}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, duration: 0.6 }}
//                   viewport={{ once: true }}
//                 >
//                   <BusinessCard business={business} showMatchScore={true} />
//                 </motion.div>
//               ))}
//             </div>

//             {/* CTA Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center"
//             >
//               <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                   Discover More Businesses
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Explore our complete directory of verified local businesses in
//                   your area.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <GradientButton variant="primary">
//                     <Search size={20} />
//                     View All Recommendations
//                   </GradientButton>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Business Listings */}
//         <div className="py-20 bg-white relative overflow-hidden">
//           <MovingDots density={150} speed={100} count={500} />

//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//                 Explore All Businesses
//               </h2>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                 Discover amazing local services and businesses in your area with
//                 verified reviews and instant booking
//               </p>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
//               {mockBusinessList.map((business, index) => (
//                 <motion.div
//                   key={business._id}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, duration: 0.6 }}
//                   viewport={{ once: true }}
//                 >
//                   <BusinessCard business={business} />
//                 </motion.div>
//               ))}
//             </div>

//             <div className="text-center">
//               <GradientButton variant="primary">
//                 <Store size={20} />
//                 View All Categories
//               </GradientButton>
//             </div>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="py-20 bg-black relative overflow-hidden">
//           <MovingLines count={12} />
//           <MovingSnakes count={6} />

//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-white mb-6">
//                 <Award size={16} />
//                 Premium Features
//               </div>

//               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//                 Why Choose Us?
//               </h2>
//               <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//                 Experience the next generation of local business discovery with
//                 cutting-edge technology
//               </p>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 {
//                   icon: Zap,
//                   title: "Lightning Fast",
//                   description:
//                     "Find and book services in seconds with our smart search engine and recommendations.",
//                   gradient: "from-yellow-400 to-orange-500",
//                 },
//                 {
//                   icon: Shield,
//                   title: "100% Secure",
//                   description:
//                     "Your data and transactions are protected with bank-level security and encrypted payments.",
//                   gradient: "from-green-400 to-blue-500",
//                 },
//                 {
//                   icon: Gauge,
//                   title: "Real-time Updates",
//                   description:
//                     "Get instant notifications about availability, confirmations, and business updates.",
//                   gradient: "from-purple-400 to-pink-500",
//                 },
//                 {
//                   icon: Award,
//                   title: "Quality Guaranteed",
//                   description:
//                     "All businesses are verified and rated by real customers with authentic reviews.",
//                   gradient: "from-blue-400 to-indigo-500",
//                 },
//                 {
//                   icon: ThumbsUp,
//                   title: "Customer First",
//                   description:
//                     "24/7 support and money-back guarantee for complete peace of mind.",
//                   gradient: "from-pink-400 to-red-500",
//                 },
//                 {
//                   icon: TrendingUp,
//                   title: "Growth Partner",
//                   description:
//                     "Help local businesses grow with powerful analytics, insights, and marketing tools.",
//                   gradient: "from-indigo-400 to-purple-500",
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, duration: 0.8 }}
//                   viewport={{ once: true }}
//                 >
//                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full text-center hover:bg-white/10 transition-all duration-300">
//                     <div
//                       className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-2xl`}
//                     >
//                       <feature.icon size={32} />
//                     </div>

//                     <h3 className="text-2xl font-bold text-white mb-4">
//                       {feature.title}
//                     </h3>

//                     <p className="text-gray-300 leading-relaxed">
//                       {feature.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="py-20 bg-gradient-to-br from-gray-100 to-white relative overflow-hidden">
//           <MovingDots density={720} speed={100} />
//           <GeometricShapes />

//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               // initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               // transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center"
//             >
//               <div className="max-w-5xl mx-auto">
//                 <motion.div
//                   // initial={{ y: 30, opacity: 0 }}
//                   whileInView={{ y: 0, opacity: 1 }}
//                   // transition={{ duration: 0.2 }}
//                   className="mb-8"
//                 >
//                   <Store size={80} className="mx-auto mb-6 text-gray-800" />
//                 </motion.div>

//                 <motion.h2
//                   // initial={{ y: 30, opacity: 0 }}
//                   whileInView={{ y: 0, opacity: 1 }}
//                   // transition={{ delay: 0, duration: 0.2 }}
//                   className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight"
//                 >
//                   Ready to Transform Your Business?
//                 </motion.h2>

//                 <motion.p
//                   // initial={{ y: 30, opacity: 0 }}
//                   whileInView={{ y: 0, opacity: 1 }}
//                   // transition={{ delay: 0, duration: 0.2 }}
//                   className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto"
//                 >
//                   Join thousands of successful businesses and reach more
//                   customers in your local area
//                 </motion.p>

//                 <motion.div
//                   // initial={{ y: 30, opacity: 0 }}
//                   whileInView={{ y: 0, opacity: 1 }}
//                   // transition={{ delay: 0, duration: 0.2 }}
//                   className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12"
//                 >
//                   <GradientButton variant="primary">
//                     <Store size={24} />
//                     Start Selling Today
//                   </GradientButton>

//                   <GradientButton variant="secondary">
//                     <Phone size={24} />
//                     Contact Our Team
//                   </GradientButton>
//                 </motion.div>

//                 <motion.div
//                   // initial={{ y: 20, opacity: 0 }}
//                   whileInView={{ y: 0, opacity: 1 }}
//                   // transition={{ delay: 0, duration: 0.2 }}
//                   className="flex flex-wrap justify-center items-center gap-8 text-gray-600"
//                 >
//                   {[
//                     { icon: Verified, text: "Verified Platform" },
//                     { icon: Shield, text: "Secure & Safe" },
//                     { icon: Award, text: "Award Winning" },
//                     { icon: Users, text: "100K+ Users" },
//                   ].map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
//                     >
//                       <item.icon size={20} className="text-gray-700" />
//                       <span className="font-medium">{item.text}</span>
//                     </div>
//                   ))}
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StunningLandingPage;

//?===================================================================

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Star,
//   Play,
//   Users,
//   Store,
//   ShoppingBag,
//   ArrowRight,
//   Sparkles,
//   Heart,
//   Clock,
//   Phone,
//   Mail,
//   TrendingUp,
//   Zap,
//   Shield,
//   Award,
//   Search,
//   Verified,
//   Eye,
//   ThumbsUp,
//   Gauge
// } from 'lucide-react';
// import StylingBackground from '../../components/MovingDots1';
// import { SnakeAnimatedBackground } from '../../components/SnackMovingStyling';

// // Custom styled components with modern aesthetics
// const GlassCard = ({ children, className = '', ...props }) => (
//   <div
//     className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl transition-all duration-300 hover:bg-white/15 hover:shadow-2xl hover:-translate-y-3 ${className}`}
//     {...props}
//   >
//     {children}
//   </div>
// );

// const GradientButton = ({ children, className = '', variant = 'primary', ...props }) => {
//   const baseClasses = "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 shadow-xl";
//   const variants = {
//     primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/25",
//     secondary: "bg-gradient-to-r from-emerald-400 to-cyan-400 text-white hover:shadow-2xl hover:shadow-cyan-400/25",
//     outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800"
//   };

//   return (
//     <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
//       {children}
//     </button>
//   );
// };

// const FloatingElement = ({ size = 80, delay = 0, ...props }) => (
//   <motion.div
//     className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 blur-sm"
//     style={{ width: size, height: size }}
//     animate={{
//       y: [-20, 20, -20],
//       x: [-15, 15, -15],
//       rotate: [0, 180, 360],
//     }}
//     transition={{
//       duration: Math.random() * 3 + 4,
//       repeat: Infinity,
//       ease: "linear",
//       delay
//     }}
//     {...props}
//   />
// );

// // Mock data with enhanced features
// const mockSlides = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
//     title: "Discover Local Businesses",
//     subtitle: "Connect with amazing local services near you",
//     gradient: "from-blue-600 via-purple-600 to-pink-600",
//     features: ["AI-Powered Search", "Real-time Availability", "Instant Booking"]
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
//     title: "Quality Assured Services",
//     subtitle: "Find verified professionals in your area",
//     gradient: "from-pink-500 via-red-500 to-yellow-500",
//     features: ["Verified Reviews", "Background Checks", "Money-back Guarantee"]
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
//     title: "Smart & Fast",
//     subtitle: "Book services with AI-powered recommendations",
//     gradient: "from-cyan-400 via-blue-500 to-purple-600",
//     features: ["1-Click Booking", "Smart Matching", "Instant Confirmation"]
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
//     title: "Join Our Ecosystem",
//     subtitle: "Grow your business with AI-driven insights",
//     gradient: "from-purple-500 via-pink-500 to-red-500",
//     features: ["Analytics Dashboard", "Customer Insights", "Growth Tools"]
//   }
// ];

// const mockBusinessList = [
//   {
//     _id: "1",
//     businessName: "Artisan Coffee Roasters",
//     categoryOfBusiness: "Premium Coffee & Pastries",
//     image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "1.2 km",
//     rating: 4.9,
//     reviews: 234,
//     isVerified: true,
//     isOpen: true,
//     specialOffer: "20% OFF Today",
//     responseTime: "Responds in 5 min"
//   },
//   {
//     _id: "2",
//     businessName: "TechFix Pro Solutions",
//     categoryOfBusiness: "Electronics & Device Repair",
//     image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "0.8 km",
//     rating: 4.8,
//     reviews: 156,
//     isVerified: true,
//     isOpen: true,
//     specialOffer: "Free Diagnosis",
//     responseTime: "Responds in 2 min"
//   },
//   {
//     _id: "3",
//     businessName: "Bloom & Blossom Florist",
//     categoryOfBusiness: "Luxury Flowers & Events",
//     image: "https://images.unsplash.com/photo-1563181735-6f6fb66719d3?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "2.1 km",
//     rating: 4.7,
//     reviews: 189,
//     isVerified: true,
//     isOpen: false,
//     specialOffer: "Same-day Delivery",
//     responseTime: "Responds in 10 min"
//   },
//   {
//     _id: "4",
//     businessName: "Elite Fitness Studio",
//     categoryOfBusiness: "Personal Training & Wellness",
//     image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "1.5 km",
//     rating: 4.9,
//     reviews: 298,
//     isVerified: true,
//     isOpen: true,
//     specialOffer: "Free Trial Session",
//     responseTime: "Responds in 3 min"
//   }
// ];

// const mockRecommendations = [
//   {
//     _id: "5",
//     businessName: "Green Garden Restaurant",
//     categoryOfBusiness: "Organic Food & Dining",
//     image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "0.5 km",
//     rating: 4.8,
//     reviews: 312,
//     isVerified: true,
//     isOpen: true,
//     specialOffer: "Happy Hour 2-5 PM",
//     responseTime: "Responds in 3 min"
//   },
//   {
//     _id: "6",
//     businessName: "Quick Print Solutions",
//     categoryOfBusiness: "Printing & Design",
//     image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "1.0 km",
//     rating: 4.6,
//     reviews: 87,
//     isVerified: true,
//     isOpen: true,
//     specialOffer: "Same Day Service",
//     responseTime: "Responds in 8 min"
//   }
// ];

// const StunningLandingPage = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [likedBusinesses, setLikedBusinesses] = useState(new Set());
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const sliderRef = useRef(null);

//   // Auto-advance slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   // Mouse tracking for interactive effects
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const handleLike = (businessId) => {
//     const newLiked = new Set(likedBusinesses);
//     if (newLiked.has(businessId)) {
//       newLiked.delete(businessId);
//     } else {
//       newLiked.add(businessId);
//     }
//     setLikedBusinesses(newLiked);
//   };

//   // Floating animation elements
//   const FloatingElements = () => (
//     <div className="absolute inset-0 overflow-hidden">
//       {[...Array(12)].map((_, i) => (
//         <FloatingElement
//           key={i}
//           size={Math.random() * 100 + 50}
//           delay={i * 0.5}
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//           }}
//         />
//       ))}
//     </div>
//   );

//   // Enhanced Business Card Component with improved styling
//   const BusinessCard = ({ business, index }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.15, duration: 0.8 }}
//       className="group"
//     >
//       <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:shadow-xl hover:-translate-y-2">
//         {/* Image Container */}
//         <div className="relative overflow-hidden">
//           <img
//             src={business.image}
//             alt={business.businessName}
//             className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
//           />

//           {/* Verified Badge */}
//           {business.isVerified && (
//             <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
//               <Verified size={12} />
//               Verified
//             </div>
//           )}

//           {/* Special Offer Badge */}
//           {business.specialOffer && (
//             <div className="absolute top-3 right-3 bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
//               {business.specialOffer}
//             </div>
//           )}

//           {/* Like Button */}
//           <button
//             onClick={() => handleLike(business._id)}
//             className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//               likedBusinesses.has(business._id)
//                 ? 'bg-red-600 text-white'
//                 : 'bg-white text-red-600 hover:bg-red-600 hover:text-white'
//             } shadow-lg`}
//           >
//             <Heart size={14} className={likedBusinesses.has(business._id) ? 'fill-current' : ''} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
//             {business.businessName}
//           </h3>

//           <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
//             <ShoppingBag size={14} className="text-indigo-600" />
//             {business.categoryOfBusiness}
//           </p>

//           {/* Rating and Distance */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-1">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={14}
//                     className={i < Math.floor(business.rating)
//                       ? "text-amber-400 fill-current"
//                       : "text-gray-300"
//                     }
//                   />
//                 ))}
//               </div>
//               <span className="text-sm text-gray-600 ml-1">({business.reviews})</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-500 gap-1">
//               <MapPin size={12} />
//               {business.distance}
//             </div>
//           </div>

//           {/* Status and Response Time */}
//           <div className="flex items-center justify-between mb-4">
//             <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
//               business.isOpen
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               <Clock size={12} />
//               {business.isOpen ? "Open Now" : "Closed"}
//             </div>
//             <span className="text-xs text-gray-500">{business.responseTime}</span>
//           </div>

//           {/* Action Button */}
//           <button className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2">
//             View Details
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen overflow-hidden">
//       {/* Hero Section with Advanced Slider */}
//       <StylingBackground/>
//       <div className="relative h-screen overflow-hidden">
//         <FloatingElements />

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentSlide}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 1.2, ease: "easeInOut" }}
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `url(${mockSlides[currentSlide].image})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center'
//             }}
//           >
//             <div className={`absolute inset-0 bg-gradient-to-br ${mockSlides[currentSlide].gradient} opacity-85`} />
//           </motion.div>
//         </AnimatePresence>

//         {/* Hero Content */}
//         <div className="relative z-10 flex items-center justify-center h-full text-white px-4">
//           <div className="text-center max-w-6xl">
//             <motion.h1
//               initial={{ y: 80, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
//               className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight"
//               style={{
//                 textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
//                 filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
//               }}
//             >
//               {mockSlides[currentSlide].title}
//             </motion.h1>

//             <motion.p
//               initial={{ y: 60, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
//               className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/95 font-light"
//             >
//               {mockSlides[currentSlide].subtitle}
//             </motion.p>

//             {/* Feature Pills */}
//             <motion.div
//               initial={{ y: 40, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.9, duration: 1 }}
//               className="flex flex-wrap justify-center gap-4 mb-12"
//             >
//               {mockSlides[currentSlide].features.map((feature, index) => (
//                 <motion.div
//                   key={feature}
//                   initial={{ opacity: 0, scale: 0.8, y: 20 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
//                 >
//                   <GlassCard className="px-6 py-3">
//                     <span className="text-white/95 font-medium">{feature}</span>
//                   </GlassCard>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* CTA Buttons */}
//             <motion.div
//               initial={{ y: 40, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 1.3, duration: 1 }}
//               className="flex flex-col md:flex-row gap-6 justify-center items-center"
//             >
//               <GradientButton variant="primary">
//                 <Search size={20} />
//                 Explore Now
//               </GradientButton>

//               <GradientButton variant="outline">
//                 <Store size={20} />
//                 Become a Seller
//               </GradientButton>
//             </motion.div>
//           </div>
//         </div>

//         {/* Slider Controls */}
//         <button
//           onClick={() => setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length)}
//           className="absolute left-4  md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
//         >
//           <ChevronLeft size={24} />
//         </button>

//         <button
//           onClick={() => setCurrentSlide((prev) => (prev + 1) % mockSlides.length)}
//           className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
//         >
//           <ChevronRight size={24} />
//         </button>

//         {/* Slider Indicators */}
//         <div className="absolute  bottom-2 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//           {mockSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`transition-all duration-300 rounded-full ${
//                 index === currentSlide
//                   ? 'w-12 h-3 bg-white'
//                   : 'w-3 h-3 bg-white/50 hover:bg-white/75'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Stats Section with Counter Animation */}
//       <div className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
//         <div className="absolute inset-0">
//           {[...Array(6)].map((_, i) => (
//             <FloatingElement
//               key={i}
//               size={Math.random() * 150 + 100}
//               delay={i * 0.8}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="container mx-auto px-4 relative z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { icon: Store, number: "5,000+", label: "Verified Businesses", gradient: "from-blue-500 to-purple-500" },
//               { icon: Users, number: "100K+", label: "Happy Customers", gradient: "from-purple-500 to-pink-500" },
//               { icon: MapPin, number: "250+", label: "Cities Covered", gradient: "from-pink-500 to-red-500" },
//               { icon: Award, number: "4.9★", label: "Average Rating", gradient: "from-cyan-400 to-blue-500" }
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 50, scale: 0.8 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 transition={{ delay: index * 0.15, duration: 0.8 }}
//                 viewport={{ once: true }}
//                 whileHover={{ scale: 1.05, y: -10 }}
//                 className="group"
//               >
//                 <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/30 relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 from-blue-400 to-purple-500" />

//                   <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
//                     <stat.icon size={36} />
//                   </div>

//                   <div className="text-4xl md:text-5xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                     {stat.number}
//                   </div>

//                   <div className="text-gray-600 font-semibold text-lg">
//                     {stat.label}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Interactive Video Section */}
//       <div className="py-20  relative overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
//           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <defs>
//               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
//                 <circle cx="5" cy="5" r="0.5" fill="rgb(99 102 241 / 0.1)" />
//               </pattern>
//             </defs>
//             <rect width="100" height="100" fill="url(#grid)" />
//           </svg>
//           <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl"></div>
//           <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl"></div>
//         </div>
//         <FloatingElements />

//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text  text-gray-600">
//               Experience the Future
//             </h2>
//             <p className="text-xl md:text-2xl  text-gray-600 max-w-4xl mx-auto font-light">
//               See how our AI-powered platform revolutionizes local business discovery
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
//             whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
//             transition={{ duration: 1.2 }}
//             viewport={{ once: true }}
//             className="max-w-6xl mx-auto"
//           >
//             <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
//               <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative group">
//                 <img
//                   src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=675&fit=crop"
//                   alt="Platform demo"
//                   className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
//                     isVideoPlaying ? 'opacity-0 scale-110' : 'opacity-70 scale-100'
//                   }`}
//                 />

//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setIsVideoPlaying(!isVideoPlaying)}
//                   className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-2xl group-hover:shadow-white/20"
//                 >
//                   <Play size={40} className="ml-1" />
//                 </motion.button>

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

//                 {/* Video overlay effects */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Background Pattern */}
//       <div className="py-20 bg-gray-50 relative overflow-hidden">
//         {/* Animated background pattern */}
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
//           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <defs>
//               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
//                 <circle cx="5" cy="5" r="0.5" fill="rgb(99 102 241 / 0.1)" />
//               </pattern>
//             </defs>
//             <rect width="100" height="100" fill="url(#grid)" />
//           </svg>
//           <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl"></div>
//           <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl"></div>
//         </div>

//         <div className="container mx-auto px-4 relative z-10">
//           {/* Recommendations Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             viewport={{ once: true }}
//             className="mb-20"
//           >
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-4">
//                 <Sparkles className="text-amber-500" size={32} />
//                 <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
//                   Recommended for You
//                 </h2>
//               </div>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 Personalized business recommendations based on your preferences and location
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//               {mockRecommendations.map((business, index) => (
//                 <BusinessCard key={business._id} business={business} index={index} />
//               ))}
//             </div>

//             <div className="text-center">
//               <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto">
//                 <Eye size={20} />
//                 View All Recommendations
//               </button>
//             </div>
//           </motion.div>

//           {/* All Businesses Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             viewport={{ once: true }}
//           >
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
//                 Explore All Businesses
//               </h2>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 Discover amazing local services and businesses in your area
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
//               {mockBusinessList.map((business, index) => (
//                 <BusinessCard key={business._id} business={business} index={index} />
//               ))}
//             </div>

//             <div className="text-center">
//               <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto">
//                 <Store size={20} />
//                 View All Categories
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Features Showcase */}
//       <div className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 relative overflow-hidden">
//         {/* Unique background styling */}

//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.1),transparent_50%)]"></div>
//           <div className="absolute inset-0 bg-[conic-gradient(from_45deg,transparent,rgba(99,102,241,0.03),transparent)]"></div>

//           {/* Animated shapes */}
//           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-60"></div>
//           <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
//           <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>

//           {/* Grid pattern overlay */}
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
//         </div>

//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
//               Why Choose Us?
//             </h2>
//             <p className="text-xl text-slate-300 max-w-3xl mx-auto">
//               Experience the next generation of local business discovery
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Zap,
//                 title: "Lightning Fast",
//                 description: "Find and book services in seconds with our AI-powered search",
//                 color: "amber"
//               },
//               {
//                 icon: Shield,
//                 title: "100% Secure",
//                 description: "Your data and transactions are protected with bank-level security",
//                 color: "emerald"
//               },
//               {
//                 icon: Gauge,
//                 title: "Real-time Updates",
//                 description: "Get instant notifications about availability and confirmations",
//                 color: "indigo"
//               },
//               {
//                 icon: Award,
//                 title: "Quality Guaranteed",
//                 description: "All businesses are verified and rated by real customers",
//                 color: "blue"
//               },
//               {
//                 icon: ThumbsUp,
//                 title: "Customer First",
//                 description: "24/7 support and money-back guarantee for peace of mind",
//                 color: "rose"
//               },
//               {
//                 icon: TrendingUp,
//                 title: "Growth Partner",
//                 description: "Help local businesses grow with powerful analytics and tools",
//                 color: "purple"
//               }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="group"
//               >
//                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full text-center hover:bg-white/10 transition-all duration-300">
//                   <div className={`w-16 h-16 mx-auto mb-6 bg-${feature.color}-600 rounded-xl flex items-center justify-center text-white shadow-lg`}>
//                     <feature.icon size={32} />
//                   </div>

//                   <h3 className="text-xl font-bold text-white mb-4">
//                     {feature.title}
//                   </h3>

//                   <p className="text-slate-300 leading-relaxed">
//                     {feature.description}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//       {/* Call to Action Section */}
//       <div className="py-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 relative overflow-hidden">
//         {/* Modern background pattern */}
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)]"></div>
//           <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.03)_180deg,transparent_360deg)]"></div>

//           {/* Floating geometric shapes */}
//           <div className="absolute top-1/4 left-1/6 w-4 h-4 border border-white/20 rotate-45 animate-pulse"></div>
//           <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-bounce"></div>
//           <div className="absolute top-1/2 right-1/6 w-3 h-8 bg-gradient-to-t from-transparent to-white/10 transform rotate-12"></div>
//         </div>

//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             viewport={{ once: true }}
//             className="text-center text-white"
//           >
//             <div className="max-w-4xl mx-auto">
//               <div className="mb-8">
//                 <Store size={64} className="mx-auto mb-6 text-white" />
//               </div>

//               <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
//                 Ready to Transform Your Business?
//               </h2>

//               <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
//                 Join thousands of successful businesses and reach more customers in your local area
//               </p>

//               <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
//                 <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-lg">
//                   <Store size={24} />
//                   Start Selling Today
//                 </button>

//                 <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200 flex items-center gap-2 text-lg">
//                   <Phone size={24} />
//                   Contact Our Team
//                 </button>
//               </div>

//               {/* Trust indicators */}
//               <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
//                 <div className="flex items-center gap-2">
//                   <Verified size={20} />
//                   <span>Verified Platform</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Shield size={20} />
//                   <span>Secure & Safe</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Award size={20} />
//                   <span>Award Winning</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StunningLandingPage;

//?=============================================

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Star,
//   Play,
//   Users,
//   Store,
//   ShoppingBag,
//   ArrowRight,
//   Sparkles,
//   Heart,
//   Clock,
//   Phone,
//   Mail
// } from "lucide-react";

// // Mock data for demo
// const mockSlides = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
//     title: "Discover Local Businesses",
//     subtitle: "Connect with amazing local services near you",
//     color: "from-blue-600 to-purple-600"
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
//     title: "Quality Services",
//     subtitle: "Find trusted professionals in your area",
//     color: "from-emerald-500 to-teal-600"
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
//     title: "Easy & Fast",
//     subtitle: "Book services with just a few clicks",
//     color: "from-orange-500 to-red-500"
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
//     title: "Join Our Community",
//     subtitle: "Become a seller and grow your business",
//     color: "from-purple-500 to-pink-500"
//   }
// ];

// const mockBusinessList = [
//   {
//     _id: "1",
//     businessName: "Coffee Paradise",
//     categoryOfBusiness: "Restaurant & Cafe",
//     image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "1.2 km",
//     rating: 4.8,
//     reviews: 150
//   },
//   {
//     _id: "2",
//     businessName: "TechFix Solutions",
//     categoryOfBusiness: "Electronics Repair",
//     image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "0.8 km",
//     rating: 4.9,
//     reviews: 89
//   },
//   {
//     _id: "3",
//     businessName: "Bloom Florist",
//     categoryOfBusiness: "Flowers & Gifts",
//     image: "https://images.unsplash.com/photo-1563181735-6f6fb66719d3?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "2.1 km",
//     rating: 4.7,
//     reviews: 203
//   },
//   {
//     _id: "4",
//     businessName: "Fitness Hub",
//     categoryOfBusiness: "Gym & Fitness",
//     image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
//     city: "New York",
//     distance: "1.5 km",
//     rating: 4.6,
//     reviews: 127
//   }
// ];

// // Enhanced Card Component
// const Card = ({ businessList = [] }) => {
//   const renderStars = (rating) => {
//     return Array(5)
//       .fill()
//       .map((_, i) => (
//         <Star
//           key={i}
//           size={14}
//           className={`${
//             i < Math.floor(rating)
//               ? "text-yellow-400 fill-current"
//               : "text-gray-300"
//           }`}
//         />
//       ));
//   };

//   return businessList.map((business, index) => (
//     <motion.div
//       key={business._id || index}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.5 }}
//       whileHover={{
//         y: -8,
//         scale: 1.02,
//         transition: { duration: 0.2 }
//       }}
//       className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer border border-gray-100 transition-all duration-300"
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={business.image}
//           alt={business.businessName}
//           className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//         <motion.div
//           whileHover={{ scale: 1.1 }}
//           className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
//         >
//           <Heart size={16} className="text-red-500" />
//         </motion.div>
//       </div>

//       <div className="p-5">
//         <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
//           {business.businessName}
//         </h3>

//         <p className="text-gray-600 text-sm mb-3 flex items-center">
//           <ShoppingBag size={14} className="mr-2 text-blue-500" />
//           {business.categoryOfBusiness}
//         </p>

//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-1">
//             {renderStars(business.rating || 5)}
//             <span className="text-sm text-gray-600 ml-2">
//               ({business.reviews || 150})
//             </span>
//           </div>
//           <div className="flex items-center text-sm text-gray-500">
//             <MapPin size={14} className="mr-1" />
//             {business.distance || "1.2 km"}
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-700 flex items-center">
//             <Clock size={14} className="mr-1 text-green-500" />
//             Open Now
//           </span>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             View Details
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   ));
// };

// const Home = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [businessList, setBusinessList] = useState(mockBusinessList);
//   const [recommendations, setRecommendations] = useState(mockBusinessList.slice(0, 2));
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const sliderRef = useRef(null);

//   // Auto-advance slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Hero Slider Section */}
//       <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentSlide}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.7 }}
//             className="absolute inset-0"
//           >
//             <div
//               className="w-full h-full bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${mockSlides[currentSlide].image})` }}
//             >
//               <div className={`absolute inset-0 bg-gradient-to-r ${mockSlides[currentSlide].color} opacity-80`}></div>

//               {/* Hero Content */}
//               <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
//                 <motion.div
//                   initial={{ y: 30, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.3, duration: 0.8 }}
//                   className="max-w-4xl"
//                 >
//                   <motion.h1
//                     className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.5, duration: 0.8 }}
//                   >
//                     {mockSlides[currentSlide].title}
//                   </motion.h1>
//                   <motion.p
//                     className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90"
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.7, duration: 0.8 }}
//                   >
//                     {mockSlides[currentSlide].subtitle}
//                   </motion.p>
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.9, duration: 0.8 }}
//                     className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//                   >
//                     <motion.button
//                       whileHover={{ scale: 1.05, y: -2 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center space-x-2"
//                     >
//                       <span>Explore Businesses</span>
//                       <ArrowRight size={20} />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05, y: -2 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center space-x-2"
//                     >
//                       <Store size={20} />
//                       <span>Become a Seller</span>
//                     </motion.button>
//                   </motion.div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>

//         {/* Slider Controls */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-20"
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-20"
//         >
//           <ChevronRight size={24} />
//         </button>

//         {/* Slider Indicators */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
//           {mockSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentSlide
//                   ? "bg-white scale-125"
//                   : "bg-white/50 hover:bg-white/75"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { icon: Store, number: "1000+", label: "Local Businesses" },
//               { icon: Users, number: "50K+", label: "Happy Customers" },
//               { icon: MapPin, number: "100+", label: "Cities Covered" },
//               { icon: Star, number: "4.9", label: "Average Rating" }
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.5 }}
//                 className="text-center"
//               >
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl mb-4">
//                   <stat.icon size={24} />
//                 </div>
//                 <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
//                   {stat.number}
//                 </div>
//                 <div className="text-gray-600 font-medium">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Video Section */}
//       <div className="bg-gray-50 py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               See How It Works
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Discover how easy it is to find and connect with local businesses in your area
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8 }}
//             className="relative max-w-4xl mx-auto"
//           >
//             <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
//               <div className="aspect-video bg-gradient-to-br from-blue-800 to-purple-800 flex items-center justify-center relative">
//                 <img
//                   src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=450&fit=crop"
//                   alt="Video thumbnail"
//                   className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
//                     isVideoPlaying ? "opacity-0" : "opacity-70"
//                   }`}
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setIsVideoPlaying(!isVideoPlaying)}
//                   className="relative z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-6 rounded-full transition-all duration-300 shadow-xl"
//                 >
//                   <Play size={48} className="ml-1" />
//                 </motion.button>
//                 <div className="absolute inset-0 bg-black/20"></div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 py-20">
//         <div className="container mx-auto px-4">
//           {/* Recommendations Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="mb-20"
//           >
//             <div className="flex items-center justify-between mb-12">
//               <div>
//                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center">
//                   <Sparkles className="mr-3 text-yellow-500" size={36} />
//                   Recommended for You
//                 </h2>
//                 <p className="text-gray-600 text-lg">Personalized picks based on your preferences</p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05, x: 5 }}
//                 className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
//               >
//                 <span>View All</span>
//                 <ArrowRight size={20} />
//               </motion.button>
//             </div>

//             {recommendations.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 <Card businessList={recommendations} />
//               </div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-16 bg-white rounded-2xl shadow-lg"
//               >
//                 <Store size={48} className="mx-auto text-gray-400 mb-4" />
//                 <p className="text-gray-500 text-lg">No recommendations available yet</p>
//               </motion.div>
//             )}
//           </motion.div>

//           {/* All Businesses Section */}
//           <div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="flex items-center justify-between mb-12">
//               <div>
//                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//                   Explore All Businesses
//                 </h2>
//                 <p className="text-gray-600 text-lg">Discover amazing local services in your area</p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 View All Categories
//               </motion.button>
//             </div>

//             {businessList.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 <Card businessList={businessList} />
//               </div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-16 bg-white rounded-2xl shadow-lg"
//               >
//                 <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
//                 <p className="text-gray-500 text-lg">No businesses found in your area</p>
//               </motion.div>
//             )}
//           </div>

//           {/* Become a Seller CTA */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="mt-20"
//           >
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
//               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop')] opacity-10 bg-cover bg-center"></div>
//               <div className="relative z-10">
//                 <motion.div
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   whileInView={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <Store size={64} className="mx-auto mb-6" />
//                   <h3 className="text-3xl md:text-4xl font-bold mb-6">
//                     Ready to Grow Your Business?
//                   </h3>
//                   <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
//                     Join thousands of successful sellers and reach more customers in your local area
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                     <motion.button
//                       whileHover={{ scale: 1.05, y: -2 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center space-x-2"
//                     >
//                       <Store size={20} />
//                       <span>Become a Seller</span>
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05, y: -2 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
//                     >
//                       <Phone size={20} />
//                       <span>Contact Us</span>
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
