// import React from "react";
// import databaseService from "@/services/database.services";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// function AllBusinesses() {
//   const [businesses, setBusinesses] = useState([]);

//   const navigate=useNavigate();
//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       try {
//         const response = await databaseService.getAllBusinesses();
//         console.log("Fetched businesses:", response.data);
//         setBusinesses(response.data);
//       } catch (error) {
//         console.error("Error fetching businesses:", error);
//       }
//     };

//     fetchBusinesses();
//   }, []);


//   const handleClick = (businessId) => {
//     console.log("Business ID clicked:", businessId);
//     // You can add more logic here, such as navigating to a business detail page
//     navigate(`/dashboard/business/${businessId}`);
//   };

//   return (
//     <div>
//       <h1>All Businesses</h1>
//       <ul>
//           {businesses.map((business) => (
//             <li key={business._id} onClick={() => handleClick(business._id)}>
//               {business.name}
//             </li>
//           ))}
//         </ul>
//     </div>
//   );
// }

// export default AllBusinesses;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Calendar,
  Users,
  TrendingUp,
  BadgeCheck,
  Package,
  Briefcase,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import databaseService from "@/services/database.services";
import { useNavigate } from "react-router-dom";

const mockBusinesses = [
  {
    _id: "1",
    name: "Premium Coffee House",
    type: "product",
    category: "cafe",
    description: "A cozy coffee shop offering artisanal coffee, fresh pastries, and a welcoming atmosphere for all coffee lovers.",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
    ],
    establishedYear: 2018,
    numberOfEmployees: 15,
    annualRevenue: 500000,
    status: "active",
    isVerified: true,
    verifiedAt: "2024-01-15",
    createdAt: "2024-01-10",
  },
  {
    _id: "2",
    name: "Elite Fitness Center",
    type: "service",
    category: "gym",
    description: "Modern gym facility with state-of-the-art equipment, professional trainers, and customized fitness programs.",
    logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    ],
    establishedYear: 2020,
    numberOfEmployees: 25,
    annualRevenue: 800000,
    status: "active",
    isVerified: true,
    verifiedAt: "2024-02-20",
    createdAt: "2024-02-15",
  },
  {
    _id: "3",
    name: "Beauty & Style Salon",
    type: "both",
    category: "salon",
    description: "Full-service salon offering haircuts, styling, coloring, spa treatments, and premium beauty products.",
    logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
    ],
    establishedYear: 2019,
    numberOfEmployees: 12,
    annualRevenue: 350000,
    status: "pending",
    isVerified: false,
    createdAt: "2024-10-01",
  },
  {
    _id: "4",
    name: "Tech Solutions Hub",
    type: "service",
    category: "services",
    description: "Professional IT consulting and software development services for businesses of all sizes.",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    ],
    establishedYear: 2021,
    numberOfEmployees: 30,
    annualRevenue: 1200000,
    status: "suspended",
    isVerified: true,
    verifiedAt: "2024-03-10",
    createdAt: "2024-03-05",
  },
  {
    _id: "5",
    name: "Gourmet Restaurant",
    type: "product",
    category: "restaurant",
    description: "Fine dining experience with authentic cuisine and exceptional service.",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    ],
    establishedYear: 2017,
    numberOfEmployees: 40,
    annualRevenue: 950000,
    status: "active",
    isVerified: true,
    verifiedAt: "2024-01-20",
    createdAt: "2024-01-15",
  },
  {
    _id: "6",
    name: "Pet Care Clinic",
    type: "service",
    category: "veterinary",
    description: "Comprehensive veterinary services with caring staff and modern facilities.",
    logo: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&h=600&fit=crop",
    ],
    establishedYear: 2019,
    numberOfEmployees: 18,
    annualRevenue: 600000,
    status: "active",
    isVerified: true,
    verifiedAt: "2024-02-10",
    createdAt: "2024-02-05",
  },
  {
    _id: "7",
    name: "Bookstore & Cafe",
    type: "both",
    category: "retail",
    description: "A cozy space combining books, coffee, and community events.",
    logo: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
    ],
    establishedYear: 2020,
    numberOfEmployees: 10,
    annualRevenue: 280000,
    status: "active",
    isVerified: false,
    createdAt: "2024-09-15",
  },
];

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
      {/* Previous Button */}
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

      {/* Page Input */}
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

      {/* Next Button */}
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

const AllBusinesses = () => {
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination values
  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBusinesses = businesses.slice(startIndex, endIndex);

    // Fetch businesses on component mount
  useEffect(() => {
    // Replace with actual API call
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await databaseService.getAllBusinesses();
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const statusColors = {
    pending: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    active: { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
    suspended: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
    closed: { bg: "#e5e7eb", text: "#374151", border: "#d1d5db" },
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "product":
        return <Package className="w-5 h-5" />;
      case "service":
        return <Briefcase className="w-5 h-5" />;
      case "both":
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <Store className="w-5 h-5" />;
    }
  };

  const navigate=useNavigate();
  const handleViewDetails = (businessId) => {
    navigate(`/dashboard/business/${businessId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 lg:py-12" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"
            style={{ backgroundColor: "#1f2937" }}
          >
            <Store className="w-8 animate-bounce h-8 md:w-10 md:h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: "#1f2937" }}>
            My Businesses
          </h1>

          <p className="text-lg md:text-xl" style={{ color: "#6b7280" }}>
            Manage and view all your business listings
          </p>
        </motion.div>

        {/* No Businesses State */}
        {businesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 md:py-24"
          >
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#e2e8f0" }}
            >
              <Store className="w-16 h-16 md:w-20 md:h-20" style={{ color: "#6b7280" }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#1f2937" }}>
              No Businesses Yet
            </h2>
            <p className="text-lg mb-6 text-center max-w-md" style={{ color: "#6b7280" }}>
              You haven't created any businesses yet. Start by adding your first business listing.
            </p>
            <button
              className="px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-200 text-white shadow-lg"
              style={{ backgroundColor: "#1f2937" }}
            >
              Create Business
            </button>
          </motion.div>
        ) : (
          <>
            {/* Business Count */}
            <div className="mb-6">
              <div
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                style={{ backgroundColor: "#edf2f4" }}
              >
                <Store className="w-5 h-5" style={{ color: "#1f2937" }} />
                <span className="font-semibold" style={{ color: "#1f2937" }}>
                  Total Businesses: {businesses.length} | Showing {startIndex + 1}-{Math.min(endIndex, businesses.length)}
                </span>
              </div>
            </div>

            {/* Businesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBusinesses.map((business, index) => (
                <motion.div
                  key={business._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {/* Business Image */}
                  <div className="relative h-48">
                    <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                      <img
                        src={business.images[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80"}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Status Badge */}
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-sm"
                      style={{
                        backgroundColor: statusColors[business.status].bg,
                        color: statusColors[business.status].text,
                        border: `2px solid ${statusColors[business.status].border}`,
                      }}
                    >
                      {business.status}
                    </div>

                    {/* Type Badge */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 backdrop-blur-md"
                      style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#ffffff" }}
                    >
                      {getTypeIcon(business.type)}
                      <span className="capitalize">{business.type==="both" ? "Product & Service" : business.type}</span>
                    </div>

                    {/* Logo */}
                    <div className="absolute -bottom-10 left-4 z-10">
                      <div className="w-16 h-16 rounded-xl ring-4 ring-white shadow-xl overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                        {business.logo ? (
                          <img
                            src={business.logo}
                            alt={`${business.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: "#e2e8f0" }}
                          >
                            <Store className="w-8 h-8" style={{ color: "#154ab2ff" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="p-5 pt-12">
                    {/* Name and Verification */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold flex-1 pr-2" style={{ color: "#1f2937" }}>
                        {business.name}
                      </h3>
                      {business.isVerified && (
                        <BadgeCheck className="w-6 h-6 flex-shrink-0 text-blue-500" />
                      )}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-semibold capitalize"
                        style={{ backgroundColor: "#e2e8f0", color: "#1f2937" }}
                      >
                        {business.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: "#6b7280" }}>
                      {business.description}
                    </p>

                    {/* Business Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" style={{ color: "#6b7280" }} />
                          <span style={{ color: "#6b7280" }}>Established</span>
                        </div>
                        <span className="font-semibold" style={{ color: "#1f2937" }}>
                          {business.establishedYear}
                        </span>
                      </div>

                      {business.numberOfEmployees && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" style={{ color: "#6b7280" }} />
                            <span style={{ color: "#6b7280" }}>Employees</span>
                          </div>
                          <span className="font-semibold" style={{ color: "#1f2937" }}>
                            {business.numberOfEmployees}
                          </span>
                        </div>
                      )}

                      {business.annualRevenue && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4" style={{ color: "#6b7280" }} />
                            <span style={{ color: "#6b7280" }}>Revenue</span>
                          </div>
                          <span className="font-semibold" style={{ color: "#1f2937" }}>
                            ${(business.annualRevenue / 1000).toFixed(0)}K
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 text-white"
                      style={{ backgroundColor: "#1f2937" }}
                      onClick={() => handleViewDetails(business._id)}
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
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
    </div>
  );
};

export default AllBusinesses;