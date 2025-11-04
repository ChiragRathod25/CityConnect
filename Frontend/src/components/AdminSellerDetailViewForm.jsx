import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Shield,
  CheckCircle,
  Store,
  Calendar,
  Award,
  CreditCard,
  Briefcase,
  Camera,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader,
  XCircle,
  Truck,
  Home,
  DollarSign,
  MapPin as MapPinIcon,
  Search,
  Filter,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import MoveBackButton from "./ui/MoveBackButton";
import { useNavigate } from "react-router-dom";

// Mock data remains unchanged
const mockApplications = [
  {
    id: "APP001",
    submittedAt: "2025-10-08T14:30:00",
    status: "pending",
    personalInfo: {
      fullName: "Rajesh Kumar",
      contactNumber: "9876543210",
      email: "rajesh.kumar@example.com",
    },
    businessInfo: {
      businessName: "Kumar Tailoring Services",
      businessType: "service",
      businessCategory: "tailor",
      businessDescription:
        "Professional tailoring service with over 15 years of experience.",
      yearsInBusiness: "10+",
    },
    location: {
      address: "123 Main Street, Block A",
      city: "Vadodara",
      district: "Vadodara",
      state: "Gujarat",
      pincode: "390001",
    },
    businessSettings: {
      deliveryAvailable: true,
      homeServiceAvailable: true,
      paymentMethods: ["Cash", "UPI", "Card"],
      openingTime: "09:00",
      closingTime: "20:00",
      weeklyOff: "sunday",
    },
    documents: {
      govtIdProof:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
      selfieWithId:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      businessLicense: "data:application/pdf;base64,JVBERi0xLjQK",
      businessPhoto:
        "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400",
      professionalPhoto:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    },
  },
  {
    id: "APP002",
    submittedAt: "2025-10-09T10:15:00",
    status: "pending",
    personalInfo: {
      fullName: "Priya Sharma",
      contactNumber: "9876543211",
      email: "priya.sharma@example.com",
    },
    businessInfo: {
      businessName: "Sharma Beauty Salon",
      businessType: "both",
      businessCategory: "salon",
      businessDescription: "Modern beauty salon offering premium services.",
      yearsInBusiness: "5-10",
    },
    location: {
      address: "456 Park Avenue, Near City Mall",
      city: "Vadodara",
      district: "Vadodara",
      state: "Gujarat",
      pincode: "390002",
    },
    businessSettings: {
      deliveryAvailable: false,
      homeServiceAvailable: true,
      paymentMethods: ["Cash", "UPI", "Card", "Digital Wallet"],
      openingTime: "10:00",
      closingTime: "21:00",
      weeklyOff: "monday",
    },
    documents: {
      govtIdProof:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      selfieWithId:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      businessLicense: null,
      businessPhoto:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
      professionalPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    },
  },
  {
    id: "APP003",
    submittedAt: "2025-10-07T09:45:00",
    status: "approved",
    personalInfo: {
      fullName: "Amit Patel",
      contactNumber: "9876543212",
      email: "amit.patel@example.com",
    },
    businessInfo: {
      businessName: "Patel Electronics",
      businessType: "product",
      businessCategory: "electronics",
      businessDescription: "Electronics store with repair services.",
      yearsInBusiness: "3-5",
    },
    location: {
      address: "789 Market Road, Shop 5",
      city: "Vadodara",
      district: "Vadodara",
      state: "Gujarat",
      pincode: "390003",
    },
    businessSettings: {
      deliveryAvailable: true,
      homeServiceAvailable: false,
      paymentMethods: ["Cash", "UPI", "Card", "Net Banking"],
      openingTime: "10:00",
      closingTime: "22:00",
      weeklyOff: "none",
    },
    documents: {
      govtIdProof:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      selfieWithId:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      businessLicense: "data:application/pdf;base64,JVBERi0xLjQK",
      businessPhoto:
        "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
      professionalPhoto:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  },
];

// Pagination Component (provided)
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
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </motion.button>
    </div>
  );
};

