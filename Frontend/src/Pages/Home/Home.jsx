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
import DotGrid from "@/components/DotGrid";
import { AnimatedBackground } from "../Category/ReusableComponent";
import { NavLink } from "react-router-dom";

// Mock data
const mockSlides = [
  {
    title: "Discover Local Businesses",
    subtitle:
      "Find the best services and shops in your neighborhood with our AI-powered platform",
    features: ["Verified Reviews", "Instant Booking", "Local Focus"],
    image:
      "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=1920&h=1080&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    title: "Connect With Your Community",
    subtitle:
      "Support local entrepreneurs and discover hidden gems in your area",
    features: ["Community Driven", "Local Support", "Quality Service"],
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    title: "Seamless Experience",
    subtitle:
      "Book appointments, make reservations, and discover services effortlessly",
    features: ["Easy Booking", "Real-time Updates", "Secure Payments"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

const mockBusinessList = [
  {
    _id: "1",
    businessName: "Artisan Coffee House",
    categoryOfBusiness: "Café & Restaurant",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 124,
    distance: "0.5 km",
    price: "₹₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 1 hour",
    isVerified: true,
    specialOffer: "20% OFF",
  },
  {
    _id: "2",
    businessName: "Urban Fitness Studio",
    categoryOfBusiness: "Fitness & Wellness",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 89,
    distance: "1.2 km",
    price: "₹₹₹",
    isOpen: false,
    nextAvailable: "Tomorrow",
    responseTime: "< 30 min",
    isVerified: true,
  },
  {
    _id: "3",
    businessName: "Tech Repair Hub",
    categoryOfBusiness: "Electronics & Repair",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 156,
    distance: "2.1 km",
    price: "₹₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 2 hours",
    isVerified: true,
  },
  {
    _id: "4",
    businessName: "Fresh Market Deli",
    categoryOfBusiness: "Grocery & Food",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 203,
    distance: "0.8 km",
    price: "₹",
    isOpen: true,
    nextAvailable: "Today",
    responseTime: "< 15 min",
    isVerified: false,
    specialOffer: "Free Delivery",
  },
];

const mockRecommendations = [
  {
    ...mockBusinessList[0],
    matchScore: 92,
  },
  {
    ...mockBusinessList[1],
    matchScore: 88,
  },
  {
    ...mockBusinessList[2],
    matchScore: 85,
  },
];

// Optimized Button Component
const GradientButton = React.memo(
  ({
    children,
    className = "",
    variant = "primary",
    loading = false,
    onClick,
    ...props
  }) => {
    const baseClasses =
      "px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-black text-white hover:text-black hover:bg-white hover:shadow-xl transform hover:scale-105",
      secondary:
        "bg-white text-black border-2 border-black hover:bg-black hover:text-white transform hover:scale-105",
      outline:
        "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transform hover:scale-105",
      ghost:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 transform hover:scale-105",
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
  }
);

// Enhanced Business Card Component
const BusinessCard = React.memo(
  ({ business, showMatchScore = false, onLike, onSave, isLiked, isSaved }) => (
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
              <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
            </button>

            <button
              onClick={() => onLike?.(business._id)}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                isLiked
                  ? "bg-red-600 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white"
              } shadow-lg transform hover:scale-110`}
            >
              <Heart size={12} className={isLiked ? "fill-current" : ""} />
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
  )
);

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
          <span className="text-xs font-bold">{isMuted ? "M" : "U"}</span>
        </button>
      </div>
    </div>
  );
});

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
    setLikedBusinesses((prev) => {
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
    setSavedBusinesses((prev) => {
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
    setCurrentSlide(
      (prev) => (prev - 1 + mockSlides.length) % mockSlides.length
    );
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* DotGrid Background */}
        <div className="absolute inset-0 w-full h-full">
          <DotGrid
            dotSize={12}
            gap={28}
            // baseColor="#d1d5db"
            baseColor="#E9ECEF"
            // activeColor="#374151"
            activeColor="#495057"
            proximity={120}
            speedTrigger={80}
            shockRadius={200}
            shockStrength={3}
            maxSpeed={4000}
            resistance={600}
            returnDuration={1.2}
            className="opacity-60"
          />
        </div>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-transparent to-gray-100/60 pointer-events-none" />

        {/* Additional subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-gray-200/20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-[#153243] px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6  bg-clip-text">
              Welcome to CityConnect
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl font-medium mx-auto leading-relaxed">
              Discover amazing local businesses in your community with our
              interactive platform
            </p>
            <NavLink to="/login">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full font-semibold text-white hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
            ◘</NavLink>
          </div>
        </div>
      </div>

      <div
        className="min-h-screen overflow-hidden"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* Hero Section with Video Background */}
        <div className="relative h-screen overflow-hidden">
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
                <div
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
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
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(12px)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
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
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
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
        <div
          className="py-12 md:py-20 relative overflow-hidden"
          style={{ backgroundColor: "#ECF2F9" }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4"
                style={{ color: "#1f2937" }}
              >
                Trusted by Thousands
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl mx-auto"
                style={{ color: "#6b7280" }}
              >
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
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div
                    className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 md:mb-6 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon size={24} className="md:hidden" />
                    <stat.icon size={36} className="hidden md:block" />
                  </div>

                  <div
                    className="text-2xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-2"
                    style={{ color: "#1f2937" }}
                  >
                    {stat.number}
                  </div>

                  <div
                    className="text-sm md:text-lg font-semibold"
                    style={{ color: "#6b7280" }}
                  >
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
              <div
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium mb-4 md:mb-6"
                style={{ backgroundColor: "#f3f4f6", borderColor: "#d1d5db" }}
              >
                <Play size={14} style={{ color: "#6b7280" }} />
                Watch Our Story
              </div>

              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6"
                style={{ color: "#1f2937" }}
              >
                Experience the Future
              </h2>
              <p
                className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto font-light"
                style={{ color: "#6b7280" }}
              >
                See how our platform revolutionizes local business discovery
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div
                className="relative bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl"
                style={{ borderColor: "#e5e7eb" }}
              >
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
        <div
          className="py-12 md:py-20 relative overflow-hidden"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
                style={{ color: "#1f2937" }}
              >
                Recommended for You
              </h2>
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto"
                style={{ color: "#6b7280" }}
              >
                Discover handpicked businesses that match your preferences and
                needs
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
              <div
                className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border max-w-2xl mx-auto"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h3
                  className="text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ color: "#1f2937" }}
                >
                  Discover More Businesses
                </h3>
                <p className="mb-4 md:mb-6" style={{ color: "#6b7280" }}>
                  Explore our complete directory of verified local businesses in
                  your area.
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
        <div className="py-12 md:py-20 bg-[#ECF2F9] relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
                style={{ color: "#1f2937" }}
              >
                Explore All Businesses
              </h2>
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto"
                style={{ color: "#6b7280" }}
              >
                Discover amazing local services and businesses in your area with
                verified reviews and instant booking
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
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <div
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium text-white mb-4 md:mb-6"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Award size={16} />
                Premium Features
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Why Choose Us?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the next generation of local business discovery with
                cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description:
                    "Find and book services in seconds with our smart search engine and recommendations.",
                  gradient: "from-yellow-400 to-orange-500",
                },
                {
                  icon: Shield,
                  title: "100% Secure",
                  description:
                    "Your data and transactions are protected with bank-level security and encrypted payments.",
                  gradient: "from-green-400 to-blue-500",
                },
                {
                  icon: Gauge,
                  title: "Real-time Updates",
                  description:
                    "Get instant notifications about availability, confirmations, and business updates.",
                  gradient: "from-purple-400 to-pink-500",
                },
                {
                  icon: Award,
                  title: "Quality Guaranteed",
                  description:
                    "All businesses are verified and rated by real customers with authentic reviews.",
                  gradient: "from-blue-400 to-indigo-500",
                },
                {
                  icon: ThumbsUp,
                  title: "Customer First",
                  description:
                    "24/7 support and money-back guarantee for complete peace of mind.",
                  gradient: "from-pink-400 to-red-500",
                },
                {
                  icon: TrendingUp,
                  title: "Growth Partner",
                  description:
                    "Help local businesses grow with powerful analytics, insights, and marketing tools.",
                  gradient: "from-indigo-400 to-purple-500",
                },
              ].map((feature, index) => (
                <div key={index}>
                  <div
                    className="h-full text-center p-4 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 transform hover:scale-105"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
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
        <div
          className="py-12 md:py-20 relative overflow-hidden"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <AnimatedBackground />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8">
                  <Store
                    size={60}
                    className="mx-auto mb-4 md:mb-6"
                    style={{ color: "#1f2937" }}
                  />
                </div>

                <h2
                  className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight"
                  style={{ color: "#1f2937" }}
                >
                  Ready to Transform Your Business?
                </h2>

                <p
                  className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto"
                  style={{ color: "#6b7280" }}
                >
                  Join thousands of successful businesses and reach more
                  customers in your local area
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

                <div
                  className="flex flex-wrap justify-center items-center gap-4 md:gap-8"
                  style={{ color: "#6b7280" }}
                >
                  {[
                    { icon: Verified, text: "Verified Platform" },
                    { icon: Shield, text: "Secure & Safe" },
                    { icon: Award, text: "Award Winning" },
                    { icon: Users, text: "100K+ Users" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-full shadow-sm border transform hover:scale-105 transition-all duration-300"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <item.icon size={16} style={{ color: "#374151" }} />
                      <span className="font-medium text-sm md:text-base">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 bg-[#ECF2F9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                What Our Community Says
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                Real stories from real people in your neighborhood
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Miguel Rodriguez",
                  role: "Restaurant Owner",
                  image:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
                  quote:
                    "Since joining LocalConnect, our customer base has grown by 40%. The platform brings us customers who truly appreciate local dining and return regularly.",
                  rating: 5,
                },
                {
                  name: "Priya Patel",
                  role: "Community Advocate",
                  image:
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
                  quote:
                    "I love seeing the real economic impact my spending has on my community. The local impact tracker shows exactly how my choices support neighborhood jobs and growth.",
                  rating: 5,
                },
                {
                  name: "Lisa Chang",
                  role: "Salon Owner",
                  image:
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
                  quote:
                    "LocalConnect has helped us reach customers we never would have found otherwise. The quality of bookings and customer loyalty has been incredible.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid $fff`,
                  }}
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="leading-relaxed italic">
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
