import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shield,
  Award,
  Users,
  Camera,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceProviderListing = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);

  // Sample service providers data (unchanged)
  const serviceProviders = [
    {
      id: 1,
      name: "Elite Photography Studio",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      phone: "+1 (555) 123-4567",
      email: "info@elitephoto.com",
      website: "www.elitephotography.com",
      description: "Award-winning photography studio specializing in luxury weddings, corporate events, and artistic portraits. We blend creativity with technical excellence to deliver stunning visual stories that last a lifetime.",
      type: "Photography",
      category: ["Wedding Photography", "Corporate Events", "Portraits", "Product Photography", "Fashion"],
      images: [
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=500&fit=crop"
      ],
      establishedYear: 2013,
      socialMedia: {
        facebook: "https://facebook.com/elitephoto",
        instagram: "https://instagram.com/elitephoto",
        twitter: "https://twitter.com/elitephoto",
        youtube: "https://youtube.com/elitephoto",
        linkedin: "https://linkedin.com/company/elitephoto"
      },
      openingTime: "09:00 AM",
      closingTime: "10:00 PM",
      isOpen: true,
      is24Hour: false,
      address: {
        street: "123 Creative Boulevard",
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Creative Boulevard, Studio 456",
        city: "New York",
        state: "NY",
        pincode: "10001",
        country: "USA"
      },
      reviews: [
        {
          id: 1,
          rating: 5,
          description: "Absolutely phenomenal work! The team captured our wedding day with such artistry and professionalism. Every single photo tells a story, and the attention to detail is incredible. We couldn't be happier with the results!",
          images: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=120&h=120&fit=crop",
            "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=120&h=120&fit=crop"
          ],
          reviewer: {
            name: "Sarah & Michael Johnson",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b672?w=60&h=60&fit=crop&crop=face"
          },
          date: "2024-01-15"
        },
        {
          id: 2,
          rating: 5,
          description: "Outstanding corporate event photography. The team was discreet, professional, and captured all the key moments perfectly. The final gallery exceeded our expectations completely.",
          images: [],
          reviewer: {
            name: "Marcus Chen",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
          },
          date: "2024-01-10"
        },
        {
          id: 3,
          rating: 4,
          description: "Incredible portrait session! Very creative approach and made us feel comfortable throughout. The lighting and composition were masterful.",
          images: [
            "https://images.unsplash.com/photo-1516627145497-ae9932d04394?w=120&h=120&fit=crop"
          ],
          reviewer: {
            name: "Emma Davis",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
          },
          date: "2024-01-05"
        },
        {
          id: 4,
          rating: 5,
          description: "Elite Photography Studio transformed our product launch event into a visual masterpiece. Every shot was perfectly composed and edited to perfection.",
          images: [],
          reviewer: {
            name: "David Wilson",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
          },
          date: "2023-12-28"
        }
      ],
      price: "Starting from $299/hour",
      isEmailVerified: true,
      isPhoneVerified: true,
      totalProjects: 250,
      awards: ["Best Wedding Photographer 2023", "Excellence in Corporate Photography"]
    },
    {
      id: 2,
      name: "Quick Fix Repairs",
      photo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face",
      phone: "+1 (555) 987-6543",
      description: "Fast and reliable repair services for home and office.",
      type: "Repair Services",
      category: ["Electrical", "Plumbing"],
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=500&fit=crop"
      ],
      socialMedia: {
        facebook: "https://facebook.com/quickfixrepairs"
      },
      openingTime: "08:00",
      closingTime: "20:00",
      isOpen: false,
      is24Hour: false,
      address: {
        street: "456 Service Street",
        city: "Brooklyn",
        state: "NY",
        pincode: "11201",
        country: "USA"
      },
      reviews: [
        {
          id: 1,
          rating: 4,
          description: "Quick and efficient service. Fixed our electrical issue promptly.",
          images: [],
          reviewer: {
            name: "John Smith",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
          },
          date: "2024-01-12"
        }
      ],
      price: "$85/hour",
      isEmailVerified: false,
      isPhoneVerified: true,
      totalProjects: 45
    }
  ];

  const provider = serviceProviders[0];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % provider.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + provider.images.length) % provider.images.length);
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % provider.reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + provider.reviews.length) % provider.reviews.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = provider.reviews?.length > 0 
    ? provider.reviews.reduce((acc, review) => acc + review.rating, 0) / provider.reviews.length 
    : 0;

  const socialColors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    linkedin: '#0077B5'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container mx-auto px-2 py-6 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm" 
               style={{ backgroundColor: '#ffffff' }}>
            
            {/* Hero Section (unchanged) */}
            <div className="relative">
              <div className="relative h-72 md:h-96 lg:h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={provider.images[selectedImage]}
                      alt={`Service ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>
                
                {provider.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', color: '#ffffff' }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', color: '#ffffff' }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute top-6 right-6 flex items-center space-x-3">
                  <div className="flex items-center space-x-1 px-4 py-2 rounded-xl backdrop-blur-md" 
                       style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: '#ffffff' }}>
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedImage + 1} / {provider.images.length}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl backdrop-blur-md font-semibold text-sm ${
                    provider.isOpen 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {provider.isOpen ? '● OPEN' : '● CLOSED'}
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {provider.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === selectedImage 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-16 left-6 md:left-8 z-10">
                <div className="flex items-end space-x-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={provider.photo}
                      alt={provider.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover ring-6 ring-white shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg"
                         style={{ backgroundColor: '#ffffff' }}>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="pt-20 md:pt-24 px-5 md:px-8 lg:px-12 pb-12">
              
              {/* Header Info (unchanged) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10">
                <div className="flex-1 lg:pr-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold" 
                          style={{ color: '#1f2937' }}>
                        {provider.name}
                      </h1>
                      {(provider.isEmailVerified || provider.isPhoneVerified) && (
                        <div className="flex items-center space-x-1 px-3 py-1 rounded-xl" 
                             style={{ backgroundColor: '#dcfce7' }}>
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="px-4 py-2 rounded-xl text-lg font-semibold" 
                            style={{ backgroundColor: '#e2e8f0', color: '#1f2937' }}>
                        {provider.type}
                      </span>
                      {provider.establishedYear && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" style={{ color: '#6b7280' }} />
                          <span className="font-medium" style={{ color: '#6b7280' }}>
                            Since {provider.establishedYear}
                          </span>
                        </div>
                      )}
                      {provider.totalProjects && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5" style={{ color: '#6b7280' }} />
                          <span className="font-medium" style={{ color: '#6b7280' }}>
                            {provider.totalProjects}+ Projects
                          </span>
                        </div>
                      )}
                    </div>

                    {provider.reviews?.length > 0 && (
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-2">
                          {renderStars(Math.round(averageRating))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold" style={{ color: '#1f2937' }}>
                            {averageRating.toFixed(1)}
                          </span>
                          <span className="text-lg" style={{ color: '#6b7280' }}>
                            ({provider.reviews.length} reviews)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {provider.category?.map((cat, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          className="px-4 py-2 rounded-xl text-sm font-medium border-2 hover:scale-105 transition-transform duration-200"
                          style={{ 
                            borderColor: '#e2e8f0', 
                            backgroundColor: '#f8fafc',
                            color: '#374151' 
                          }}
                        >
                          {cat}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="lg:text-right mt-6 lg:mt-0"
                >
                  {provider.price && (
                    <div className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
                      {provider.price}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Description (unchanged) */}
              {provider.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1f2937' }}>
                    About Our Services
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#6b7280' }}>
                    {provider.description}
                  </p>
                </motion.div>
              )}

              {/* Info Grid (unchanged except for Social Media section) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-6"
                >
                  <h4 className="text-xl font-bold flex items-center space-x-2" style={{ color: '#1f2937' }}>
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#1f2937' }}></div>
                    <span>Contact</span>
                  </h4>
                  
                  <div className="space-y-4">
                    {provider.phone && (
                      <div className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200" 
                           style={{ backgroundColor: '#f8fafc' }}>
                        <div className="p-2 rounded-xl" style={{ backgroundColor: '#e2e8f0' }}>
                          <Phone className="w-5 h-5" style={{ color: '#374151' }} />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium" style={{ color: '#1f2937' }}>
                            {provider.phone}
                          </span>
                          {provider.isPhoneVerified && (
                            <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {provider.email && (
                      <div className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200" 
                           style={{ backgroundColor: '#f8fafc' }}>
                        <div className="p-2 rounded-xl" style={{ backgroundColor: '#e2e8f0' }}>
                          <Mail className="w-5 h-5" style={{ color: '#374151' }} />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium" style={{ color: '#1f2937' }}>
                            {provider.email}
                          </span>
                          {provider.isEmailVerified && (
                            <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {provider.website && (
                      <div className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200" 
                           style={{ backgroundColor: '#f8fafc' }}>
                        <div className="p-2 rounded-xl" style={{ backgroundColor: '#e2e8f0' }}>
                          <Globe className="w-5 h-5" style={{ color: '#374151' }} />
                        </div>
                        <div className="flex-1">
                          <Link 
                            href={`https://${provider.website}`}
                            className="font-medium hover:underline flex items-center space-x-1"
                            style={{ color: '#3b82f6' }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{provider.website}</span>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <h4 className="text-xl font-bold flex items-center space-x-2 mb-6" style={{ color: '#1f2937' }}>
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#1f2937' }}></div>
                    <span>Hours</span>
                  </h4>
                  
                  <div className="p-4 duration-200 transition-transform hover:scale-105 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#e2e8f0' }}>
                        <Clock className="w-6 h-6" style={{ color: '#374151' }} />
                      </div>
                      <div>
                        <div className="font-bold text-lg" style={{ color: '#1f2937' }}>
                          {provider.is24Hour 
                            ? "24 Hours" 
                            : `${provider.openingTime} - ${provider.closingTime}`
                          }
                        </div>
                        <div className={`text-sm font-medium ${
                          provider.isOpen ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {provider.isOpen ? 'Currently Open' : 'Currently Closed'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {provider.address && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <h4 className="text-xl font-bold flex items-center space-x-2 mb-6" style={{ color: '#1f2937' }}>
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#1f2937' }}></div>
                      <span>Location</span>
                    </h4>
                    
                    <div className="p-4  duration-200 transition-transform hover:scale-105 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#e2e8f0' }}>
                          <MapPin className="w-6 h-6" style={{ color: '#374151' }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold mb-1" style={{ color: '#1f2937' }}>
                            {provider.address.street}
                          </div>
                          <div className="text-sm" style={{ color: '#6b7280' }}>
                            {provider.address.city}, {provider.address.state} {provider.address.pincode}
                          </div>
                          <div className="text-sm" style={{ color: '#6b7280' }}>
                            {provider.address.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Social Media Section - Show only icons on mobile */}
        {provider.socialMedia && Object.keys(provider.socialMedia).length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1, duration: 0.5 }}
  >
    <h4 className="text-xl font-bold flex items-center space-x-2 mb-6" style={{ color: '#1f2937' }}>
      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#1f2937' }}></div>
      <span>Follow Us</span>
    </h4>
    
    <div className="flex justify-center flex-wrap gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
      {provider.socialMedia.facebook && (
        <Link
          href={provider.socialMedia.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
          style={{ backgroundColor: socialColors.facebook }}
        >
          <Facebook className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm ml-2">Facebook</span>
        </Link>
      )}
      {provider.socialMedia.instagram && (
        <Link
          href={provider.socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
          style={{ backgroundColor: socialColors.instagram }}
        >
          <Instagram className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm ml-2">Instagram</span>
        </Link>
      )}
      {provider.socialMedia.twitter && (
        <Link
          href={provider.socialMedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
          style={{ backgroundColor: socialColors.twitter }}
        >
          <Twitter className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm ml-2">Twitter</span>
        </Link>
      )}
      {provider.socialMedia.youtube && (
        <Link
          href={provider.socialMedia.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
          style={{ backgroundColor: socialColors.youtube }}
        >
          <Youtube className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm ml-2">YouTube</span>
        </Link>
      )}
      {provider.socialMedia.linkedin && (
        <Link
          href={provider.socialMedia.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
          style={{ backgroundColor: socialColors.linkedin }}
        >
          <Linkedin className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm ml-2">LinkedIn</span>
        </Link>
      )}
    </div>
  </motion.div>
)}
              </div>

              {/* Awards Section (unchanged) */}
              {provider.awards && provider.awards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#1f2937' }}>
                    Awards & Recognition
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {provider.awards.map((award, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-xl border-2 hover:scale-105 transition-transform duration-200"
                        style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}
                      >
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#fef3c7' }}>
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="font-medium" style={{ color: '#1f2937' }}>
                          {award}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews Section - Optimized for Mobile */}
              {provider.reviews && provider.reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
                    <h3 className="text-2xl mb-4  font-bold" style={{ color: '#1f2937' }}>
                      Customer Reviews
                    </h3>
                    <div className="flex items-center space-x-3 sm:space-x-6">
                      <span className="text-md sm:text-xl font-medium" style={{ color: '#6b7280' }}>
                        {currentReview + 1} of {provider.reviews.length}
                      </span>
                      <div className="flex space-x-3">
                        <button
                          onClick={prevReview}
                          disabled={provider.reviews.length <= 1}
                          className="p-2 sm:p-3 cursor-pointer rounded-xl hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#e2e8f0', color: '#374151' }}
                        >
                          <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={nextReview}
                          disabled={provider.reviews.length <= 1}
                          className="p-2 sm:p-3 rounded-xl cursor-pointer hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#e2e8f0', color: '#374151' }}
                        >
                          <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentReview}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="rounded-2xl p-4 sm:p-8 shadow-xl border-2"
                        style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                          <img
                            src={provider.reviews[currentReview].reviewer.photo}
                            alt={provider.reviews[currentReview].reviewer.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover flex-shrink-0 ring-4 ring-white shadow-lg"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                              <div>
                                <h5 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: '#1f2937' }}>
                                  {provider.reviews[currentReview].reviewer.name}
                                </h5>
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="flex items-center space-x-1">
                                    {renderStars(provider.reviews[currentReview].rating)}
                                  </div>
                                  <span className="text-base sm:text-lg font-bold" style={{ color: '#1f2937' }}>
                                    {provider.reviews[currentReview].rating}.0
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm mt-2 sm:mt-0" style={{ color: '#6b7280' }}>
                                {new Date(provider.reviews[currentReview].date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            
                            <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6" style={{ color: '#6b7280' }}>
                              {provider.reviews[currentReview].description}
                            </p>
                            
                            {provider.reviews[currentReview].images && provider.reviews[currentReview].images.length > 0 && (
                              <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                                {provider.reviews[currentReview].images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
                                  >
                                    <img
                                      src={image}
                                      alt={`Review image ${index + 1}`}
                                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Pagination Dots - Optimized for Mobile */}
                        <div className="flex justify-center mt-4 sm:mt-8 space-x-2 sm:space-x-2">
                          {provider.reviews.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentReview(index)}
                              className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                                index === currentReview 
                                  ? 'scale-125' 
                                  : 'hover:scale-110'
                              }`}
                              style={{ 
                                backgroundColor: index === currentReview ? '#1f2937' : '#d1d5db'
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Call to Action (unchanged) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="p-8 rounded-2xl" style={{ backgroundColor: '#f8fafc' }}>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1f2937' }}>
                    Ready to Get Started?
                  </h3>
                  <p className="text-lg mb-6" style={{ color: '#6b7280' }}>
                    Contact us today to discuss your project and get a personalized quote.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {provider.phone && (
                      <Link
                        href={`tel:${provider.phone}`}
                        className="px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-200 text-white shadow-lg"
                        style={{ backgroundColor: '#1f2937' }}
                      >
                        Call Now
                      </Link>
                    )}
                    {provider.email && (
                      <Link
                        href={`mailto:${provider.email}`}
                        className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 hover:scale-105 transition-all duration-200"
                        style={{ 
                          borderColor: '#1f2937', 
                          color: '#1f2937',
                          backgroundColor: 'transparent'
                        }}
                      >
                        Send Email
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceProviderListing;