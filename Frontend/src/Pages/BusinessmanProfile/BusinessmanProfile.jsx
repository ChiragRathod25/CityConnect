import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Activity,
  Briefcase,
  ShoppingBag,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  Camera,
  Bell,
  Store,
  Package,
  TrendingUp,
  Star,
  Eye,
  BarChart3,
  Users,
  Award,
  Target,
  MapPin,
  Globe,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import databaseService from "@/services/database.services";
import Modal from "@/components/Modal";
import PathMapWithRoutingControl from "@/components/map/PathMapWithRoutingControl";

const BusinessmanProfileDashboard = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const menuGridRef = useRef(null);
  const logoutSectionRef = useRef(null);
  const { businessId } = useParams();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const handleOpenMap = () => setIsMapModalOpen(true);
  const handleCloseMap = () => setIsMapModalOpen(false);

  const navigate = useNavigate();

  const [businessProfile, setBusinessProfile] = useState(null);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);
        const response = await databaseService.getBusinessProfileById(
          businessId
        );
        console.log("Business profile fetched:", response.data);
        setBusinessProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setError(error.message || "Failed to fetch business profile");
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessProfile();
    }
  }, [businessId]);

  useEffect(() => {
    if (!businessProfile) return;

    const timer = setTimeout(() => {
      setIsLoaded(true);
      animateElements();
    }, 300);
    return () => clearTimeout(timer);
  }, [businessProfile]);

  const animateElements = () => {
    if (headerRef.current) {
      headerRef.current.style.animation =
        "slideInFromTop 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards";
    }
    const menuItems = menuGridRef.current?.children;
    if (menuItems) {
      Array.from(menuItems).forEach((item, index) => {
        item.style.animation = `slideInFromBottom 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${
          index * 0.1
        }s forwards`;
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
      });
    }
    if (logoutSectionRef.current) {
      logoutSectionRef.current.style.animation =
        "fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.8s forwards";
    }
  };

  const getOwnerName = () => {
    if (!businessProfile) return "";
    const { ownerDetails } = businessProfile;
    if (ownerDetails.firstName && ownerDetails.lastName) {
      return `${ownerDetails.firstName} ${ownerDetails.lastName}`;
    }
    return ownerDetails.username || "Business Owner";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (!businessProfile) return "bg-gray-600 text-gray-100";
    const statusColors = {
      active: "bg-green-600 text-green-100",
      pending: "bg-yellow-600 text-yellow-100",
      rejected: "bg-red-600 text-red-100",
      inactive: "bg-gray-600 text-gray-100",
    };
    return statusColors[businessProfile.status] || statusColors.pending;
  };

  const menuItems = businessProfile
    ? [
        {
          id: "business-info",
          label: "Business Information",
          icon: Store,
          description: `Manage ${businessProfile.name} details and settings`,
          badge: businessProfile.type,
          priority: "high",
        },
        {
          id: "profile-info",
          label: "Profile Info",
          icon: User,
          description: "Manage your personal information and preferences",
          badge: null,
          priority: "high",
        },
        {
          id: "location",
          label: "Business Location",
          icon: MapPin,
          description:
            businessProfile.locationDetails?.address ||
            "Set your business location",
          badge: businessProfile.locationDetails?.city || null,
          priority: "high",
        },
        {
          id: "contact",
          label: "Contact Information",
          icon: Phone,
          description: "Manage business contact details",
          badge: businessProfile.contactDetails?.phone || null,
          priority: "high",
        },
        {
          id: "working-hours",
          label: "Working Hours",
          icon: Clock,
          description: businessProfile.workingHoursDetails
            ? `${businessProfile.workingHoursDetails.openTime} - ${businessProfile.workingHoursDetails.closeTime}`
            : "Set your business operating hours",
          badge: businessProfile.workingHoursDetails?.isClosed
            ? "Closed"
            : "Open",
          priority: "medium",
        },
        {
          id: "change-email",
          label: "Update Email Address",
          icon: Mail,
          description: "Update and secure your email address",
          badge: businessProfile.ownerDetails.isEmailVerified
            ? "Verified"
            : "Unverified",
          priority: businessProfile.ownerDetails.isEmailVerified
            ? "low"
            : "high",
        },
        {
          id: "change-phone",
          label: "Update Phone Number",
          icon: Phone,
          description: "Update and secure your phone number",
          badge: businessProfile.ownerDetails.isPhoneVerified
            ? "Verified"
            : "Unverified",
          priority: businessProfile.ownerDetails.isPhoneVerified
            ? "low"
            : "medium",
        },
        {
          id: "password-update",
          label: "Security Settings",
          icon: Lock,
          description: "Update password and security preferences",
          badge: null,
          priority: "medium",
        },
        {
          id: "status",
          label: "Account Status",
          icon: Activity,
          description: "Monitor your account health and activity",
          badge:
            businessProfile.status.charAt(0).toUpperCase() +
            businessProfile.status.slice(1),
          priority: "medium",
        },
        {
          id: "verification",
          label: "Business Verification",
          icon: Award,
          description: businessProfile.isVerified
            ? "Your business is verified"
            : "Complete verification process",
          badge: businessProfile.isVerified ? "Verified" : "Pending",
          priority: businessProfile.isVerified ? "low" : "high",
        },
        {
          id: "orders",
          label: "Order History",
          icon: ShoppingBag,
          description: "Track and manage your purchases",
          badge: "View All",
          priority: "high",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          description: "Manage your alerts and preferences",
          badge: null,
          priority: "medium",
        },
        {
          id: "seller-dashboard",
          label: "Seller Dashboard",
          icon: BarChart3,
          description: "View your business performance and analytics",
          badge: "Analytics",
          priority: "high",
        },
        {
          id: "products",
          label: "Your Products",
          icon: Package,
          description: "Manage your product listings and inventory",
          badge: businessProfile.type === "product" ? "Active" : null,
          priority: "high",
        },
        {
          id: "services",
          label: "Your Services",
          icon: Briefcase,
          description: "Showcase your skills and expertise",
          badge: businessProfile.type === "service" ? "Active" : null,
          priority: "high",
        },
        {
          id: "sales",
          label: "Sales History",
          icon: TrendingUp,
          description: "Track your sales and revenue",
          badge: null,
          priority: "high",
        },
        {
          id: "reviews",
          label: "Reviews & Ratings",
          icon: Star,
          description: "Manage customer feedback and ratings",
          badge: businessProfile.averageRating
            ? `${businessProfile.averageRating.toFixed(1)}★ (${
                businessProfile.reviewCount
              })`
            : null,
          priority: "medium",
        },
        {
          id: "customers",
          label: "Customer Management",
          icon: Users,
          description: "Communicate with your customers",
          badge: "Messages",
          priority: "medium",
        },
        {
          id: "analytics",
          label: "Performance Analytics",
          icon: Eye,
          description: "Detailed insights and performance metrics",
          badge: null,
          priority: "medium",
        },
        {
          id: "promotions",
          label: "Promotions & Deals",
          icon: Target,
          description: "Create and manage promotional campaigns",
          badge: null,
          priority: "medium",
        },
        {
          id: "social-media",
          label: "Social Media",
          icon: Globe,
          description: "Manage your social media presence",
          badge: businessProfile.contactDetails?.website ? "Connected" : null,
          priority: "medium",
        },
        {
          id: "support",
          label: "Help & Support",
          icon: HelpCircle,
          description: "24/7 assistance and troubleshooting",
          badge: null,
          priority: "low",
        },
        {
          id: "about",
          label: "Platform Info",
          icon: Info,
          description: "Learn about features and updates",
          badge: null,
          priority: "low",
        },
      ]
    : [];

  const handleMenuClick = (itemId) => {
    navigate(itemId);
  };

  const handleLogout = (logoutAll = false) => {
    console.log(
      logoutAll ? "Logout from all devices" : "Logout from this device"
    );
    setLogoutModal(false);
  };

  const headerStats = businessProfile
    ? [
        {
          label: "Reviews",
          value: businessProfile.reviewCount || 0,
          suffix: "",
        },
        {
          label: "Rating",
          value: businessProfile.averageRating
            ? businessProfile.averageRating.toFixed(1)
            : "N/A",
          suffix: " ★",
        },
        {
          label: "Type",
          value:
            businessProfile.type.charAt(0).toUpperCase() +
            businessProfile.type.slice(1),
          suffix: "",
        },
        {
          label: "Category",
          value:
            businessProfile.category.charAt(0).toUpperCase() +
            businessProfile.category.slice(1),
          suffix: "",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading business profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800">
            Error Loading Profile
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!businessProfile) return null;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <Modal
        isOpen={isMapModalOpen}
        onClose={handleCloseMap}
        title="Business Location"
      >
        {businessProfile.locationDetails?.lat && businessProfile.locationDetails?.lng ? (
          <PathMapWithRoutingControl
            mode="delivery"
            height={400}
            width="100%"
            businessLocationData={[
              businessProfile.locationDetails.lat,
              businessProfile.locationDetails.lng,
            ]}
          />
        ) : (
          <p className="text-gray-700 text-center py-4">
            No location coordinates available for this business.
          </p>
        )}
      </Modal>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 opacity-30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-300 opacity-20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Modern Profile Header */}
        <div
          ref={headerRef}
          className="bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 shadow-2xl relative overflow-hidden border border-gray-700"
          style={{ opacity: 0, transform: "translateY(-30px)" }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gray-700 opacity-20 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full p-1 bg-gray-600 shadow-2xl">
                  <img
                    src={
                      businessProfile.ownerDetails.avatar ||
                      "/api/placeholder/120/120"
                    }
                    alt={getOwnerName()}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-gray-500">
                  <Camera size={16} className="text-white sm:w-5 sm:h-5" />
                </button>

                {/* Status Indicator */}
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 sm:border-4 border-white shadow-lg ${
                      businessProfile.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left w-full">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                    {getOwnerName()}
                  </h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                    <span
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold shadow-lg flex items-center gap-1.5 sm:gap-2 ${getStatusBadge()} transform hover:scale-105 transition-transform duration-300`}
                    >
                      <Activity size={12} className="sm:w-4 sm:h-4" />
                      <span>
                        {businessProfile.status.charAt(0).toUpperCase() +
                          businessProfile.status.slice(1)}
                      </span>
                    </span>
                    {businessProfile.isVerified && (
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold shadow-lg flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white transform hover:scale-105 transition-transform duration-300">
                        <Award size={12} className="sm:w-4 sm:h-4" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Business Name */}
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                    <Store size={20} className="sm:w-6 sm:h-6" />
                    {businessProfile.name}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base capitalize">
                    {businessProfile.category} • {businessProfile.type}
                  </p>
                </div>

                <p className="text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-300 font-medium">
                  {businessProfile.ownerDetails.email}
                </p>

                {/* Business Description */}
                {businessProfile.description && (
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto lg:mx-0">
                    {businessProfile.description}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {headerStats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 bg-opacity-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-600 transition-all duration-300 hover:scale-105 hover:bg-opacity-70"
                    >
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white">
                        {stat.value}
                        {stat.suffix}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mb-4 sm:mb-6 text-gray-400 text-sm sm:text-base">
                  Member since {formatDate(businessProfile.createdAt)}
                </p>

                {/* Location Info */}
                {businessProfile.locationDetails && (
                  <div className="bg-gray-700 bg-opacity-50 rounded-xl p-3 sm:p-4 mb-4 border border-gray-600 inline-flex items-center justify-between w-full max-w-md">
                    <div className="flex items-start gap-2 text-left">
                      <MapPin
                        size={16}
                        className="text-gray-300 mt-1 sm:w-5 sm:h-5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">
                          {businessProfile.locationDetails.address}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {businessProfile.locationDetails.city},{" "}
                          {businessProfile.locationDetails.state}{" "}
                          {businessProfile.locationDetails.postalCode}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenMap}
                      className="ml-3 bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium shadow-md transition-all duration-300"
                    >
                      View on Map
                    </button>
                  </div>
                )}

                {/* Verification Status */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4">
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      businessProfile.ownerDetails.isEmailVerified
                        ? "bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30"
                        : "bg-red-600 bg-opacity-20 text-red-300 border-red-500 border-opacity-30"
                    } shadow-lg`}
                  >
                    {businessProfile.ownerDetails.isEmailVerified ? (
                      <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <XCircle size={14} className="sm:w-4 sm:h-4" />
                    )}
                    <span className="font-semibold text-xs sm:text-sm">
                      <span className="hidden sm:inline">
                        Email{" "}
                        {businessProfile.ownerDetails.isEmailVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                      <span className="sm:hidden">
                        Email{" "}
                        {businessProfile.ownerDetails.isEmailVerified
                          ? "✓"
                          : "✗"}
                      </span>
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      businessProfile.ownerDetails.isPhoneVerified
                        ? "bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30"
                        : "bg-red-600 bg-opacity-20 text-red-300 border-red-500 border-opacity-30"
                    } shadow-lg`}
                  >
                    {businessProfile.ownerDetails.isPhoneVerified ? (
                      <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <XCircle size={14} className="sm:w-4 sm:h-4" />
                    )}
                    <span className="font-semibold text-xs sm:text-sm">
                      <span className="hidden sm:inline">
                        Phone{" "}
                        {businessProfile.ownerDetails.isPhoneVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                      <span className="sm:hidden">
                        Phone{" "}
                        {businessProfile.ownerDetails.isPhoneVerified
                          ? "✓"
                          : "✗"}
                      </span>
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      businessProfile.isVerified
                        ? "bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30"
                        : "bg-yellow-600 bg-opacity-20 text-yellow-300 border-yellow-500 border-opacity-30"
                    } shadow-lg`}
                  >
                    <Store size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-semibold text-xs sm:text-sm">
                      <span className="hidden sm:inline">
                        Business{" "}
                        {businessProfile.isVerified ? "Verified" : "Pending"}
                      </span>
                      <span className="sm:hidden">
                        Business {businessProfile.isVerified ? "✓" : "Pending"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Menu Grid */}
        <div
          ref={menuGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8"
        >
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl border border-gray-200 relative overflow-hidden h-full transition-all duration-500 group-hover:border-gray-300">
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Icon and Badge Row */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-md bg-gray-800 group-hover:bg-gray-700">
                        <IconComponent
                          size={20}
                          className="text-white sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {item.badge && (
                          <span className="px-2 sm:px-3 py-1 text-xs rounded-full font-semibold shadow-lg text-white bg-gray-800 group-hover:scale-110 transition-transform duration-300">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 sm:w-5 sm:h-5"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {item.label}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Logout Section */}
        <div
          ref={logoutSectionRef}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 relative overflow-hidden"
          style={{ opacity: 0, transform: "translateY(30px)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 opacity-50 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md bg-red-100">
                <Shield
                  size={20}
                  className="text-red-600 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-800">
                  Security Actions
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Manage your session and account security
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setLogoutModal(true)}
                className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-2 border-red-200 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group bg-white text-red-600 hover:bg-red-50 hover:scale-105 text-sm sm:text-base"
              >
                <LogOut
                  size={18}
                  className="group-hover:rotate-12 transition-transform duration-300 sm:w-5 sm:h-5"
                />
                <span className="hidden sm:inline">
                  Logout from this device
                </span>
                <span className="sm:hidden">Logout Device</span>
              </button>

              <button
                onClick={() => setLogoutModal(true)}
                className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group bg-red-600 text-white hover:bg-red-700 hover:scale-105 text-sm sm:text-base"
              >
                <Shield
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300 sm:w-5 sm:h-5"
                />
                <span className="hidden sm:inline">
                  Logout from all devices
                </span>
                <span className="sm:hidden">Logout All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Modal */}
      {logoutModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl transform animate-scaleIn border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100 shadow-xl">
                <LogOut size={28} className="text-red-600 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">
                Confirm Logout
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={() => handleLogout(false)}
                className="w-full py-3 sm:py-4 border-2 border-red-200 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-red-600 bg-white hover:bg-red-50 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                <span className="hidden sm:inline">
                  Logout This Device Only
                </span>
                <span className="sm:hidden">Logout Device</span>
              </button>
              <button
                onClick={() => handleLogout(true)}
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Logout All Devices</span>
                <span className="sm:hidden">Logout All</span>
              </button>
              <button
                onClick={() => setLogoutModal(false)}
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(-20px) rotate(240deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(-120deg);
          }
          66% {
            transform: translateY(-30px) rotate(-240deg);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BusinessmanProfileDashboard;
