// import databaseService from '@/services/database.services'
// import React from 'react'
// import { useParams } from 'react-router-dom';

// function AllServicesByBusiness() {
//     const [services, setServices] = React.useState([])

//     const {businessId}=useParams();
//     const fetchServices = async () => {
//         try {
//             const response = await databaseService.getAllServicesByBusinessId(businessId);
//             console.log("Fetched services:", response.data);
//             setServices(response.data);
//         } catch (error) {
//             console.error("Error fetching services:", error);
//         }
//     };

//     React.useEffect(() => {
//         fetchServices();
//     }, []);

//     return (
//         <div>
//             <h2>All Services</h2>
//             <ul>
//                 {services.map(service => (
//                     <li key={service.id}>{service.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default AllServicesByBusiness

import databaseService from "@/services/database.services";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const mockServices = [
  {
    _id: "1",
    name: "Premium Haircut & Styling",
    description:
      "Professional haircut service with expert stylists. Includes consultation, precision cutting, and styling with premium products.",
    category: "Hair Services",
    price: 45,
    duration: "45 mins",
    serviceType: "onsite",
    availability: "Mon–Sat 9AM–7PM",
    tags: ["haircut", "styling", "men", "women"],
    images: [
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=800&h=600&fit=crop",
    ],
    warrantyDays: 7,
    cancellationPolicy: "24hr",
    isActive: true,
  },
  {
    _id: "2",
    name: "Full Body Massage Therapy",
    description:
      "Relaxing full body massage therapy session with aromatherapy oils. Perfect for stress relief and muscle relaxation.",
    category: "Spa & Wellness",
    price: 120,
    duration: "90 mins",
    serviceType: "onsite",
    availability: "Daily 10AM–8PM",
    tags: ["massage", "relaxation", "wellness", "aromatherapy"],
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
    ],
    warrantyDays: 0,
    cancellationPolicy: "48hr",
    isActive: true,
  },
  {
    _id: "3",
    name: "Website Development",
    description:
      "Custom website development with modern technologies. Includes responsive design, SEO optimization, and content management system.",
    category: "Web Services",
    price: 2500,
    duration: "2-4 weeks",
    serviceType: "remote",
    availability: "Mon–Fri 9AM–6PM",
    tags: ["web", "development", "design", "seo"],
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    ],
    warrantyDays: 30,
    cancellationPolicy: "flexible",
    isActive: true,
  },
  {
    _id: "4",
    name: "Personal Training Session",
    description:
      "One-on-one personal training with certified fitness trainer. Customized workout plan and nutrition guidance included.",
    category: "Fitness",
    price: 80,
    duration: "1 hour",
    serviceType: "onsite",
    availability: "Mon–Sun 6AM–9PM",
    tags: ["fitness", "training", "health", "workout"],
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    ],
    warrantyDays: 0,
    cancellationPolicy: "24hr",
    isActive: true,
  },
  {
    _id: "5",
    name: "Home Cleaning Service",
    description:
      "Professional deep cleaning service for your home. Includes all rooms, kitchen, bathrooms, and common areas with eco-friendly products.",
    category: "Home Services",
    price: 150,
    duration: "3 hours",
    serviceType: "offsite",
    availability: "Mon–Sat 8AM–5PM",
    tags: ["cleaning", "home", "deep-clean", "eco-friendly"],
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    ],
    warrantyDays: 7,
    cancellationPolicy: "48hr",
    isActive: true,
  },
  {
    _id: "6",
    name: "Photography Session",
    description:
      "Professional photography session for portraits, events, or products. Includes editing and high-resolution digital copies.",
    category: "Creative Services",
    price: 300,
    duration: "2 hours",
    serviceType: "offsite",
    availability: "Tue–Sun 10AM–6PM",
    tags: ["photography", "portraits", "events", "professional"],
    images: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
    ],
    warrantyDays: 15,
    cancellationPolicy: "48hr",
    isActive: false,
  },
  {
    _id: "7",
    name: "Car Detailing Service",
    description:
      "Complete car detailing including exterior wash, interior cleaning, waxing, and polishing. Makes your car look brand new.",
    category: "Automotive",
    price: 200,
    duration: "4 hours",
    serviceType: "offsite",
    availability: "Mon–Sat 9AM–6PM",
    tags: ["car", "detailing", "cleaning", "automotive"],
    images: [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    ],
    warrantyDays: 7,
    cancellationPolicy: "24hr",
    isActive: true,
  },
];

// Icon Components
const BriefcaseIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DollarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const TagIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ExternalLinkIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInputPage(page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl hover:scale-105 active:scale-95 transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden font-medium">Previous</span>
        </div>
      </button>

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

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl hover:scale-105 active:scale-95 transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="sm:hidden font-medium">Next</span>
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </button>
    </div>
  );
};

