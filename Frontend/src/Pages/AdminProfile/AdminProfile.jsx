import { useState, useEffect, useRef } from "react";
import {
  Users,
  Briefcase,
  Package,
  Shield,
  Settings,
  BarChart3,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp,
  Eye,
  HelpCircle,
  Bell,
  Database,
  Lock,
  Globe,
  Star,
  LogOut,
  CheckCircle,
  Camera,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import databaseService from "@/services/database.services";
import { logout } from "@/slices/userSlice/authSlices";

const AdminProfileDashboard = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalBusinessmen: 0,
    totalServices: 0,
    totalProducts: 0,
    emailVerified: 0,
    phoneVerified: 0,
  });
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const menuGridRef = useRef(null);
  const logoutSectionRef = useRef(null);
  const navigate = useNavigate();

  // Get user data from Redux
  const user = useSelector((state) => state.auth.userData?.user);

  // Fetch admin stats
  const getAdminStats = async () => {
    try {
      setLoading(true);
      const response = await databaseService.getAdminDashboardStats();
      console.log("Admin Stats Response:", response);

      if (response.success && response.data) {
        setAdminStats({
          totalUsers: response.data.totalUsers || 0,
          totalBusinessmen: response.data.totalBusinessmen || 0,
          totalServices: response.data.totalServices || 0,
          totalProducts: response.data.totalProducts || 0,
          emailVerified: response.data.emailVerified || 0,
          phoneVerified: response.data.phoneVerified || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      animateElements();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.username) {
      return user.username;
    }
    return "Admin Manager";
  };

  // Get user avatar
  const getUserAvatar = () => {
    return user?.avatar  || `https://ui-avatars.com/api/?name=${user?.firstName} ${user?.lastName}&background=random`;
  };

  const menuItems = [
    {
      id: "manage-users",
      label: "Manage Users",
      icon: Users,
      description: "View, edit, and manage all registered users",
      badge: `${adminStats.totalUsers} Users`,
      priority: "high",
    },
    {
      id: "manage-businessmen",
      label: "Manage Businessmen",
      icon: Briefcase,
      description: "Oversee business accounts and verifications",
      badge: `${adminStats.totalBusinessmen} Active`,
      priority: "high",
    },
    {
      id: "manage-category",
      label: "Manage Categories",
      icon: FolderTree,
      description: "Add, edit, update and delete product categories",
      priority: "high",
    },
    {
      id: "contactus",
      label: "Contact Us Details",
      icon: MessageSquare,
      description: "Handle customer inquiries and support requests",
      badge: "15 New",
      priority: "medium",
    },
    {
      id: "businessman-verification",
      label: "Businessman Verification Panel",
      icon: BarChart3,
      description: "View and manage the businessman",
      badge: "10 Panel",
      priority: "medium",
    },
    // {
    //   id: "manage-services",
    //   label: "Manage Services",
    //   icon: Settings,
    //   description: "Monitor and approve service listings",
    //   badge: `${adminStats.totalServices} Services`,
    //   priority: "high",
    // },
    // {
    //   id: "manage-products",
    //   label: "Manage Products",
    //   icon: Package,
    //   description: "Oversee product listings and inventory",
    //   badge: `${adminStats.totalProducts} Products`,
    //   priority: "high",
    // },
    // {
    //   id: "content-moderation",
    //   label: "Content Moderation",
    //   icon: Eye,
    //   description: "Review and moderate user-generated content",
    //   priority: "medium",
    // },
    // {
    //   id: "system-settings",
    //   label: "System Settings",
    //   icon: Database,
    //   description: "Configure platform settings and preferences",
    //   badge: null,
    //   priority: "medium",
    // },
    // {
    //   id: "security-center",
    //   label: "Security Center",
    //   icon: Lock,
    //   description: "Monitor security threats and access controls",
    //   badge: "Secure",
    //   priority: "medium",
    // },
    // {
    //   id: "notifications",
    //   label: "Notifications",
    //   icon: Bell,
    //   description: "Manage system-wide notifications",
    //   badge: "8 Alerts",
    //   priority: "medium",
    // },
    // {
    //   id: "reports-logs",
    //   label: "Reports & Logs",
    //   icon: FileText,
    //   description: "Access system logs and generate reports",
    //   badge: null,
    //   priority: "low",
    // },
    // {
    //   id: "platform-activity",
    //   label: "Platform Activity",
    //   icon: Activity,
    //   description: "Monitor real-time platform activity",
    //   badge: "Live",
    //   priority: "medium",
    // },
    // {
    //   id: "revenue-tracking",
    //   label: "Revenue Tracking",
    //   icon: TrendingUp,
    //   description: "Track platform revenue and transactions",
    //   badge: "$52.4k",
    //   priority: "high",
    // },
    {
      id: "feedback-reviews",
      label: "Feedback & Reviews",
      icon: Star,
      description: "Manage user feedback and review system",
      badge: "4.7★",
      priority: "low",
    },
    {
      id: "contactus",
      label: "Help & Support",
      icon: HelpCircle,
      description: "Admin support and documentation",
      badge: null,
      priority: "low",
    },
  ];

  const handleMenuClick = (itemId) => {
    navigate(`/admin/${itemId}`);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("Admin logout");
    setLogoutModal(false);
    dispatch(logout());

    // Add logout logic here
  };

  const headerStats = [
    {
      label: "Total Users",
      value: adminStats.totalUsers,
      suffix: "",
    },
    {
      label: "Total Businessmen",
      value: adminStats.totalBusinessmen,
      suffix: "",
    },
    {
      label: "Total Services",
      value: adminStats.totalServices,
      suffix: "",
    },
    {
      label: "Total Products",
      value: adminStats.totalProducts,
      suffix: "",
    },
    {
      label: "Email Verified",
      value: adminStats.emailVerified,
      suffix: "",
    },
    {
      label: "Phone Verified",
      value: adminStats.phoneVerified,
      suffix: "",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 opacity-30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-300 opacity-20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Modern Admin Header */}
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
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-gray-500">
                  <Camera size={16} className="text-white sm:w-5 sm:h-5" />
                </button>

                {/* Status Indicator */}
                {user?.status === "active" && (
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-white shadow-lg animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left w-full">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                    {getUserDisplayName()}
                  </h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold shadow-lg flex items-center gap-1.5 sm:gap-2 bg-gray-600 text-white transform hover:scale-105 transition-transform duration-300">
                      <Shield size={12} className="sm:w-4 sm:h-4" />
                      <span>{user?.role || "Admin"}</span>
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold shadow-lg flex items-center gap-1.5 sm:gap-2 bg-gray-600 text-white transform hover:scale-105 transition-transform duration-300">
                      <Globe size={12} className="sm:w-4 sm:h-4" />
                      <span>Super User</span>
                    </span>
                  </div>
                </div>

                <p className="text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-300 font-medium">
                  {user?.email || "admin@business.com"}
                </p>
                {user?.phoneNumber && (
                  <p className="text-base sm:text-lg mb-3 sm:mb-4 text-gray-300 font-medium">
                    {user.phoneNumber}
                  </p>
                )}
                <p className="mb-4 sm:mb-6 text-gray-400 text-sm sm:text-base">
                  Admin since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "2022-01-15"}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {headerStats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 bg-opacity-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-600 transition-all duration-300 hover:scale-105 hover:bg-opacity-70"
                    >
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white">
                        {stat.value.toLocaleString()}
                        {stat.suffix}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification Status */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4">
                  {user?.isEmailVerified && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30 shadow-lg">
                      <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-semibold text-xs sm:text-sm">
                        <span className="hidden sm:inline">Email Verified</span>
                        <span className="sm:hidden">Email ✓</span>
                      </span>
                    </div>
                  )}
                  {user?.isPhoneVerified && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30 shadow-lg">
                      <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-semibold text-xs sm:text-sm">
                        <span className="hidden sm:inline">Phone Verified</span>
                        <span className="sm:hidden">Phone ✓</span>
                      </span>
                    </div>
                  )}
                  {user?.role === "admin" && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 bg-green-600 bg-opacity-20 text-green-300 border-green-500 border-opacity-30 shadow-lg">
                      <Shield size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-semibold text-xs sm:text-sm">
                        <span className="hidden sm:inline">Admin Verified</span>
                        <span className="sm:hidden">Admin ✓</span>
                      </span>
                    </div>
                  )}
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

          <div className="relative md:flex md:justify-between md:items-center z-10">
            <div className="flex items-center gap-3 md:space-x-3 sm:gap-4 mb-6 sm:mb-0 ">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md bg-red-100">
                <Shield
                  size={20}
                  className="text-red-600 animate-bounce sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-800">
                  Admin Security
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Secure admin session management
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                onClick={() => setLogoutModal(true)}
                className="flex w-full sm:w-64 items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group bg-red-600 text-white hover:bg-red-700 hover:scale-105 text-sm sm:text-xl"
              >
                <LogOut
                  size={18}
                  className="group-hover:rotate-12 animate-pulse transition-transform duration-300 sm:w-5 sm:h-5"
                />
                <span>Logout</span>
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
                <LogOut
                  size={28}
                  className="text-red-600 animate-bounce sm:w-8 sm:h-8"
                />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">
                Confirm Admin Logout
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Are you sure you want to logout from the admin panel? You'll
                need to sign in again to access admin features.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 text-sm sm:text-base"
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

export default AdminProfileDashboard;
