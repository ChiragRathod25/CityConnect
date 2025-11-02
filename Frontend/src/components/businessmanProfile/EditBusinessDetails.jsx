import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Store,
  Target,
  Calendar,
  Users,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  AlertCircle,
  Save,
  X,
  CheckCircle,
  Edit3,
  ChevronDown,
} from "lucide-react";
import MoveBackButton from "../ui/MoveBackButton";

const FormInput = ({ label, icon: Icon, error, className = "", ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    <div className="relative">
      <input
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs mt-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  </div>
);

const FormSelect = ({
  label,
  icon: Icon,
  options = [],
  error,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.value === props.value) || null
  );
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

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === props.value) || null);
  }, [props.value, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({ target: { value: option.value } });
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 text-left flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-200"
          } ${className}`}
        >
          <span
            className={
              selectedOption?.value ? "text-gray-900" : "text-gray-500"
            }
          >
            {selectedOption?.label || "Select an option"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto"
            >
              {options
                .filter((opt) => opt.value !== "")
                .map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{
                      backgroundColor: "#f3f4f6",
                      x: 8,
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(option)}
                  >
                    <span className="group-hover:font-semibold transition-all">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs mt-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default function EditBusinessDetails({onBack}) {
  const [activeSection, setActiveSection] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    businessName: "Tech Solutions Inc",
    businessType: "Private Limited",
    businessCategory: "Technology",
    establishedYear: "2020",
    numberOfEmployees: "11-50",
    annualRevenue: "5000000",
    businessDescription:
      "Leading provider of innovative technology solutions for businesses across various industries.",
    phone: "9876543210",
    email: "contact@techsolutions.com",
    website: "https://www.techsolutions.com",
    socialMedia: {
      facebook: "https://facebook.com/techsolutions",
      instagram: "https://instagram.com/techsolutions",
      twitter: "https://twitter.com/techsolutions",
      linkedin: "https://linkedin.com/company/techsolutions",
      youtube: "https://youtube.com/techsolutions",
    },
  });

  const businessTypes = [
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Private Limited", label: "Private Limited" },
    { value: "Public Limited", label: "Public Limited" },
    { value: "LLP", label: "LLP" },
  ];

  const businessCategories = [
    { value: "Technology", label: "Technology" },
    { value: "Retail", label: "Retail" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Finance", label: "Finance" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Services", label: "Services" },
    { value: "Other", label: "Other" },
  ];

  const yearsOptions = Array.from({ length: 50 }, (_, i) => {
    const year = (new Date().getFullYear() - i).toString();
    return { value: year, label: year };
  });

  const employeeOptions = [
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-200", label: "51-200" },
    { value: "201-500", label: "201-500" },
    { value: "500+", label: "500+" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === "business") {
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!formData.businessType)
        newErrors.businessType = "Business type is required";
      if (!formData.businessCategory)
        newErrors.businessCategory = "Category is required";
      if (!formData.establishedYear)
        newErrors.establishedYear = "Year is required";
      if (!formData.numberOfEmployees)
        newErrors.numberOfEmployees = "Employee count is required";
      if (!formData.businessDescription.trim())
        newErrors.businessDescription = "Description is required";
    }

    if (section === "contact") {
      if (!formData.phone || formData.phone.length !== 10)
        newErrors.phone = "Valid 10-digit phone required";
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Valid email required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (section) => {
    if (validateSection(section)) {
      setShowSuccess(true);
      setActiveSection(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setActiveSection(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 pb-4 sm:pb-0">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={onBack} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Edit3 className="text-white animate-bounce" size={30} />
          </div>
          <h1 className="text-3xl  lg:text-4xl font-bold text-gray-800 mb-3">
            Edit Business Details
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Update your business information
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-green-700 font-semibold">
                Changes saved successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Business Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 lg:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Business Details
                </h2>
                <p className="text-sm text-gray-600">
                  Core business information
                </p>
              </div>
            </div>
            {activeSection !== "business" && (
              <button
                onClick={() => setActiveSection("business")}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeSection === "business" ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <FormInput
                  label="Business Name *"
                  icon={Store}
                  name="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  error={errors.businessName}
                />

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormSelect
                    label="Business Type *"
                    icon={Building2}
                    name="businessType"
                    options={businessTypes}
                    value={formData.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                    error={errors.businessType}
                  />

                  <FormSelect
                    label="Business Category *"
                    icon={Target}
                    name="businessCategory"
                    options={businessCategories}
                    value={formData.businessCategory}
                    onChange={(e) =>
                      handleInputChange("businessCategory", e.target.value)
                    }
                    error={errors.businessCategory}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormSelect
                    label="Established Year *"
                    icon={Calendar}
                    name="establishedYear"
                    options={yearsOptions}
                    value={formData.establishedYear}
                    onChange={(e) =>
                      handleInputChange("establishedYear", e.target.value)
                    }
                    error={errors.establishedYear}
                  />

                  <FormSelect
                    label="Number of Employees *"
                    icon={Users}
                    name="numberOfEmployees"
                    options={employeeOptions}
                    value={formData.numberOfEmployees}
                    onChange={(e) =>
                      handleInputChange("numberOfEmployees", e.target.value)
                    }
                    error={errors.numberOfEmployees}
                  />
                </div>

                <FormInput
                  label="Annual Revenue (Optional)"
                  icon={DollarSign}
                  name="annualRevenue"
                  type="number"
                  placeholder="Enter annual revenue in INR"
                  value={formData.annualRevenue}
                  onChange={(e) =>
                    handleInputChange("annualRevenue", e.target.value)
                  }
                />

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={16} className="text-gray-500" />
                    Business Description *
                  </label>
                  <textarea
                    name="businessDescription"
                    placeholder="Describe your business, services, and what makes you unique"
                    rows={4}
                    value={formData.businessDescription}
                    onChange={(e) =>
                      handleInputChange("businessDescription", e.target.value)
                    }
                    maxLength={500}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 resize-none ${
                      errors.businessDescription
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.businessDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-red-500 text-xs mt-1"
                    >
                      <AlertCircle size={12} />
                      {errors.businessDescription}
                    </motion.div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.businessDescription.length}/500 characters
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => handleSave("business")}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-6"
              >
                <div>
                  <p className="text-xs text-gray-500 mb-1">Business Name</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.businessName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Business Type</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.businessType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.businessCategory}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Established</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.establishedYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employees</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.numberOfEmployees}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Annual Revenue</p>
                  <p className="text-gray-800 font-semibold">
                    ₹{parseInt(formData.annualRevenue).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-gray-800">
                    {formData.businessDescription}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>
                <p className="text-sm text-gray-600">Communication details</p>
              </div>
            </div>
            {activeSection !== "contact" && (
              <button
                onClick={() => setActiveSection("contact")}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeSection === "contact" ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <FormInput
                  label="Website (Optional)"
                  icon={Globe}
                  name="website"
                  type="url"
                  placeholder="https://www.yourbusiness.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-blue-600" />
                    Social Media Links (Optional)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Facebook"
                      icon={Facebook}
                      name="facebook"
                      placeholder="Facebook page URL"
                      value={formData.socialMedia.facebook}
                      onChange={(e) =>
                        handleInputChange("socialMedia", {
                          ...formData.socialMedia,
                          facebook: e.target.value,
                        })
                      }
                    />

                    <FormInput
                      label="Instagram"
                      icon={Instagram}
                      name="instagram"
                      placeholder="Instagram profile URL"
                      value={formData.socialMedia.instagram}
                      onChange={(e) =>
                        handleInputChange("socialMedia", {
                          ...formData.socialMedia,
                          instagram: e.target.value,
                        })
                      }
                    />

                    <FormInput
                      label="Twitter"
                      icon={Twitter}
                      name="twitter"
                      placeholder="Twitter profile URL"
                      value={formData.socialMedia.twitter}
                      onChange={(e) =>
                        handleInputChange("socialMedia", {
                          ...formData.socialMedia,
                          twitter: e.target.value,
                        })
                      }
                    />

                    <FormInput
                      label="LinkedIn"
                      icon={Linkedin}
                      name="linkedin"
                      placeholder="LinkedIn page URL"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) =>
                        handleInputChange("socialMedia", {
                          ...formData.socialMedia,
                          linkedin: e.target.value,
                        })
                      }
                    />

                    <FormInput
                      label="YouTube"
                      icon={Youtube}
                      name="youtube"
                      placeholder="YouTube channel URL"
                      value={formData.socialMedia.youtube}
                      onChange={(e) =>
                        handleInputChange("socialMedia", {
                          ...formData.socialMedia,
                          youtube: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => handleSave("contact")}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Website</p>
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold break-all"
                  >
                    {formData.website}
                  </a>
                </div>

                <div className="pt-4 border-t-2 border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    Social Media
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {formData.socialMedia.facebook && (
                      <a
                        href={formData.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                      >
                        <Facebook size={16} />
                        <span className="hidden sm:inline">Facebook</span>
                      </a>
                    )}
                    {formData.socialMedia.instagram && (
                      <a
                        href={formData.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                      >
                        <Instagram size={16} />
                        <span className="hidden sm:inline">Instagram</span>
                      </a>
                    )}
                    {formData.socialMedia.twitter && (
                      <a
                        href={formData.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:underline text-sm"
                      >
                        <Twitter size={16} />
                        <span className="hidden sm:inline">Twitter</span>
                      </a>
                    )}
                    {formData.socialMedia.linkedin && (
                      <a
                        href={formData.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-700 hover:underline text-sm"
                      >
                        <Linkedin size={16} />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </a>
                    )}
                    {formData.socialMedia.youtube && (
                      <a
                        href={formData.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 hover:underline text-sm"
                      >
                        <Youtube size={16} />
                        <span className="hidden sm:inline">YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
