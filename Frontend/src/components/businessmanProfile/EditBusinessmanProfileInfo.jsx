import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Clock,
  CreditCard,
  FileText,
  ChevronRight,
  Edit3,
  Settings,
  Truck,
  Shield,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MoveBackButton from "../ui/MoveBackButton";
import EditLocationAndAddress from "./EditLocationAndAddress";
import EditBusinessDetails from "./EditBusinessDetails";
import BusinessHoursEditor from "./EditOperatingHours";
import MediaUploadEditor from "./EditBusinessMedia";
import PaymentMethodsEditor from "./EditPaymentMethods";
import databaseService from "@/services/database.services";

const EditBusinessmanProfileNavigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentEdit, setCurrentEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    // Read query parameter on component mount
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get("edit");
    if (editParam) {
      setCurrentEdit(editParam);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const editParam = params.get("edit");
      setCurrentEdit(editParam);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const editOptions = [
    // {
    //   id: "personal-info",
    //   title: "Personal Information",
    //   description: "Update your personal details and name",
    //   icon: User,
    //   color: "bg-gray-700",
    //   bgColor: "bg-gray-50",
    //   borderColor: "border-gray-200",
    //   hoverColor: "hover:bg-gray-100",
    //   route: "/edit/personal-info",
    // },
    {
      id: "location",
      title: "Location & Address",
      description: "Update your business location and address",
      icon: MapPin,
      color: "bg-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      route: "/edit/location-edit",
    },
    {
      id: "business-info",
      title: "Business Information",
      description: "Edit business details and description",
      icon: Building2,
      color: "bg-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      route: "/edit/business-edit",
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      description: "Manage accepted payment options",
      icon: CreditCard,
      color: "bg-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      route: "/edit/payment-edit",
    },
    {
      id: "business-hours",
      title: "Business Hours",
      description: "Set your operating hours and schedule",
      icon: Clock,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      route: "/edit/hours-edit",
    },
    // {
    //   id: "services",
    //   title: "Services Available",
    //   description: "Configure delivery and home service options",
    //   icon: Truck,
    //   color: "bg-gray-600",
    //   bgColor: "bg-gray-50",
    //   borderColor: "border-gray-200",
    //   hoverColor: "hover:bg-gray-100",
    //   route: "/edit/services-edit",
    // },
    // {
    //   id: "documents",
    //   title: "Document Upload", 
    //   description: "Upload and manage your documents",
    //   icon: FileText,
    //   color: "bg-gray-700",
    //   bgColor: "bg-gray-50",
    //   borderColor: "border-gray-200",
    //   hoverColor: "hover:bg-gray-100",
    //   route: "/edit/documents-edit",
    // },
  ];

  const { businessId } = useParams();
  const handleMoveBackTo = () => {
    navigate(`/dashboard/business/${businessId}`);
  };

  const handleBackToOptions = () => {
    // Clear query parameter
    const currentUrl = window.location.pathname;
    window.history.pushState({}, "", currentUrl);
    setCurrentEdit(null);
  };

  const handleNavigation = (editType) => {
    // Update URL with query parameter
    const currentUrl = window.location.pathname;
    const newUrl = `${currentUrl}?edit=${editType}`;
    window.history.pushState({}, "", newUrl);

    // Update state to trigger re-render
    setCurrentEdit(editType);
  };

  // Render different components based on currentEdit state
  const renderEditSection = () => {
    switch (currentEdit) {
      // case "personal-info":
      // return <PersonalInfoEdit onBack={handleBackToOptions} />;
      case "location":
        return <EditLocationAndAddress onBack={handleBackToOptions} />;
      case "business-info":
        return <EditBusinessDetails onBack={handleBackToOptions} />;
      case "payment-methods":
        return <PaymentMethodsEditor onBack={handleBackToOptions} />;
      case "business-hours":
        return (
          <BusinessHoursEditor
            onBack={handleBackToOptions}
            businessId={businessId}
            databaseService={databaseService}
          />
        );
      // case "services":
      // return <ServicesEdit onBack={handleBackToOptions} />;
      // case "documents":
      //   return <MediaUploadEditor onBack={handleBackToOptions} />;
      default:
        return null; // Show the main navigation
    }
  };

  // If an edit section is active, render it
  if (currentEdit) {
    return (
      <div className="min-h-screen bg-gray-100">{renderEditSection()}</div>
    );
  }

  // Otherwise, render the main navigation
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Amazing Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0">
          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20 animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-15 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 mt-2 md:mb-6">
          <MoveBackButton onClick={handleMoveBackTo} />
        </div>

        {/* Header */}
        <div
          className={`bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-6 sm:mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-4 sm:p-6 lg:p-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse"></div>
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-white/8 to-transparent rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/10 rounded-xl animate-pulse">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="text-white text-center">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    Edit Profile
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Update your information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Options List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {editOptions.map((option, index) => (
            <div
              key={option.id}
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <button
                onClick={() => handleNavigation(option.id)}
                onMouseEnter={() => setHoveredItem(option.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group w-full cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 text-left ${
                  option.hoverColor
                } ${
                  hoveredItem === option.id
                    ? "scale-105 shadow-2xl border-gray-300"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 ${
                        option.color
                      } text-white rounded-xl shadow-lg transition-all duration-300 ${
                        hoveredItem === option.id ? "animate-bounce" : ""
                      }`}
                    >
                      <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 transition-colors">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:block">
                      <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-all duration-300">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Last updated: 2 days ago
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`mt-8 sm:mt-12 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300">
            <Shield className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-600 font-medium">
              Your data is secure and encrypted
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }

        @media (max-width: 640px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default EditBusinessmanProfileNavigation;