const AllServicesByBusiness = () => {
  const [services, setServices] = useState(mockServices);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = services.slice(startIndex, endIndex);
  const { businessId } = useParams();

  useEffect(() => {
    // Fetch services from API
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await databaseService.getAllServicesByBusinessId(
          businessId
        );

        console.log("Fetched services:", response.data);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [businessId]);

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case "onsite":
        return <MapPinIcon className="w-4 h-4" />;
      case "offsite":
        return <PackageIcon className="w-4 h-4" />;
      case "remote":
        return <BriefcaseIcon className="w-4 h-4" />;
      default:
        return <BriefcaseIcon className="w-4 h-4" />;
    }
  };

  const navigate = useNavigate();
  const handleViewDetails = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const getCancellationText = (policy) => {
    switch (policy) {
      case "no-cancel":
        return "No Cancellation";
      case "24hr":
        return "24 Hours Notice";
      case "48hr":
        return "48 Hours Notice";
      case "flexible":
        return "Flexible";
      default:
        return "Flexible";
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-6 lg:py-12"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center animate-fade-in">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-scale-in"
            style={{ backgroundColor: "#1f2937" }}
          >
            <BriefcaseIcon className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce" />
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: "#1f2937" }}
          >
            Your Services
          </h1>

          <p className="text-lg md:text-xl" style={{ color: "#6b7280" }}>
            Listing Your All Services
          </p>
        </div>

        {/* No Services State */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#e2e8f0" }}
            >
              <BriefcaseIcon
                className="w-16 h-16 md:w-20 md:h-20"
                style={{ color: "#6b7280" }}
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "#1f2937" }}
            >
              No Services Available
            </h2>
            <p
              className="text-lg mb-6 text-center max-w-md"
              style={{ color: "#6b7280" }}
            >
              No services have been added yet. Check back soon for updates.
            </p>
          </div>
        ) : (
          <>
            {/* Service Count */}
            <div className="mb-6">
              <div
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                style={{ backgroundColor: "#edf2f4" }}
              >
                <BriefcaseIcon
                  className="w-5 h-5"
                  style={{ color: "#1f2937" }}
                />
                <span className="font-semibold" style={{ color: "#1f2937" }}>
                  Total Services: {services.length} | Showing {startIndex + 1}-
                  {Math.min(endIndex, services.length)}
                </span>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentServices.map((service, index) => (
                <div
                  key={service._id}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-up"
                  style={{
                    backgroundColor: "#ffffff",
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Service Image */}
                  <div className="relative h-48">
                    <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                      <img
                        src={
                          service.images[0] ||
                          "https://via.placeholder.com/800x600?text=Service"
                        }
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Active/Inactive Badge */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-sm ${
                        service.isActive
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-red-100 text-red-800 border-2 border-red-300"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </div>

                    {/* Service Type Badge */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        color: "#ffffff",
                      }}
                    >
                      {getServiceTypeIcon(service.serviceType)}
                      <span className="capitalize">{service.serviceType}</span>
                    </div>

                    {/* Price Tag */}
                    <div
                      className="absolute bottom-3 left-3 px-4 py-2 rounded-xl font-bold text-lg backdrop-blur-md flex items-center space-x-1"
                      style={{
                        backgroundColor: "rgba(31, 41, 55, 0.9)",
                        color: "#ffffff",
                      }}
                    >
                      <DollarIcon className="w-5 h-5" />
                      <span>{service.price}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="p-5">
                    {/* Name */}
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "#1f2937" }}
                    >
                      {service.name}
                    </h3>

                    {/* Category */}
                    <div className="mb-3">
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-semibold"
                        style={{ backgroundColor: "#e2e8f0", color: "#1f2937" }}
                      >
                        {service.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "#6b7280" }}
                    >
                      {service.description}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <ClockIcon
                            className="w-4 h-4"
                            style={{ color: "#6b7280" }}
                          />
                          <span style={{ color: "#6b7280" }}>Duration</span>
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: "#1f2937" }}
                        >
                          {service.duration}
                        </span>
                      </div>

                      {service.availability && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon
                              className="w-4 h-4"
                              style={{ color: "#6b7280" }}
                            />
                            <span style={{ color: "#6b7280" }}>Available</span>
                          </div>
                          <span
                            className="font-semibold text-right"
                            style={{ color: "#1f2937" }}
                          >
                            {service.availability}
                          </span>
                        </div>
                      )}

                      {service.warrantyDays > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <ShieldIcon
                              className="w-4 h-4"
                              style={{ color: "#6b7280" }}
                            />
                            <span style={{ color: "#6b7280" }}>Warranty</span>
                          </div>
                          <span
                            className="font-semibold"
                            style={{ color: "#1f2937" }}
                          >
                            {service.warrantyDays} days
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <XCircleIcon
                            className="w-4 h-4"
                            style={{ color: "#6b7280" }}
                          />
                          <span style={{ color: "#6b7280" }}>
                            Cancel Policy
                          </span>
                        </div>
                        <span
                          className="font-semibold text-right"
                          style={{ color: "#1f2937" }}
                        >
                          {getCancellationText(service.cancellationPolicy)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.tags[0]
                          // remove [ ] and quotes
                          .replace(/[\[\]"]/g, "")
                          // split by comma into array
                          .split(",")
                          // trim spaces and map over each tag
                          .map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1"
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#4b5563",
                              }}
                            >
                              <TagIcon className="w-3 h-3" />
                              <span>{tag.trim()}</span>
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      className="w-full py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-white"
                      style={{ backgroundColor: "#1f2937" }}
                      onClick={() => handleViewDetails(service._id)}
                    >
                      <span>View Details</span>
                      <ExternalLinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AllServicesByBusiness;