// GlassCard, StatusBadge, ModernDropdown, DocumentViewer, InfoRow, ApplicationCard components remain unchanged
const GlassCard = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: Clock,
      label: "Pending Review",
      dot: "bg-yellow-500",
    },
    approved: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle,
      label: "Approved",
      dot: "bg-green-500",
    },
    rejected: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: XCircle,
      label: "Rejected",
      dot: "bg-red-500",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span
        className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`}
      ></span>
      <Icon size={14} />
      {config.label}
    </span>
  );
};

const ModernDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium transition-all hover:border-gray-300 hover:shadow-sm min-w-[160px]"
      >
        <selectedOption.icon size={18} className={selectedOption.color} />
        <span className="flex-1 text-left text-gray-700">
          {selectedOption.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-white backdrop-blur-xl shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden"
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-gray-50 ${
                    value === option.value ? "bg-gray-50" : ""
                  }`}
                >
                  <Icon size={18} className={option.color} />
                  <span
                    className={`flex-1 text-left font-medium ${
                      value === option.value ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check size={16} className="text-gray-900" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocumentViewer = ({ document, title, onClose }) => {
  const isPDF = document?.startsWith("data:application/pdf");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="p-4 sm:p-6  overflow-auto max-h-[calc(90vh-100px)]">
          {isPDF ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FileText className="mx-auto mb-4 text-gray-400" size={64} />
              </motion.div>
              <p className="text-gray-600 mb-6 font-medium">PDF Document</p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={document}
                download={`${title}.pdf`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg"
              >
                <Download size={18} />
                Download PDF
              </motion.a>
            </div>
          ) : (
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={
                document || "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoRow = ({ icon: Icon, label, value, valueClassName = "" }) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
      <Icon size={16} className="text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`font-semibold text-gray-900 break-words ${valueClassName}`}
      >
        {value || "N/A"}
      </p>
    </div>
  </div>
);

const ApplicationCard = ({ application, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onApprove(application.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onReject(application.id, rejectReason);
    setIsProcessing(false);
    setShowRejectReason(false);
    setRejectReason("");
  };

  const viewDocument = (doc, title) => {
    setSelectedDocument(doc);
    setDocumentTitle(title);
  };

  return (
    <>
      <GlassCard className="overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Store className="text-white" size={26} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {application.businessInfo.businessName}
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  {application.personalInfo.fullName}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                    #{application.id}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(application.submittedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={application.status} />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Contact
                </p>
                <p className="font-bold text-sm text-gray-900 truncate">
                  {application.personalInfo.contactNumber}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Category
                </p>
                <p className="font-bold text-sm text-gray-900 capitalize truncate">
                  {application.businessInfo.businessCategory}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Location
                </p>
                <p className="font-bold text-sm text-gray-900 truncate">
                  {application.location.city}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all text-gray-700 font-semibold border border-gray-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={20} />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown size={20} />
                View Full Details
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6 space-y-5 border-t border-gray-100 bg-gray-50/50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    Personal Information
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InfoRow
                      icon={User}
                      label="Full Name"
                      value={application.personalInfo.fullName}
                    />
                    <InfoRow
                      icon={Phone}
                      label="Contact Number"
                      value={application.personalInfo.contactNumber}
                    />
                    <InfoRow
                      icon={Mail}
                      label="Email Address"
                      value={application.personalInfo.email}
                      valueClassName="break-all"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-white" />
                    </div>
                    Business Information
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InfoRow
                      icon={Store}
                      label="Business Name"
                      value={application.businessInfo.businessName}
                    />
                    <InfoRow
                      icon={Building2}
                      label="Business Type"
                      value={application.businessInfo.businessType}
                      valueClassName="capitalize"
                    />
                    <InfoRow
                      icon={Briefcase}
                      label="Category"
                      value={application.businessInfo.businessCategory}
                      valueClassName="capitalize"
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Years in Business"
                      value={application.businessInfo.yearsInBusiness}
                    />
                    <div className="sm:col-span-2">
                      <InfoRow
                        icon={FileText}
                        label="Business Description"
                        value={application.businessInfo.businessDescription}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100  rounded-2xl p-5 sm:p-6 border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-white" />
                    </div>
                    Location Details
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <InfoRow
                        icon={MapPin}
                        label="Full Address"
                        value={application.location.address}
                      />
                    </div>
                    <InfoRow
                      icon={MapPinIcon}
                      label="City"
                      value={application.location.city}
                    />
                    <InfoRow
                      icon={MapPinIcon}
                      label="District"
                      value={application.location.district}
                    />
                    <InfoRow
                      icon={MapPinIcon}
                      label="State"
                      value={application.location.state}
                    />
                    <InfoRow
                      icon={MapPinIcon}
                      label="Pincode"
                      value={application.location.pincode}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100  rounded-2xl p-5 sm:p-6 border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-white" />
                    </div>
                    Business Settings
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InfoRow
                      icon={Clock}
                      label="Operating Hours"
                      value={`${application.businessSettings.openingTime} - ${application.businessSettings.closingTime}`}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Weekly Off"
                      value={application.businessSettings.weeklyOff}
                      valueClassName="capitalize"
                    />
                    <div className="sm:col-span-2">
                      <div className="flex items-start gap-3 py-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
                          <DollarSign size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Payment Methods
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {application.businessSettings.paymentMethods.map(
                              (method) => (
                                <span
                                  key={method}
                                  className="bg-white px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm"
                                >
                                  {method}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Truck size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                          Delivery
                        </p>
                        <p className="font-bold text-sm text-gray-900">
                          {application.businessSettings.deliveryAvailable
                            ? "✓ Available"
                            : "✗ Not Available"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                          Home Service
                        </p>
                        <p className="font-bold text-sm text-gray-900">
                          {application.businessSettings.homeServiceAvailable
                            ? "✓ Available"
                            : "✗ Not Available"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
                >
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Shield size={16} className="text-white" />
                    </div>
                    Verification Documents
                  </h4>

                  <div className="mb-6">
                    <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard size={16} />
                      KYC Verification
                    </h5>
                    <div className="overflow-x-auto sm:overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
                        {[
                          { key: "govtIdProof", label: "Government ID Proof" },
                          { key: "selfieWithId", label: "Selfie with ID" },
                        ].map(({ key, label }) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                  application.documents[key]
                                    ? "bg-gray-700  text-white"
                                    : "bg-gray-300 text-gray-500"
                                }`}
                              >
                                {application.documents[key] ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  <XCircle size={20} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {label}
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                  {application.documents[key]
                                    ? "✓ Uploaded"
                                    : "✗ Not uploaded"}
                                </p>
                              </div>
                            </div>
                            {application.documents[key] && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  viewDocument(
                                    application.documents[key],
                                    label
                                  )
                                }
                                className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
                              >
                                <Eye size={16} />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Briefcase size={16} />
                      Business Documents
                    </h5>
                    <div className="overflow-x-auto sm:overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
                        {[
                          {
                            key: "businessLicense",
                            label: "Business License (Optional)",
                          },
                          {
                            key: "businessPhoto",
                            label: "Business/Workspace Photo",
                          },
                        ].map(({ key, label }) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                  application.documents[key]
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-300 text-gray-500"
                                }`}
                              >
                                {application.documents[key] ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  <XCircle size={20} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {label}
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                  {application.documents[key]
                                    ? "✓ Uploaded"
                                    : "✗ Not uploaded"}
                                </p>
                              </div>
                            </div>
                            {application.documents[key] && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  viewDocument(
                                    application.documents[key],
                                    label
                                  )
                                }
                                className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
                              >
                                <Eye size={16} />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Camera size={16} />
                      Professional Profile
                    </h5>
                    <div className="overflow-x-auto sm:overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
                        {[
                          {
                            key: "professionalPhoto",
                            label: "Professional Profile Photo",
                          },
                        ].map(({ key, label }) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                  application.documents[key]
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-300 text-gray-500"
                                }`}
                              >
                                {application.documents[key] ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  <XCircle size={20} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {label}
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                  {application.documents[key]
                                    ? "✓ Uploaded"
                                    : "✗ Not uploaded"}
                                </p>
                              </div>
                            </div>
                            {application.documents[key] && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  viewDocument(
                                    application.documents[key],
                                    label
                                  )
                                }
                                className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
                              >
                                <Eye size={16} />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {application.status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-3 pt-4"
                  >
                    {!showRejectReason ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleApprove}
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg"
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="animate-spin" size={20} />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check size={20} />
                              Approve Application
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowRejectReason(true)}
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg"
                        >
                          <X size={20} />
                          Reject Application
                        </motion.button>
                      </div>
                    ) : (
                      <div className="w-full space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200">
                        <label className="text-sm font-bold text-gray-700">
                          Rejection Reason *
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Please provide a detailed reason for rejection..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                        />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReject}
                            disabled={isProcessing || !rejectReason.trim()}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg"
                          >
                            {isProcessing ? (
                              <>
                                <Loader className="animate-spin" size={18} />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check size={18} />
                                Confirm Rejection
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowRejectReason(false);
                              setRejectReason("");
                            }}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all disabled:opacity-50 shadow-lg"
                          >
                            <X size={18} />
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {application.status === "rejected" &&
                  application.rejectReason && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="text-red-600 mt-0.5 flex-shrink-0"
                          size={22}
                        />
                        <div>
                          <p className="font-bold text-red-900 mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-red-700 text-sm font-medium">
                            {application.rejectReason}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <AnimatePresence>
        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            title={documentTitle}
            onClose={() => {
              setSelectedDocument(null);
              setDocumentTitle("");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const AdminVerificationPanel = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Display 2 applications per page
  const navigate = useNavigate();
  
  const handleApprove = (appId) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: "approved" } : app
      )
    );
    setTimeout(
      () => alert(`✓ Application ${appId} has been approved successfully!`),
      100
    );
  };

  const handleReject = (appId, reason) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: "rejected", rejectReason: reason }
          : app
      )
    );
    setTimeout(() => alert(`✗ Application ${appId} has been rejected.`), 100);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      app.businessInfo.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.personalInfo.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate pagination data
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    endIndex
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  const filterOptions = [
    {
      value: "all",
      label: "All Applications",
      icon: Filter,
      color: "text-gray-600",
    },
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      value: "approved",
      label: "Approved",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  const handleBackToProfile = () => {
    navigate("/admin");
  };

  return (
    <div
      className="min-h-screen py-5 bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-50/30"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      <div className="container mx-auto px-4 pb-16  max-w-7xl">
         <div className="relative z-10">
        <div className="relative mb-5 sm:mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={handleBackToProfile} />
            </div>
          </div>
        </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Shield size={32} className="text-white animate-pulse" />
            </motion.div>
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2"
              >
                Businessman Verification Panel
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 font-medium text-base sm:text-lg"
              >
                Review and verify Businessman applications with ease
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: "Total",
                value: stats.total,
                gradient: "from-gray-700 to-gray-900",
                icon: FileText,
              },
              {
                label: "Pending",
                value: stats.pending,
                gradient: "from-gray-700 to-gray-900",
                icon: Clock,
              },
              {
                label: "Approved",
                value: stats.approved,
                gradient: "from-gray-700 to-gray-900",
                icon: CheckCircle,
              },
              {
                label: "Rejected",
                value: stats.rejected,
                gradient: "from-gray-700 to-gray-900",
                icon: XCircle,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard className="p-4 sm:p-6 border-2 border-gray-300 hover:shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-black text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
                    ></div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4 border-2 border-gray-300 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by business name, Businessman name, email, or app ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all font-medium"
                />
              </div>
              <ModernDropdown
                value={filter}
                onChange={setFilter}
                options={filterOptions}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium">
                Showing{" "}
                <span className="font-black text-gray-900 text-base">
                  {filteredApplications.length}
                </span>{" "}
                of{" "}
                <span className="font-black text-gray-900 text-base">
                  {applications.length}
                </span>{" "}
                applications
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {paginatedApplications.length === 0 ? (
            <GlassCard className="p-12  border-2 border-gray-300 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <AlertCircle className="mx-auto mb-4 text-gray-400" size={64} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 font-medium">
                {searchQuery
                  ? "Try adjusting your search or filter criteria"
                  : "There are no applications to display"}
              </p>
            </GlassCard>
          ) : (
            paginatedApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className=" border rounded-2xl border-gray-300"
              >
                <ApplicationCard
                  application={application}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <GlassCard className="p-6  border-2 border-gray-300">
            <div className="flex flex-col  sm:flex-row items-center justify-center gap-5 sm:gap-10 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span>Secure Verification</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-6 sm:gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                  <Award size={16} className="text-white" />
                </div>
                <span>Trusted Platform</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-7 sm:gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800  rounded-lg flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span>Quality Assured</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVerificationPanel;

// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Building2,
//   MapPin,
//   Phone,
//   Mail,
//   FileText,
//   Clock,
//   Shield,
//   CheckCircle,
//   Store,
//   Calendar,
//   Award,
//   CreditCard,
//   Briefcase,
//   Camera,
//   X,
//   Check,
//   AlertCircle,
//   Download,
//   Eye,
//   ChevronDown,
//   ChevronUp,
//   Loader,
//   XCircle,
//   Truck,
//   Home,
//   DollarSign,
//   MapPin as MapPinIcon,
//   Search,
//   Filter,
// } from "lucide-react";

// const mockApplications = [
//   {
//     id: "APP001",
//     submittedAt: "2025-10-08T14:30:00",
//     status: "pending",
//     personalInfo: {
//       fullName: "Rajesh Kumar",
//       contactNumber: "9876543210",
//       email: "rajesh.kumar@example.com",
//     },
//     businessInfo: {
//       businessName: "Kumar Tailoring Services",
//       businessType: "service",
//       businessCategory: "tailor",
//       businessDescription:
//         "Professional tailoring service with over 15 years of experience.",
//       yearsInBusiness: "10+",
//     },
//     location: {
//       address: "123 Main Street, Block A",
//       city: "Vadodara",
//       district: "Vadodara",
//       state: "Gujarat",
//       pincode: "390001",
//     },
//     businessSettings: {
//       deliveryAvailable: true,
//       homeServiceAvailable: true,
//       paymentMethods: ["Cash", "UPI", "Card"],
//       openingTime: "09:00",
//       closingTime: "20:00",
//       weeklyOff: "sunday",
//     },
//     documents: {
//       govtIdProof:
//         "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
//       selfieWithId:
//         "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
//       businessLicense: "data:application/pdf;base64,JVBERi0xLjQK",
//       businessPhoto:
//         "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400",
//       professionalPhoto:
//         "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
//     },
//   },
//   {
//     id: "APP002",
//     submittedAt: "2025-10-09T10:15:00",
//     status: "pending",
//     personalInfo: {
//       fullName: "Priya Sharma",
//       contactNumber: "9876543211",
//       email: "priya.sharma@example.com",
//     },
//     businessInfo: {
//       businessName: "Sharma Beauty Salon",
//       businessType: "both",
//       businessCategory: "salon",
//       businessDescription: "Modern beauty salon offering premium services.",
//       yearsInBusiness: "5-10",
//     },
//     location: {
//       address: "456 Park Avenue, Near City Mall",
//       city: "Vadodara",
//       district: "Vadodara",
//       state: "Gujarat",
//       pincode: "390002",
//     },
//     businessSettings: {
//       deliveryAvailable: false,
//       homeServiceAvailable: true,
//       paymentMethods: ["Cash", "UPI", "Card", "Digital Wallet"],
//       openingTime: "10:00",
//       closingTime: "21:00",
//       weeklyOff: "monday",
//     },
//     documents: {
//       govtIdProof:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
//       selfieWithId:
//         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
//       businessLicense: null,
//       businessPhoto:
//         "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
//       professionalPhoto:
//         "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
//     },
//   },
//   {
//     id: "APP003",
//     submittedAt: "2025-10-07T09:45:00",
//     status: "approved",
//     personalInfo: {
//       fullName: "Amit Patel",
//       contactNumber: "9876543212",
//       email: "amit.patel@example.com",
//     },
//     businessInfo: {
//       businessName: "Patel Electronics",
//       businessType: "product",
//       businessCategory: "electronics",
//       businessDescription: "Electronics store with repair services.",
//       yearsInBusiness: "3-5",
//     },
//     location: {
//       address: "789 Market Road, Shop 5",
//       city: "Vadodara",
//       district: "Vadodara",
//       state: "Gujarat",
//       pincode: "390003",
//     },
//     businessSettings: {
//       deliveryAvailable: true,
//       homeServiceAvailable: false,
//       paymentMethods: ["Cash", "UPI", "Card", "Net Banking"],
//       openingTime: "10:00",
//       closingTime: "22:00",
//       weeklyOff: "none",
//     },
//     documents: {
//       govtIdProof:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
//       selfieWithId:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//       businessLicense: "data:application/pdf;base64,JVBERi0xLjQK",
//       businessPhoto:
//         "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
//       professionalPhoto:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//     },
//   },
// ];

// const GlassCard = ({ children, className = "", ...props }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
//     {...props}
//   >
//     {children}
//   </motion.div>
// );

// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     pending: {
//       bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
//       text: "text-yellow-700",
//       border: "border-yellow-200",
//       icon: Clock,
//       label: "Pending Review",
//       dot: "bg-yellow-500",
//     },
//     approved: {
//       bg: "bg-gradient-to-r from-green-50 to-emerald-50",
//       text: "text-green-700",
//       border: "border-green-200",
//       icon: CheckCircle,
//       label: "Approved",
//       dot: "bg-green-500",
//     },
//     rejected: {
//       bg: "bg-gradient-to-r from-red-50 to-rose-50",
//       text: "text-red-700",
//       border: "border-red-200",
//       icon: XCircle,
//       label: "Rejected",
//       dot: "bg-red-500",
//     },
//   };

//   const config = statusConfig[status] || statusConfig.pending;
//   const Icon = config.icon;

//   return (
//     <span
//       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}
//     >
//       <span
//         className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`}
//       ></span>
//       <Icon size={14} />
//       {config.label}
//     </span>
//   );
// };

// const ModernDropdown = ({ value, onChange, options }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const selectedOption = options.find((opt) => opt.value === value);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium transition-all hover:border-gray-300 hover:shadow-sm min-w-[160px]"
//       >
//         <selectedOption.icon size={18} className={selectedOption.color} />
//         <span className="flex-1 text-left text-gray-700">
//           {selectedOption.label}
//         </span>
//         <motion.div
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.2 }}
//         >
//           <ChevronDown size={18} className="text-gray-400" />
//         </motion.div>
//       </motion.button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.95 }}
//             transition={{ duration: 0.15 }}
//             className="absolute bottom-full mb-2 left-0 right-0 bg-white backdrop-blur-xl shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden"
//           >
//             {options.map((option, index) => {
//               const Icon = option.icon;
//               return (
//                 <motion.button
//                   key={option.value}
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   onClick={() => {
//                     onChange(option.value);
//                     setIsOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-gray-50 ${
//                     value === option.value ? "bg-gray-50" : ""
//                   }`}
//                 >
//                   <Icon size={18} className={option.color} />
//                   <span
//                     className={`flex-1 text-left font-medium ${
//                       value === option.value ? "text-gray-900" : "text-gray-700"
//                     }`}
//                   >
//                     {option.label}
//                   </span>
//                   {value === option.value && (
//                     <Check size={16} className="text-gray-900" />
//                   )}
//                 </motion.button>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const DocumentViewer = ({ document, title, onClose }) => {
//   const isPDF = document?.startsWith("data:application/pdf");

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
//           <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//           <motion.button
//             whileHover={{ scale: 1.1, rotate: 90 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             <X size={20} />
//           </motion.button>
//         </div>

//         <div className="p-4 sm:p-6  overflow-auto max-h-[calc(90vh-100px)]">
//           {isPDF ? (
//             <div className="text-center py-12">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 200 }}
//               >
//                 <FileText className="mx-auto mb-4 text-gray-400" size={64} />
//               </motion.div>
//               <p className="text-gray-600 mb-6 font-medium">PDF Document</p>
//               <motion.a
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 href={document}
//                 download={`${title}.pdf`}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg"
//               >
//                 <Download size={18} />
//                 Download PDF
//               </motion.a>
//             </div>
//           ) : (
//             <motion.img
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               src={
//                 document || "https://via.placeholder.com/400x300?text=No+Image"
//               }
//               alt={title}
//               className="w-full h-auto rounded-xl shadow-lg"
//             />
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// const InfoRow = ({ icon: Icon, label, value, valueClassName = "" }) => (
//   <div className="flex items-start gap-3 py-2.5">
//     <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
//       <Icon size={16} className="text-gray-600" />
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
//         {label}
//       </p>
//       <p
//         className={`font-semibold text-gray-900 break-words ${valueClassName}`}
//       >
//         {value || "N/A"}
//       </p>
//     </div>
//   </div>
// );

// const ApplicationCard = ({ application, onApprove, onReject }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [documentTitle, setDocumentTitle] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showRejectReason, setShowRejectReason] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");

//   const handleApprove = async () => {
//     setIsProcessing(true);
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     onApprove(application.id);
//     setIsProcessing(false);
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) {
//       alert("Please provide a reason for rejection");
//       return;
//     }
//     setIsProcessing(true);
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     onReject(application.id, rejectReason);
//     setIsProcessing(false);
//     setShowRejectReason(false);
//     setRejectReason("");
//   };

//   const viewDocument = (doc, title) => {
//     setSelectedDocument(doc);
//     setDocumentTitle(title);
//   };

//   return (
//     <>
//       <GlassCard className="overflow-hidden">
//         <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-100">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
//                 <Store className="text-white" size={26} />
//               </div>
//               <div className="min-w-0">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
//                   {application.businessInfo.businessName}
//                 </h3>
//                 <p className="text-sm text-gray-600 font-medium mb-1">
//                   {application.personalInfo.fullName}
//                 </p>
//                 <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                   <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
//                     #{application.id}
//                   </span>
//                   <span>•</span>
//                   <span>
//                     {new Date(application.submittedAt).toLocaleDateString(
//                       "en-US",
//                       {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       }
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <StatusBadge status={application.status} />
//             </div>
//           </div>
//         </div>

//         <div className="p-4 sm:p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
//             >
//               <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <Phone size={18} className="text-white" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
//                   Contact
//                 </p>
//                 <p className="font-bold text-sm text-gray-900 truncate">
//                   {application.personalInfo.contactNumber}
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
//             >
//               <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <Building2 size={18} className="text-white" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
//                   Category
//                 </p>
//                 <p className="font-bold text-sm text-gray-900 capitalize truncate">
//                   {application.businessInfo.businessCategory}
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
//             >
//               <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <MapPinIcon size={18} className="text-white" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
//                   Location
//                 </p>
//                 <p className="font-bold text-sm text-gray-900 truncate">
//                   {application.location.city}
//                 </p>
//               </div>
//             </motion.div>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.99 }}
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all text-gray-700 font-semibold border border-gray-200"
//           >
//             {isExpanded ? (
//               <>
//                 <ChevronUp size={20} />
//                 Hide Details
//               </>
//             ) : (
//               <>
//                 <ChevronDown size={20} />
//                 View Full Details
//               </>
//             )}
//           </motion.button>
//         </div>

//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="p-4 sm:p-6 space-y-5 border-t border-gray-100 bg-gray-50/50">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
//                 >
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//                       <User size={16} className="text-white" />
//                     </div>
//                     Personal Information
//                   </h4>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <InfoRow
//                       icon={User}
//                       label="Full Name"
//                       value={application.personalInfo.fullName}
//                     />
//                     <InfoRow
//                       icon={Phone}
//                       label="Contact Number"
//                       value={application.personalInfo.contactNumber}
//                     />
//                     <InfoRow
//                       icon={Mail}
//                       label="Email Address"
//                       value={application.personalInfo.email}
//                       valueClassName="break-all"
//                     />
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
//                 >
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//                       <Building2 size={16} className="text-white" />
//                     </div>
//                     Business Information
//                   </h4>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <InfoRow
//                       icon={Store}
//                       label="Business Name"
//                       value={application.businessInfo.businessName}
//                     />
//                     <InfoRow
//                       icon={Building2}
//                       label="Business Type"
//                       value={application.businessInfo.businessType}
//                       valueClassName="capitalize"
//                     />
//                     <InfoRow
//                       icon={Briefcase}
//                       label="Category"
//                       value={application.businessInfo.businessCategory}
//                       valueClassName="capitalize"
//                     />
//                     <InfoRow
//                       icon={Calendar}
//                       label="Years in Business"
//                       value={application.businessInfo.yearsInBusiness}
//                     />
//                     <div className="sm:col-span-2">
//                       <InfoRow
//                         icon={FileText}
//                         label="Business Description"
//                         value={application.businessInfo.businessDescription}
//                       />
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-br from-gray-50 to-gray-100  rounded-2xl p-5 sm:p-6 border border-gray-200"
//                 >
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//                       <MapPin size={16} className="text-white" />
//                     </div>
//                     Location Details
//                   </h4>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <div className="sm:col-span-2">
//                       <InfoRow
//                         icon={MapPin}
//                         label="Full Address"
//                         value={application.location.address}
//                       />
//                     </div>
//                     <InfoRow
//                       icon={MapPinIcon}
//                       label="City"
//                       value={application.location.city}
//                     />
//                     <InfoRow
//                       icon={MapPinIcon}
//                       label="District"
//                       value={application.location.district}
//                     />
//                     <InfoRow
//                       icon={MapPinIcon}
//                       label="State"
//                       value={application.location.state}
//                     />
//                     <InfoRow
//                       icon={MapPinIcon}
//                       label="Pincode"
//                       value={application.location.pincode}
//                     />
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-br from-gray-50 to-gray-100  rounded-2xl p-5 sm:p-6 border border-gray-200"
//                 >
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//                       <Clock size={16} className="text-white" />
//                     </div>
//                     Business Settings
//                   </h4>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <InfoRow
//                       icon={Clock}
//                       label="Operating Hours"
//                       value={`${application.businessSettings.openingTime} - ${application.businessSettings.closingTime}`}
//                     />
//                     <InfoRow
//                       icon={Calendar}
//                       label="Weekly Off"
//                       value={application.businessSettings.weeklyOff}
//                       valueClassName="capitalize"
//                     />
//                     <div className="sm:col-span-2">
//                       <div className="flex items-start gap-3 py-2.5">
//                         <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
//                           <DollarSign size={16} className="text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
//                             Payment Methods
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {application.businessSettings.paymentMethods.map(
//                               (method) => (
//                                 <span
//                                   key={method}
//                                   className="bg-white px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm"
//                                 >
//                                   {method}
//                                 </span>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-sm"
//                     >
//                       <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Truck size={18} className="text-white" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
//                           Delivery
//                         </p>
//                         <p className="font-bold text-sm text-gray-900">
//                           {application.businessSettings.deliveryAvailable
//                             ? "✓ Available"
//                             : "✗ Not Available"}
//                         </p>
//                       </div>
//                     </motion.div>
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-sm"
//                     >
//                       <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Home size={18} className="text-white" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
//                           Home Service
//                         </p>
//                         <p className="font-bold text-sm text-gray-900">
//                           {application.businessSettings.homeServiceAvailable
//                             ? "✓ Available"
//                             : "✗ Not Available"}
//                         </p>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200"
//                 >
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//                       <Shield size={16} className="text-white" />
//                     </div>
//                     Verification Documents
//                   </h4>

//                   <div className="mb-6">
//                     <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
//                       <CreditCard size={16} />
//                       KYC Verification
//                     </h5>
//                     <div className="overflow-x-auto">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
//                         {[
//                           { key: "govtIdProof", label: "Government ID Proof" },
//                           { key: "selfieWithId", label: "Selfie with ID" },
//                         ].map(({ key, label }) => (
//                           <motion.div
//                             key={key}
//                             whileHover={{ scale: 1.02 }}
//                             className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
//                           >
//                             <div className="flex items-center gap-3 min-w-0 flex-1">
//                               <div
//                                 className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
//                                   application.documents[key]
//                                     ? "bg-gray-700  text-white"
//                                     : "bg-gray-300 text-gray-500"
//                                 }`}
//                               >
//                                 {application.documents[key] ? (
//                                   <CheckCircle size={20} />
//                                 ) : (
//                                   <XCircle size={20} />
//                                 )}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="font-bold text-sm text-gray-900 truncate">
//                                   {label}
//                                 </p>
//                                 <p className="text-xs text-gray-600 font-medium">
//                                   {application.documents[key]
//                                     ? "✓ Uploaded"
//                                     : "✗ Not uploaded"}
//                                 </p>
//                               </div>
//                             </div>
//                             {application.documents[key] && (
//                               <motion.button
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 onClick={() =>
//                                   viewDocument(
//                                     application.documents[key],
//                                     label
//                                   )
//                                 }
//                                 className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
//                               >
//                                 <Eye size={16} />
//                               </motion.button>
//                             )}
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-6">
//                     <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
//                       <Briefcase size={16} />
//                       Business Documents
//                     </h5>
//                     <div className="overflow-x-auto">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
//                         {[
//                           {
//                             key: "businessLicense",
//                             label: "Business License (Optional)",
//                           },
//                           {
//                             key: "businessPhoto",
//                             label: "Business/Workspace Photo",
//                           },
//                         ].map(({ key, label }) => (
//                           <motion.div
//                             key={key}
//                             whileHover={{ scale: 1.02 }}
//                             className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
//                           >
//                             <div className="flex items-center gap-3 min-w-0 flex-1">
//                               <div
//                                 className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
//                                   application.documents[key]
//                                     ? "bg-gray-700 text-white"
//                                     : "bg-gray-300 text-gray-500"
//                                 }`}
//                               >
//                                 {application.documents[key] ? (
//                                   <CheckCircle size={20} />
//                                 ) : (
//                                   <XCircle size={20} />
//                                 )}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="font-bold text-sm text-gray-900 truncate">
//                                   {label}
//                                 </p>
//                                 <p className="text-xs text-gray-600 font-medium">
//                                   {application.documents[key]
//                                     ? "✓ Uploaded"
//                                     : "✗ Not uploaded"}
//                                 </p>
//                               </div>
//                             </div>
//                             {application.documents[key] && (
//                               <motion.button
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 onClick={() =>
//                                   viewDocument(
//                                     application.documents[key],
//                                     label
//                                   )
//                                 }
//                                 className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
//                               >
//                                 <Eye size={16} />
//                               </motion.button>
//                             )}
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
//                       <Camera size={16} />
//                       Professional Profile
//                     </h5>
//                     <div className="overflow-x-auto">
//                       <div className="grid grid-cols-1 gap-3 min-w-max sm:min-w-0">
//                         {[
//                           {
//                             key: "professionalPhoto",
//                             label: "Professional Profile Photo",
//                           },
//                         ].map(({ key, label }) => (
//                           <motion.div
//                             key={key}
//                             whileHover={{ scale: 1.02 }}
//                             className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200 shadow-sm min-w-[280px] sm:min-w-0"
//                           >
//                             <div className="flex items-center gap-3 min-w-0 flex-1">
//                               <div
//                                 className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
//                                   application.documents[key]
//                                     ? "bg-gray-700 text-white"
//                                     : "bg-gray-300 text-gray-500"
//                                 }`}
//                               >
//                                 {application.documents[key] ? (
//                                   <CheckCircle size={20} />
//                                 ) : (
//                                   <XCircle size={20} />
//                                 )}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="font-bold text-sm text-gray-900 truncate">
//                                   {label}
//                                 </p>
//                                 <p className="text-xs text-gray-600 font-medium">
//                                   {application.documents[key]
//                                     ? "✓ Uploaded"
//                                     : "✗ Not uploaded"}
//                                 </p>
//                               </div>
//                             </div>
//                             {application.documents[key] && (
//                               <motion.button
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 onClick={() =>
//                                   viewDocument(
//                                     application.documents[key],
//                                     label
//                                   )
//                                 }
//                                 className="ml-2 p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm"
//                               >
//                                 <Eye size={16} />
//                               </motion.button>
//                             )}
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {application.status === "pending" && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5 }}
//                     className="flex flex-col gap-3 pt-4"
//                   >
//                     {!showRejectReason ? (
//                       <div className="grid sm:grid-cols-2 gap-3">
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={handleApprove}
//                           disabled={isProcessing}
//                           className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg"
//                         >
//                           {isProcessing ? (
//                             <>
//                               <Loader className="animate-spin" size={20} />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <Check size={20} />
//                               Approve Application
//                             </>
//                           )}
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={() => setShowRejectReason(true)}
//                           disabled={isProcessing}
//                           className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg"
//                         >
//                           <X size={20} />
//                           Reject Application
//                         </motion.button>
//                       </div>
//                     ) : (
//                       <div className="w-full space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200">
//                         <label className="text-sm font-bold text-gray-700">
//                           Rejection Reason *
//                         </label>
//                         <textarea
//                           value={rejectReason}
//                           onChange={(e) => setRejectReason(e.target.value)}
//                           placeholder="Please provide a detailed reason for rejection..."
//                           rows={4}
//                           className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
//                         />
//                         <div className="grid sm:grid-cols-2 gap-3">
//                           <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleReject}
//                             disabled={isProcessing || !rejectReason.trim()}
//                             className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg"
//                           >
//                             {isProcessing ? (
//                               <>
//                                 <Loader className="animate-spin" size={18} />
//                                 Processing...
//                               </>
//                             ) : (
//                               <>
//                                 <Check size={18} />
//                                 Confirm Rejection
//                               </>
//                             )}
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={() => {
//                               setShowRejectReason(false);
//                               setRejectReason("");
//                             }}
//                             disabled={isProcessing}
//                             className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all disabled:opacity-50 shadow-lg"
//                           >
//                             <X size={18} />
//                             Cancel
//                           </motion.button>
//                         </div>
//                       </div>
//                     )}
//                   </motion.div>
//                 )}

//                 {application.status === "rejected" &&
//                   application.rejectReason && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4"
//                     >
//                       <div className="flex items-start gap-3">
//                         <AlertCircle
//                           className="text-red-600 mt-0.5 flex-shrink-0"
//                           size={22}
//                         />
//                         <div>
//                           <p className="font-bold text-red-900 mb-1">
//                             Rejection Reason:
//                           </p>
//                           <p className="text-red-700 text-sm font-medium">
//                             {application.rejectReason}
//                           </p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </GlassCard>

//       <AnimatePresence>
//         {selectedDocument && (
//           <DocumentViewer
//             document={selectedDocument}
//             title={documentTitle}
//             onClose={() => {
//               setSelectedDocument(null);
//               setDocumentTitle("");
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// const AdminVerificationPanel = () => {
//   const [applications, setApplications] = useState(mockApplications);
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleApprove = (appId) => {
//     setApplications((prev) =>
//       prev.map((app) =>
//         app.id === appId ? { ...app, status: "approved" } : app
//       )
//     );
//     setTimeout(
//       () => alert(`✓ Application ${appId} has been approved successfully!`),
//       100
//     );
//   };

//   const handleReject = (appId, reason) => {
//     setApplications((prev) =>
//       prev.map((app) =>
//         app.id === appId
//           ? { ...app, status: "rejected", rejectReason: reason }
//           : app
//       )
//     );
//     setTimeout(() => alert(`✗ Application ${appId} has been rejected.`), 100);
//   };

//   const filteredApplications = applications.filter((app) => {
//     const matchesFilter = filter === "all" || app.status === filter;
//     const matchesSearch =
//       app.businessInfo.businessName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       app.personalInfo.fullName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const stats = {
//     total: applications.length,
//     pending: applications.filter((app) => app.status === "pending").length,
//     approved: applications.filter((app) => app.status === "approved").length,
//     rejected: applications.filter((app) => app.status === "rejected").length,
//   };

//   const filterOptions = [
//     {
//       value: "all",
//       label: "All Applications",
//       icon: Filter,
//       color: "text-gray-600",
//     },
//     {
//       value: "pending",
//       label: "Pending",
//       icon: Clock,
//       color: "text-yellow-600",
//     },
//     {
//       value: "approved",
//       label: "Approved",
//       icon: CheckCircle,
//       color: "text-green-600",
//     },
//     {
//       value: "rejected",
//       label: "Rejected",
//       icon: XCircle,
//       color: "text-red-600",
//     },
//   ];

//   return (
//     <div
//       className="min-h-screen py-5 bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-50/30"
//       style={{
//         fontFamily:
//           "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
//       }}
//     >
//       <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex flex-col items-center justify-center gap-4 mb-8">
//             <motion.div
//               initial={{ scale: 0, rotate: -180 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ type: "spring", stiffness: 200, damping: 15 }}
//               className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center shadow-xl"
//             >
//               <Shield size={32} className="text-white animate-pulse" />
//             </motion.div>
//             <div className="text-center">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2"
//               >
//                 Seller Verification Panel
//               </motion.h1>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-gray-600 font-medium text-base sm:text-lg"
//               >
//                 Review and verify seller applications with ease
//               </motion.p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//             {[
//               {
//                 label: "Total",
//                 value: stats.total,
//                 gradient: "from-gray-700 to-gray-900",
//                 icon: FileText,
//               },
//               {
//                 label: "Pending",
//                 value: stats.pending,
//                 gradient: "from-gray-700 to-gray-900",
//                 icon: Clock,
//               },
//               {
//                 label: "Approved",
//                 value: stats.approved,
//                  gradient: "from-gray-700 to-gray-900",
//                 icon: CheckCircle,
//               },
//               {
//                 label: "Rejected",
//                 value: stats.rejected,
//                  gradient: "from-gray-700 to-gray-900",
//                 icon: XCircle,
//               },
//             ].map((stat, index) => {
//               const Icon = stat.icon;
//               return (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ y: -5 }}
//                 >
//                   <GlassCard className="p-4 sm:p-6 border-2 border-gray-300 hover:shadow-xl overflow-hidden relative">
//                     <div className="flex items-center justify-between relative z-10">
//                       <div>
//                         <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">
//                           {stat.label}
//                         </p>
//                         <p className="text-2xl sm:text-3xl font-black text-gray-900">
//                           {stat.value}
//                         </p>
//                       </div>
//                       <div
//                         className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
//                       >
//                         <Icon className="text-white" size={24} />
//                       </div>
//                     </div>
//                     <div
//                       className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
//                     ></div>
//                   </GlassCard>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <GlassCard className="p-4 border-2 border-gray-300 sm:p-6 mb-6">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search by business name, seller name, email, or app ID..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all font-medium"
//                 />
//               </div>
//               <ModernDropdown
//                 value={filter}
//                 onChange={setFilter}
//                 options={filterOptions}
//               />
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <p className="text-sm text-gray-600 font-medium">
//                 Showing{" "}
//                 <span className="font-black text-gray-900 text-base">
//                   {filteredApplications.length}
//                 </span>{" "}
//                 of{" "}
//                 <span className="font-black text-gray-900 text-base">
//                   {applications.length}
//                 </span>{" "}
//                 applications
//               </p>
//             </div>
//           </GlassCard>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="space-y-6"
//         >
//           {filteredApplications.length === 0 ? (
//             <GlassCard className="p-12  border-2 border-gray-300 text-center">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 200 }}
//               >
//                 <AlertCircle className="mx-auto mb-4 text-gray-400" size={64} />
//               </motion.div>
//               <h3 className="text-2xl font-bold text-gray-700 mb-2">
//                 No Applications Found
//               </h3>
//               <p className="text-gray-600 font-medium">
//                 {searchQuery
//                   ? "Try adjusting your search or filter criteria"
//                   : "There are no applications to display"}
//               </p>
//             </GlassCard>
//           ) : (
//             filteredApplications.map((application, index) => (
//               <motion.div
//                 key={application.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className=" border rounded-2xl border-gray-300"
//               >
//                 <ApplicationCard
//                   application={application}
//                   onApprove={handleApprove}
//                   onReject={handleReject}
//                 />
//               </motion.div>
//             ))
//           )}
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="mt-12"
//         >
//           <GlassCard className="p-6  border-2 border-gray-300">
//             <div className="flex flex-col  sm:flex-row items-center justify-center gap-5 sm:gap-10 text-sm text-gray-600 font-medium">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
//                   <Shield size={16} className="text-white" />
//                 </div>
//                 <span>Secure Verification</span>
//               </div>
//               <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
//               <div className="flex items-center gap-5 sm:gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
//                   <Award size={16} className="text-white" />
//                 </div>
//                 <span>Trusted Platform</span>
//               </div>
//               <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
//               <div className="flex items-center gap-6 sm:gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800  rounded-lg flex items-center justify-center">
//                   <CheckCircle size={16} className="text-white" />
//                 </div>
//                 <span>Quality Assured</span>
//               </div>
//             </div>
//           </GlassCard>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminVerificationPanel;
