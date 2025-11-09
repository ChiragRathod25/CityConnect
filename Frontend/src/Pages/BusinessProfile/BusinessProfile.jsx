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
  Store,
  Briefcase,
  DollarSign,
  TrendingUp,
  Building2,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import ReviewSection from "./BusinessReviewSection";
import databaseService from "@/services/database.services";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@/components/Modal.jsx";
import PathMapWithRoutingControl from "@/components/map/PathMapWithRoutingControl";

// Mock data - replace with actual API calls
const mockBusinessData = {
  business: {
    _id: "1",
    name: "Premium Business Solutions",
    type: "both",
    category: "services",
    description:
      "We provide top-notch business solutions including consulting, development, and support services. Our team of experts ensures quality delivery for all your business needs.",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=600&fit=crop",
    ],
    establishedYear: 2015,
    numberOfEmployees: 50,
    annualRevenue: 5000000,
    status: "active",
    isVerified: true,
    verifiedAt: "2024-01-15",
  },
  contact: {
    phone: "+1 (555) 123-4567",
    email: "contact@premiumbusiness.com",
    website: "https://premiumbusiness.com",
    socialMedia: {
      facebook: "https://facebook.com/premiumbusiness",
      twitter: "https://twitter.com/premiumbusiness",
      instagram: "https://instagram.com/premiumbusiness",
      linkedin: "https://linkedin.com/company/premiumbusiness",
      youtube: "https://youtube.com/premiumbusiness",
    },
  },
  location: {
    address: "123 Business Street, Suite 100",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
  },
  hours: [
    {
      dayOfWeek: "Monday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Tuesday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Wednesday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Thursday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Friday",
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    },
    {
      dayOfWeek: "Saturday",
      openTime: "10:00",
      closeTime: "16:00",
      isClosed: false,
    },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true },
  ],
  products: Array.from({ length: 15 }, (_, i) => ({
    _id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    description:
      "High-quality product with excellent features and durability. Perfect for your business needs.",
    price: 99.99 + i * 10,
    stock: 50 + i * 5,
    category: "Electronics",
    brand: "Premium Brand",
    images: [
      `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&sig=${i}`,
    ],
    tags: ["popular", "new"],
    warranty: "1 year",
    deliveryCharge: 5.99,
    returnPolicyDays: 30,
  })),
  services: Array.from({ length: 12 }, (_, i) => ({
    _id: `serv-${i + 1}`,
    name: `Service ${i + 1}`,
    description:
      "Professional service delivered by experienced experts with guaranteed satisfaction and quality results.",
    price: 199.99 + i * 20,
    duration: "2 hours",
    serviceType: i % 3 === 0 ? "onsite" : i % 3 === 1 ? "offsite" : "remote",
    availability: "Mon-Fri 9AM-6PM",
    category: "Professional Services",
    images: [
      `https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop&sig=${i}`,
    ],
    tags: ["recommended", "popular"],
    warrantyDays: 30,
    cancellationPolicy: "flexible",
    isActive: true,
  })),
  reviews: [],
  averageRating: 0,
  reviewCount: 0,
  ownerDetails: null,
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputPage(value);

    const pageNum = parseInt(value);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden font-medium">Previous</span>
        </div>
      </motion.button>

      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-auto justify-center">
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          Page
        </span>
        <input
          type="text"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={() => {
            const pageNum = parseInt(inputPage);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
              setInputPage(currentPage.toString());
            }
          }}
          className="w-16 sm:w-20 text-center border-2 border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-lg font-semibold sm:font-bold text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/20 shadow-inner"
        />
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          of {totalPages}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="sm:hidden font-medium">Next</span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </motion.button>
    </div>
  );
};

const BusinessProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [businessData, setBusinessData] = useState(mockBusinessData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const itemsPerPage = 6;

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const handleOpenMap = () => setIsMapModalOpen(true);
  const handleCloseMap = () => setIsMapModalOpen(false);

  const { businessId } = useParams();

  const fetchBusinessData = async (businessId) => {
    setLoading(true);
    try {
      const response = await databaseService.getBusinessProfileById(businessId);
      const data = response.data;


      const products=await databaseService.getProductsByBusinessId(businessId);
      const services=await databaseService.getAllServicesByBusinessId(businessId);
      data.products=products.data;
      data.services=services.data;
      
      // Transform backend response to match component structure
      const transformedData = {
        business: {
          _id: data._id,
          name: data.name,
          type: data.type,
          category: data.category,
          description: data.description,
          logo:
            data.logo ||
            data.ownerDetails?.avatar ||
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
          images:
            data.images && data.images.length > 0
              ? data.images
              : [
                  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
                ],
          establishedYear: data.establishedYear || null,
          numberOfEmployees: data.numberOfEmployees || 0,
          annualRevenue: data.annualRevenue || 0,
          status: data.status,
          isVerified: data.isVerified,
          verifiedAt: data.verifiedAt,
        },
        contact: {
          phone: data.contactDetails?.phone || "",
          email: data.contactDetails?.email || "",
          website: data.contactDetails?.website || "",
          socialMedia: data.contactDetails?.socialMedia || {},
        },
        location: {
          address: data.locationDetails?.address || "",
          city: data.locationDetails?.city || "",
          state: data.locationDetails?.state || "",
          postalCode: data.locationDetails?.postalCode || "",
          country: data.locationDetails?.country || "",
          lat: data.locationDetails?.lat || 0,
          lng: data.locationDetails?.lng || 0,
        },
        hours: data.workingHoursDetails
          ? Array.isArray(data.workingHoursDetails)
            ? data.workingHoursDetails
            : [data.workingHoursDetails]
          : [],
        products: data.products || [],
        services: data.services || [],
        reviews: data.reviews || [],
        averageRating: data.averageRating || 0,
        reviewCount: data.reviewCount || 0,
        ownerDetails: data.ownerDetails || null,
      };

      setBusinessData(transformedData);

      // Set active tab based on available data
      if (
        transformedData.products.length === 0 &&
        transformedData.services.length > 0
      ) {
        setActiveTab("services");
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      // Fallback to mock data on error
      setBusinessData(mockBusinessData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessData(businessId);
    }
  }, [businessId]);

  const { business, contact, location, hours, products, services, reviews } =
    businessData;

  const nextImage = () => {
    if (business.images && business.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % business.images.length);
    }
  };

  const prevImage = () => {
    if (business.images && business.images.length > 0) {
      setSelectedImage(
        (prev) => (prev - 1 + business.images.length) % business.images.length
      );
    }
  };

  const socialColors = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    twitter: "#1DA1F2",
    youtube: "#FF0000",
    linkedin: "#0077B5",
  };

  const statusColors = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    active: { bg: "#d1fae5", text: "#065f46" },
    suspended: { bg: "#fee2e2", text: "#991b1b" },
    closed: { bg: "#e5e7eb", text: "#374151" },
  };

  const totalProductPages = Math.ceil(products.length / itemsPerPage);
  const totalServicePages = Math.ceil(services.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (productPage - 1) * itemsPerPage,
    productPage * itemsPerPage
  );

  const paginatedServices = services.slice(
    (servicePage - 1) * itemsPerPage,
    servicePage * itemsPerPage
  );

  const navigate = useNavigate();
  const handleProductViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleServiceViewDetails = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };
  const averageRating = businessData.averageRating || 0;
  const reviewCount = businessData.reviewCount || 0;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Modal
        isOpen={isMapModalOpen}
        onClose={handleCloseMap}
        title="Business Location"
        style={{ maxWidth: "800px" }}
      >
        {businessData.location?.lat &&
        businessData.location?.lng ? (
          <PathMapWithRoutingControl
            mode="delivery"
            height={400}
            width="100%"
            businessLocationData={[
              businessData.location.lat,
              businessData.location.lng,
            ]}
          />
        ) : (
          <p className="text-gray-700 text-center py-4">
            No location coordinates available for this business.
          </p>
        )}
      </Modal>

      <div className="container mx-auto px-2 py-6 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div
            className="rounded-3xl shadow-2xl overflow-hidden"
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
                      src={
                        business.images && business.images[selectedImage]
                          ? business.images[selectedImage]
                          : business.logo
                      }
                      alt={`Business ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {business.images && business.images.length > 1 && (
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
                  {business.images && business.images.length > 0 && (
                    <div
                      className="flex items-center space-x-1 px-4 py-2 rounded-xl backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#ffffff",
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {selectedImage + 1} / {business.images.length}
                      </span>
                    </div>
                  )}
                  <div
                    className="px-4 py-2 rounded-xl backdrop-blur-md font-semibold text-sm"
                    style={{
                      backgroundColor: statusColors[business.status].bg,
                      color: statusColors[business.status].text,
                    }}
                  >
                    {business.status.toUpperCase()}
                  </div>
                </div>

                {business.images && business.images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {business.images.map((_, index) => (
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
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl ring-6 ring-white shadow-2xl overflow-hidden">
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {business.isVerified && (
                    <div
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <BadgeCheck className="w-6 h-6 text-blue-500" />
                    </div>
                  )}
                </motion.div>
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
                        {business.name}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span
                        className="px-4 py-2 rounded-xl text-lg font-semibold capitalize"
                        style={{ backgroundColor: "#e2e8f0", color: "#1f2937" }}
                      >
                        {business.category}
                      </span>
                      <span
                        className="px-4 py-2 rounded-xl text-lg font-semibold capitalize"
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#6b7280",
                          border: "2px solid #e2e8f0",
                        }}
                      >
                        {business.type}
                      </span>
                      {reviewCount > 0 && (
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span
                            className="font-bold"
                            style={{ color: "#1f2937" }}
                          >
                            {averageRating.toFixed(1)}
                          </span>
                          <span style={{ color: "#6b7280" }}>
                            ({reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: "#6b7280" }}
                    >
                      {business.description}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="lg:text-right mt-6 lg:mt-0"
                >
                  <div className="space-y-3">
                    {business.establishedYear && (
                      <div className="flex items-center space-x-2 lg:justify-end">
                        <Calendar
                          className="w-5 h-5"
                          style={{ color: "#6b7280" }}
                        />
                        <span style={{ color: "#6b7280" }}>
                          Est. {business.establishedYear}
                        </span>
                      </div>
                    )}
                    {business.numberOfEmployees > 0 && (
                      <div className="flex items-center space-x-2 lg:justify-end">
                        <Users
                          className="w-5 h-5"
                          style={{ color: "#6b7280" }}
                        />
                        <span style={{ color: "#6b7280" }}>
                          {business.numberOfEmployees} Employees
                        </span>
                      </div>
                    )}
                    {businessData.ownerDetails && (
                      <div className="flex items-center space-x-2 lg:justify-end">
                        <Users
                          className="w-5 h-5"
                          style={{ color: "#6b7280" }}
                        />
                        <span style={{ color: "#6b7280" }}>
                          Owner: {businessData.ownerDetails.firstName}{" "}
                          {businessData.ownerDetails.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <h4
                    className="text-xl font-bold flex items-center space-x-2 mb-6"
                    style={{ color: "#1f2937" }}
                  >
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: "#1f2937" }}
                    ></div>
                    <span>Contact Information</span>
                  </h4>

                  <div className="space-y-4">
                    {contact.phone && (
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
                        <span
                          className="font-medium"
                          style={{ color: "#1f2937" }}
                        >
                          {contact.phone}
                        </span>
                      </div>
                    )}

                    {contact.email && (
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
                        <span
                          className="font-medium"
                          style={{ color: "#1f2937" }}
                        >
                          {contact.email}
                        </span>
                      </div>
                    )}

                    {contact.website && (
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
                        <a
                          href={contact.website}
                          className="font-medium hover:underline flex items-center space-x-1"
                          style={{ color: "#3b82f6" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>
                            {contact.website
                              .replace("https://", "")
                              .replace("http://", "")}
                          </span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h4
                    className="text-xl font-bold flex items-center space-x-2 mb-6"
                    style={{ color: "#1f2937" }}
                  >
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: "#1f2937" }}
                    ></div>
                    <span>Location</span>
                  </h4>

                  <div
                    className="p-4 rounded-xl hover:scale-105 transition-transform duration-200"
                    style={{ backgroundColor: "#f8fafc" }}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: "#e2e8f0" }}
                      >
                        <MapPin
                          className="w-6 h-6"
                          style={{ color: "#374151" }}
                        />
                      </div>
                      <div>
                        <div
                          className="font-bold text-sm mb-1"
                          style={{ color: "#1f2937" }}
                        >
                          Address
                        </div>
                        <div className="text-sm" style={{ color: "#6b7280" }}>
                          {location.address}
                          <br />
                          {location.city}, {location.state}{" "}
                          {location.postalCode}
                          <br />
                          {location.country}
                        </div>
                      </div>
                    </div>

                     <button
                      onClick={handleOpenMap}
                      className="ml-3 bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium shadow-md transition-all duration-300"
                    >
                      View on Map
                    </button>
                    
                  </div>
                </motion.div>

                {/* Business Hours */}
                {hours && hours.length > 0 && (
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
                      <span>Business Hours</span>
                    </h4>

                    <div className="space-y-2">
                      {hours.map((hour, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-xl"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <span
                            className="font-medium"
                            style={{ color: "#1f2937" }}
                          >
                            {hour.dayOfWeek}
                          </span>
                          <span style={{ color: "#6b7280" }}>
                            {hour.isClosed
                              ? "Closed"
                              : `${hour.openTime} - ${hour.closeTime}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Social Media */}
                {contact.socialMedia &&
                  Object.values(contact.socialMedia).some((link) => link) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
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

                      <div className="grid grid-cols-2 gap-3">
                        {contact.socialMedia.facebook && (
                          <a
                            href={contact.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                            style={{ backgroundColor: socialColors.facebook }}
                          >
                            <Facebook className="w-5 h-5" />
                            <span className="font-medium text-sm ml-2">
                              Facebook
                            </span>
                          </a>
                        )}
                        {contact.socialMedia.instagram && (
                          <a
                            href={contact.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                            style={{ backgroundColor: socialColors.instagram }}
                          >
                            <Instagram className="w-5 h-5" />
                            <span className="font-medium text-sm ml-2">
                              Instagram
                            </span>
                          </a>
                        )}
                        {contact.socialMedia.twitter && (
                          <a
                            href={contact.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                            style={{ backgroundColor: socialColors.twitter }}
                          >
                            <Twitter className="w-5 h-5" />
                            <span className="font-medium text-sm ml-2">
                              Twitter
                            </span>
                          </a>
                        )}
                        {contact.socialMedia.youtube && (
                          <a
                            href={contact.socialMedia.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                            style={{ backgroundColor: socialColors.youtube }}
                          >
                            <Youtube className="w-5 h-5" />
                            <span className="font-medium text-sm ml-2">
                              YouTube
                            </span>
                          </a>
                        )}
                        {contact.socialMedia.linkedin && (
                          <a
                            href={contact.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 rounded-xl hover:scale-105 transition-all duration-200 text-white"
                            style={{ backgroundColor: socialColors.linkedin }}
                          >
                            <Linkedin className="w-5 h-5" />
                            <span className="font-medium text-sm ml-2">
                              LinkedIn
                            </span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
              </div>

              {/* Products & Services Tabs */}
              {(products.length > 0 || services.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="mt-12"
                >
                  <div className="flex items-center space-x-4 mb-8 overflow-x-auto">
                    {products.length > 0 && (
                      <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                          activeTab === "products"
                            ? "text-white shadow-lg"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor:
                            activeTab === "products" ? "#1f2937" : "#e2e8f0",
                          color:
                            activeTab === "products" ? "#ffffff" : "#1f2937",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5" />
                          <span>Products ({products.length})</span>
                        </div>
                      </button>
                    )}
                    {services.length > 0 && (
                      <button
                        onClick={() => setActiveTab("services")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                          activeTab === "services"
                            ? "text-white shadow-lg"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor:
                            activeTab === "services" ? "#1f2937" : "#e2e8f0",
                          color:
                            activeTab === "services" ? "#ffffff" : "#1f2937",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5" />
                          <span>Services ({services.length})</span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Products Grid */}
                  {activeTab === "products" && products.length > 0 && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProducts.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                                {product.tags &&
                                  product.tags.map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md"
                                      style={{
                                        backgroundColor:
                                          "rgba(31, 41, 55, 0.8)",
                                        color: "#ffffff",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <h5
                                  className="text-xl font-bold flex-1"
                                  style={{ color: "#1f2937" }}
                                >
                                  {product.name}
                                </h5>
                                <span
                                  className="text-xl font-bold ml-2"
                                  style={{ color: "#1f2937" }}
                                >
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>
                              <p
                                className="text-sm mb-4 line-clamp-2"
                                style={{ color: "#6b7280" }}
                              >
                                {product.description}
                              </p>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                  <span style={{ color: "#6b7280" }}>
                                    Stock:
                                  </span>
                                  <span
                                    className="font-semibold"
                                    style={{ color: "#1f2937" }}
                                  >
                                    {product.stock} units
                                  </span>
                                </div>
                                {product.category && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: "#6b7280" }}>
                                      Category:
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#1f2937" }}
                                    >
                                      {product.category}
                                    </span>
                                  </div>
                                )}
                                {product.warranty && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: "#6b7280" }}>
                                      Warranty:
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#1f2937" }}
                                    >
                                      {product.warranty}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                className="w-full py-3 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-200"
                                style={{ backgroundColor: "#1f2937" }}
                                onClick={()=>handleProductViewDetails(product._id)}
                              >
                                View Details
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {totalProductPages > 1 && (
                        <Pagination
                          currentPage={productPage}
                          totalPages={totalProductPages}
                          setCurrentPage={setProductPage}
                        />
                      )}
                    </div>
                  )}

                  {/* Services Grid */}
                  {activeTab === "services" && services.length > 0 && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedServices.map((service, index) => (
                          <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={service.images[0]}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                                {service.tags &&
                                  service.tags.map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md"
                                      style={{
                                        backgroundColor:
                                          "rgba(31, 41, 55, 0.8)",
                                        color: "#ffffff",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                {/* <span
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                    service.isActive
                                      ? "bg-green-500/90"
                                      : "bg-red-500/90"
                                  } text-white`}
                                >
                                  {service.isActive ? "ACTIVE" : "INACTIVE"}
                                </span> */}
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <h5
                                  className="text-xl font-bold flex-1"
                                  style={{ color: "#1f2937" }}
                                >
                                  {service.name}
                                </h5>
                                <span
                                  className="text-xl font-bold ml-2"
                                  style={{ color: "#1f2937" }}
                                >
                                  ${service.price.toFixed(2)}
                                </span>
                              </div>
                              <p
                                className="text-sm mb-4 line-clamp-2"
                                style={{ color: "#6b7280" }}
                              >
                                {service.description}
                              </p>
                              <div className="space-y-2 mb-4">
                                {service.duration && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: "#6b7280" }}>
                                      Duration:
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#1f2937" }}
                                    >
                                      {service.duration}
                                    </span>
                                  </div>
                                )}
                                {service.serviceType && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: "#6b7280" }}>
                                      Type:
                                    </span>
                                    <span
                                      className="font-semibold capitalize"
                                      style={{ color: "#1f2937" }}
                                    >
                                      {service.serviceType}
                                    </span>
                                  </div>
                                )}
                                {service.availability && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: "#6b7280" }}>
                                      Available:
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#1f2937" }}
                                    >
                                      {service.availability}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                className="w-full py-3 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-200"
                                style={{ backgroundColor: "#1f2937" }}
                                onClick={()=>handleServiceViewDetails(service._id)}
                              >
                                View Details
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {totalServicePages > 1 && (
                        <Pagination
                          currentPage={servicePage}
                          totalPages={totalServicePages}
                          setCurrentPage={setServicePage}
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* No Products/Services Message */}
              {products.length === 0 && services.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="mt-12 text-center p-12 rounded-2xl"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <Package
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: "#9ca3af" }}
                  />
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#1f2937" }}
                  >
                    No Products or Services Listed
                  </h3>
                  <p style={{ color: "#6b7280" }}>
                    This business hasn't added any products or services yet.
                  </p>
                </motion.div>
              )}

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <ReviewSection />
              </motion.div>

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
                    Ready to Work With Us?
                  </h3>
                  <p className="text-lg mb-6" style={{ color: "#6b7280" }}>
                    Get in touch today to discuss your needs and discover how we
                    can help your business grow.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-200 text-white shadow-lg"
                        style={{ backgroundColor: "#1f2937" }}
                      >
                        Call Now
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
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

export default BusinessProfilePage;
