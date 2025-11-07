import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ExternalLink,
  Tag,
  Package,
  RefreshCw,
  MapPinned,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import databaseService from "@/services/database.services";

const ServiceProviderListing = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const { serviceId } = useParams();
  
  const fetchingServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await databaseService.getBusinessService(serviceId);
      console.log("Fetched service providers:", response.data);
      setService(response.data);
    } catch (error) {
      console.error("Error fetching service providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingServiceProviders();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <p className="text-xl text-gray-600">Service not found</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (service.images && service.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevImage = () => {
    if (service.images && service.images.length > 0) {
      setSelectedImage(
        (prev) => (prev - 1 + service.images.length) % service.images.length
      );
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const socialColors = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    twitter: "#1DA1F2",
    youtube: "#FF0000",
    linkedin: "#0077B5",
  };

  // Parse tags if they're stored as a string
  const parsedTags = service.tags ? 
    service.tags.map(tag => {
      try {
        return typeof tag === 'string' && tag.startsWith('[') ? JSON.parse(tag) : [tag];
      } catch {
        return [tag];
      }
    }).flat() : [];

  const contactDetails = service.businessContactDetails || {};
  const socialMedia = contactDetails.socialMedia || {};

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container mx-auto px-2 py-6 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div
            className="rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Hero Section */}
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
                      src={service.images && service.images.length > 0 ? service.images[selectedImage] : "https://via.placeholder.com/800x500?text=No+Image"}
                      alt={`Service ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {service.images && service.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-200"
                      style={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        color: "#ffffff",
                      }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-200"
                      style={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        color: "#ffffff",
                      }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute top-6 right-6 flex items-center space-x-3">
                  {service.images && service.images.length > 0 && (
                    <div
                      className="flex items-center space-x-1 px-4 py-2 rounded-xl backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#ffffff",
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {selectedImage + 1} / {service.images.length}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-xl backdrop-blur-md font-semibold text-sm ${
                      service.isActive
                        ? "bg-green-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {service.isActive ? "● ACTIVE" : "● INACTIVE"}
                  </div>
                </div>

                {service.images && service.images.length > 0 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {service.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === selectedImage
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute -bottom-16 left-6 md:left-8 z-10">
                <div className="flex items-end space-x-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl ring-6 ring-white shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Package className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    {service.isActive && (
                      <div
                        className="absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="pt-20 md:pt-24 px-5 md:px-8 lg:px-12 pb-12">
              {/* Header Info */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10">
                <div className="flex-1 lg:pr-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold"
                        style={{ color: "#1f2937" }}
                      >
                        {service.name}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span
                        className="px-4 py-2 rounded-xl text-lg font-semibold"
                        style={{ backgroundColor: "#e2e8f0", color: "#1f2937" }}
                      >
                        {service.category}
                      </span>
                      {service.serviceType && (
                        <div className="flex items-center space-x-2">
                          <MapPinned
                            className="w-5 h-5"
                            style={{ color: "#6b7280" }}
                          />
                          <span
                            className="font-medium capitalize"
                            style={{ color: "#6b7280" }}
                          >
                            {service.serviceType}
                          </span>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center space-x-2">
                          <Clock
                            className="w-5 h-5"
                            style={{ color: "#6b7280" }}
                          />
                          <span
                            className="font-medium"
                            style={{ color: "#6b7280" }}
                          >
                            {service.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    {parsedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {parsedTags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            className="px-4 py-2 rounded-xl text-sm font-medium border-2 hover:scale-105 transition-transform duration-200"
                            style={{
                              borderColor: "#e2e8f0",
                              backgroundColor: "#f8fafc",
                              color: "#374151",
                            }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="lg:text-right mt-6 lg:mt-0"
                >
                  {service.price && (
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#1f2937" }}
                    >
                      ${service.price}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Description */}
              {service.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-12"
                >
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: "#1f2937" }}
                  >
                    About This Service
                  </h3>
                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {service.description}
                  </p>
                </motion.div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-6"
                >
                  <h4
                    className="text-xl font-bold flex items-center space-x-2"
                    style={{ color: "#1f2937" }}
                  >
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: "#1f2937" }}
                    ></div>
                    <span>Contact</span>
                  </h4>

                  <div className="space-y-4">
                    {contactDetails.phone && (
                      <div
                        className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: "#e2e8f0" }}
                        >
                          <Phone
                            className="w-5 h-5"
                            style={{ color: "#374151" }}
                          />
                        </div>
                        <div className="flex-1">
                          <span
                            className="font-medium"
                            style={{ color: "#1f2937" }}
                          >
                            {contactDetails.phone}
                          </span>
                        </div>
                      </div>
                    )}

                    {contactDetails.email && (
                      <div
                        className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: "#e2e8f0" }}
                        >
                          <Mail
                            className="w-5 h-5"
                            style={{ color: "#374151" }}
                          />
                        </div>
                        <div className="flex-1">
                          <span
                            className="font-medium"
                            style={{ color: "#1f2937" }}
                          >
                            {contactDetails.email}
                          </span>
                        </div>
                      </div>
                    )}

                    {contactDetails.website && (
                      <div
                        className="flex items-center space-x-4 p-3 rounded-xl hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: "#e2e8f0" }}
                        >
                          <Globe
                            className="w-5 h-5"
                            style={{ color: "#374151" }}
                          />
                        </div>
                        <div className="flex-1">
                          <a
                            href={contactDetails.website}
                            className="font-medium hover:underline flex items-center space-x-1"
                            style={{ color: "#3b82f6" }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{contactDetails.website.replace('https://', '')}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Service Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <h4
                    className="text-xl font-bold flex items-center space-x-2 mb-6"
                    style={{ color: "#1f2937" }}
                  >
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: "#1f2937" }}
                    ></div>
                    <span>Service Details</span>
                  </h4>

                  <div className="space-y-4">
                    {service.availability && (
                      <div
                        className="p-4 duration-200 transition-transform hover:scale-105 rounded-xl"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: "#e2e8f0" }}
                          >
                            <Clock
                              className="w-6 h-6"
                              style={{ color: "#374151" }}
                            />
                          </div>
                          <div>
                            <div
                              className="font-bold text-sm mb-1"
                              style={{ color: "#1f2937" }}
                            >
                              Availability
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "#6b7280" }}
                            >
                              {service.availability}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.warrantyDays && (
                      <div
                        className="p-4 duration-200 transition-transform hover:scale-105 rounded-xl"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: "#e2e8f0" }}
                          >
                            <Shield
                              className="w-6 h-6"
                              style={{ color: "#374151" }}
                            />
                          </div>
                          <div>
                            <div
                              className="font-bold text-sm mb-1"
                              style={{ color: "#1f2937" }}
                            >
                              Warranty
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "#6b7280" }}
                            >
                              {service.warrantyDays} days
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.cancellationPolicy && (
                      <div
                        className="p-4 duration-200 transition-transform hover:scale-105 rounded-xl"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: "#e2e8f0" }}
                          >
                            <RefreshCw
                              className="w-6 h-6"
                              style={{ color: "#374151" }}
                            />
                          </div>
                          <div>
                            <div
                              className="font-bold text-sm mb-1"
                              style={{ color: "#1f2937" }}
                            >
                              Cancellation Policy
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "#6b7280" }}
                            >
                              {service.cancellationPolicy}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Social Media Section */}
                {socialMedia && Object.values(socialMedia).some(link => link) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    <h4
                      className="text-xl font-bold flex items-center space-x-2 mb-6"
                      style={{ color: "#1f2937" }}
                    >
                      <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: "#1f2937" }}
                      ></div>
                      <span>Follow Us</span>
                    </h4>

                    <div className="flex justify-center flex-wrap gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                      {socialMedia.facebook && (
                        <a
                          href={socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                          style={{ backgroundColor: socialColors.facebook }}
                        >
                          <Facebook className="w-5 h-5" />
                          <span className="hidden sm:inline font-medium text-sm ml-2">
                            Facebook
                          </span>
                        </a>
                      )}
                      {socialMedia.instagram && (
                        <a
                          href={socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                          style={{ backgroundColor: socialColors.instagram }}
                        >
                          <Instagram className="w-5 h-5" />
                          <span className="hidden sm:inline font-medium text-sm ml-2">
                            Instagram
                          </span>
                        </a>
                      )}
                      {socialMedia.twitter && (
                        <a
                          href={socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                          style={{ backgroundColor: socialColors.twitter }}
                        >
                          <Twitter className="w-5 h-5" />
                          <span className="hidden sm:inline font-medium text-sm ml-2">
                            Twitter
                          </span>
                        </a>
                      )}
                      {socialMedia.youtube && (
                        <a
                          href={socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                          style={{ backgroundColor: socialColors.youtube }}
                        >
                          <Youtube className="w-5 h-5" />
                          <span className="hidden sm:inline font-medium text-sm ml-2">
                            YouTube
                          </span>
                        </a>
                      )}
                      {socialMedia.linkedin && (
                        <a
                          href={socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                          style={{ backgroundColor: socialColors.linkedin }}
                        >
                          <Linkedin className="w-5 h-5" />
                          <span className="hidden sm:inline font-medium text-sm ml-2">
                            LinkedIn
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="mt-12 text-center"
              >
                <div
                  className="p-8 rounded-2xl"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: "#1f2937" }}
                  >
                    Ready to Get Started?
                  </h3>
                  <p className="text-lg mb-6" style={{ color: "#6b7280" }}>
                    Contact us today to discuss your project and get a
                    personalized quote.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {contactDetails.phone && (
                      <a
                        href={`tel:${contactDetails.phone}`}
                        className="px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-200 text-white shadow-lg"
                        style={{ backgroundColor: "#1f2937" }}
                      >
                        Call Now
                      </a>
                    )}
                    {contactDetails.email && (
                      <a
                        href={`mailto:${contactDetails.email}`}
                        className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 hover:scale-105 transition-all duration-200"
                        style={{
                          borderColor: "#1f2937",
                          color: "#1f2937",
                          backgroundColor: "transparent",
                        }}
                      >
                        Send Email
                      </a>
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