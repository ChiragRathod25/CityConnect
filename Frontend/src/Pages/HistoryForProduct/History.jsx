import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  Download,
  RefreshCw,
  Store,
  Star,
  ArrowLeft,
  Search,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";
import databaseService from "@/services/database.services";


const statusConfig = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
};

const dateFilterOptions = [
  { key: "all", label: "All Time", icon: Calendar },
  { key: "week", label: "Last Week", icon: Calendar },
  { key: "month", label: "Last Month", icon: Calendar },
  { key: "3months", label: "Last 3 Months", icon: Calendar },
  { key: "6months", label: "Last 6 Months", icon: Calendar },
];

const statusFilterOptions = [
  { key: "all", label: "All Orders", icon: Package },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
];

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSuggestionClick,
}) => (
  <div className="relative flex-1 max-w-2xl">
    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
    <input
      type="text"
      placeholder="Search by order ID or product name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      className="w-full pl-14 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 placeholder-gray-400 font-medium transition-all duration-300 shadow-lg"
    />
    {searchTerm && (
      <button
        onClick={() => {
          setSearchTerm("");
          setShowSuggestions(false);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}

    {showSuggestions && suggestions.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50"
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{suggestion}</span>
            </div>
          </button>
        ))}
      </motion.div>
    )}
  </div>
);

const FilterDropdown = ({ value, setValue, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption =
    options.find((opt) => opt.value === value || opt.key === value) ||
    options[0];
  const CurrentIcon = currentOption?.icon || Filter;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 font-medium text-gray-700 transition-all duration-300 shadow-lg min-w-[140px] sm:min-w-[180px] w-full sm:w-auto"
        >
          <CurrentIcon className="w-5 h-5" />
          <span className="text-sm sm:text-base">{currentOption?.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ml-auto ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {options.map((option) => {
                const IconComponent = option.icon;
                const optionValue = option.value || option.key;
                return (
                  <button
                    key={optionValue}
                    onClick={() => {
                      setValue(optionValue);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      value === optionValue
                        ? "bg-gray-50 text-gray-700"
                        : "text-gray-700"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{option.label}</span>
                    {value === optionValue && (
                      <div className="w-2 h-2 bg-gray-500 rounded-full ml-auto"></div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white backdrop-blur-sm border-2 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed border-gray-200"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1 border-gray-200"
        } w-full sm:w-auto`}
        style={{ color: "#6b7280" }}
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden font-medium">Previous</span>
        </div>
      </motion.button>

      <div
        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-auto justify-center"
        style={{ borderColor: "#e2e8f0" }}
      >
        <span
          className="text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap"
          style={{ color: "#374151" }}
        >
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
          className="w-16 sm:w-20 text-center border-2 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-lg font-semibold sm:font-bold focus:outline-none focus:ring-4 shadow-inner"
          style={{
            borderColor: "#d1d5db",
            color: "#1f2937",
          }}
        />
        <span
          className="text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap"
          style={{ color: "#374151" }}
        >
          of {totalPages}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white backdrop-blur-sm border-2 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed border-gray-200"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1 border-gray-200"
        } w-full sm:w-auto`}
        style={{ color: "#6b7280" }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="sm:hidden font-medium">Next</span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </motion.button>
    </div>
  );
};

const OrderCard = ({ order, onViewDetails }) => {
  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all duration-300"
      style={{ borderColor: "#e2e8f0" }}
    >
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b" style={{ borderColor: "#f8fafc" }}>
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg md:text-xl font-bold" style={{ color: "#1f2937" }}>
              {order.id}
            </h3>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
            >
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
              <span className={`text-sm font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#6b7280" }}>
            <Calendar className="w-4 h-4" />
            Ordered on {new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: "#6b7280" }}>
            Total Amount
          </div>
          <div className="text-2xl md:text-3xl font-bold" style={{ color: "#1f2937" }}>
            ₹{order.total}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.items.slice(0, 2).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 md:gap-4"
          >
            <div
              className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm md:text-base truncate" style={{ color: "#1f2937" }}>
                {item.name}
              </h4>
              <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: "#6b7280" }}>
                <Store className="w-3 h-3" />
                {item.category}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm" style={{ color: "#6b7280" }}>
                  Qty: {item.quantity}
                </span>
                <span className="text-sm font-semibold" style={{ color: "#1f2937" }}>
                  ₹{item.price}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {order.items.length > 2 && (
          <div className="text-sm font-medium text-center py-2" style={{ color: "#6b7280" }}>
            +{order.items.length - 2} more item(s)
          </div>
        )}
      </div>

      {/* Order Footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t" style={{ borderColor: "#f8fafc" }}>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2" style={{ color: "#6b7280" }}>
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: "#6b7280" }}>
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span>{order.paymentMethod}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewDetails(order)}
          className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          style={{ backgroundColor: "#1f2937", color: "white" }}
        >
          <Eye className="w-4 h-4" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  const handleDownloadInvoice = async () => {
    try {
      // Create invoice content
      const invoiceContent = `
═══════════════════════════════════════════════════════════════
                          INVOICE
═══════════════════════════════════════════════════════════════

Order ID: ${order.id}
Order Date: ${new Date(order.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
${order.deliveryDate ? `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}` : ''}

Status: ${statusInfo.label}
Payment Method: ${order.paymentMethod}
${order.transactionId ? `Transaction ID: ${order.transactionId}` : ''}
Payment Status: ${order.paymentStatus}

───────────────────────────────────────────────────────────────
DELIVERY ADDRESS
───────────────────────────────────────────────────────────────
${order.deliveryAddress}

───────────────────────────────────────────────────────────────
ORDER ITEMS
───────────────────────────────────────────────────────────────
${order.items.map((item, index) => `
${index + 1}. ${item.name}
   Category: ${item.category}
   ${item.brand ? `Brand: ${item.brand}` : ''}
   ${item.weight ? `Weight: ${item.weight}` : ''}
   Price: ₹${item.price} × ${item.quantity}
   Total: ₹${item.price * item.quantity}
`).join('\n')}

───────────────────────────────────────────────────────────────
PRICE BREAKDOWN
───────────────────────────────────────────────────────────────
Subtotal:                                            ₹${order.subtotal}
Delivery Charge:                                     ₹${order.deliveryCharge}
Tax:                                                 ₹${order.tax}
${order.discount > 0 ? `Discount:                                            -₹${order.discount}` : ''}

═══════════════════════════════════════════════════════════════
TOTAL AMOUNT:                                        ₹${order.total}
═══════════════════════════════════════════════════════════════

Thank you for your order!
`;

      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b" style={{ borderColor: "#e2e8f0" }}>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1f2937" }}>
              Order Details
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-semibold" style={{ color: "#6b7280" }}>
                {order.id}
              </span>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
              >
                <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                <span className={`font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <XCircle className="w-6 h-6" style={{ color: "#6b7280" }} />
          </motion.button>
        </div>

        {/* Order Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: "#6b7280" }}>
                Order Date
              </div>
              <div className="flex items-center gap-2" style={{ color: "#1f2937" }}>
                <Calendar className="w-5 h-5" />
                {new Date(order.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            {order.deliveryDate && (
              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: "#6b7280" }}>
                  Delivery Date
                </div>
                <div className="flex items-center gap-2" style={{ color: "#1f2937" }}>
                  <Truck className="w-5 h-5" />
                  {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
            {!order.deliveryDate && order.estimatedDeliveryDate && (
              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: "#6b7280" }}>
                  Estimated Delivery
                </div>
                <div className="flex items-center gap-2" style={{ color: "#1f2937" }}>
                  <Clock className="w-5 h-5" />
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: "#6b7280" }}>
                Payment Method
              </div>
              <div className="flex items-center gap-2" style={{ color: "#1f2937" }}>
                <CreditCard className="w-5 h-5" />
                <div>
                  <div>{order.paymentMethod}</div>
                  {order.transactionId && (
                    <div className="text-xs text-gray-500">ID: {order.transactionId}</div>
                  )}
                  <div className={`text-xs ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus === 'completed' ? '✓ Paid' : 'Pending Payment'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: "#6b7280" }}>
                Delivery Address
              </div>
              <div className="flex items-start gap-2" style={{ color: "#1f2937" }}>
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {order.deliveryAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#1f2937" }}>
            Order Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <div
                  className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden"
                  style={{ backgroundColor: "white" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base md:text-lg mb-1" style={{ color: "#1f2937" }}>
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "#6b7280" }}>
                    <Store className="w-4 h-4" />
                    {item.category}
                    {item.brand && ` • ${item.brand}`}
                    {item.weight && ` • ${item.weight}`}
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280" }}>₹{item.price} × {item.quantity}</span>
                    <span className="text-lg font-bold" style={{ color: "#1f2937" }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#f8fafc" }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: "#1f2937" }}>
            Price Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span style={{ color: "#1f2937" }}>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#6b7280" }}>Delivery Charge</span>
              <span style={{ color: "#1f2937" }}>₹{order.deliveryCharge}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#6b7280" }}>Tax</span>
              <span style={{ color: "#1f2937" }}>₹{order.tax}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="pt-6 border-t" style={{ borderColor: "#e2e8f0" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold" style={{ color: "#1f2937" }}>
              Total Amount
            </span>
            <span className="text-3xl font-bold" style={{ color: "#1f2937" }}>
              ₹{order.total}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadInvoice}
              className="flex-1 px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: "#1f2937", color: "white" }}
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </motion.button>
            {order.status === "delivered" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 border-2 transition-colors"
                style={{ borderColor: "#e2e8f0", color: "#1f2937" }}
              >
                <RefreshCw className="w-5 h-5" />
                Reorder
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrderHistoryApp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderHistory, setOrderHistory] = useState([]);

  const fetchOrderHistory = async () => {
    try {
      const response = await databaseService.getAllOrdersByUserId();
      console.log("Fetched order history:", response.data);
      
      // Transform backend data to match component structure
      const transformedOrders = response?.data?.orders?.map(order => ({
        id: order.orderId,
        date: order.orderDate,
        deliveryDate: order.deliveryDate || null,
        estimatedDeliveryDate: order.estimatedDeliveryDate || null,
        total: order.totalAmount,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryCharge: order.deliveryCharge,
        discount: order.discount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        transactionId: order.transactionId,
        deliveryAddress: order.deliveryAddress.fullAddress || 
          `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`,
        items: order.items.map(item => ({
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand,
          weight: item.weight
        })),
        _id: order._id
      })) || [];
      
      setOrderHistory(transformedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  }
  
  useEffect(() => {
    fetchOrderHistory();
  }, []);
  
  const ordersPerPage = 3;

  // Filter orders based on search, date, and status
  const getFilteredOrders = () => {
    if(!orderHistory) return [];
    let filtered = [...orderHistory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesOrderId = order.id.toLowerCase().includes(searchLower);
        const matchesProductName = order.items.some((item) =>
          item.name.toLowerCase().includes(searchLower)
        );
        return matchesOrderId || matchesProductName;
      });
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "6months":
          filterDate.setMonth(now.getMonth() - 6);
          break;
      }

      filtered = filtered.filter((order) => new Date(order.date) >= filterDate);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Generate search suggestions
  const getSuggestions = () => {
    if (!searchTerm) return [];

    const suggestions = new Set();
    const searchLower = searchTerm.toLowerCase();

    orderHistory?.forEach((order) => {
      if (order.id.toLowerCase().includes(searchLower)) {
        suggestions.add(order.id);
      }
      order.items.forEach((item) => {
        if (item.name.toLowerCase().includes(searchLower)) {
          suggestions.add(item.name);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  };

  const suggestions = getSuggestions();

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Header */}
      <motion.header variants={headerVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div>
            <div className="flex justify-center items-center gap-6">
              <div className="space-y-1 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ color: "#1f2937" }}
                >
                  Order History
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg font-medium"
                  style={{ color: "#6b7280" }}
                >
                  {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <FilterDropdown
              value={dateFilter}
              setValue={setDateFilter}
              options={dateFilterOptions}
              className="flex-1 sm:flex-initial"
            />
            <FilterDropdown
              value={statusFilter}
              setValue={setStatusFilter}
              options={statusFilterOptions}
              className="flex-1 sm:flex-initial"
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 md:py-24"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-8"
            >
              <Package
                className="w-24 h-24 md:w-32 md:h-32 mx-auto"
                style={{ color: "#d1d5db" }}
              />
            </motion.div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "#1f2937" }}
            >
              No orders found
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: "#6b7280" }}>
              {searchTerm || dateFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't placed any orders yet. Start shopping to see your order history!"}
            </p>
            {(searchTerm || dateFilter !== "all" || statusFilter !== "all") && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("all");
                  setStatusFilter("all");
                }}
                className="text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
                style={{ backgroundColor: "#1f2937" }}
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={setSelectedOrder}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

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

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderHistoryApp;