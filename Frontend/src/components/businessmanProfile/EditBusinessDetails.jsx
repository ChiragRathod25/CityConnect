import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Store,
  Target,
  Calendar,
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
import databaseService from "@/services/database.services";
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
  const [loading, setLoading] = useState(true);

  // Simulated businessId - replace with actual useParams() in your app
  const businessId = "690649b2b7f1561d678bcc62";

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
  });

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const responseData = await databaseService.getBusinessProfileById(
        businessId
      );

      // Map backend response to form structure
      const businessData = responseData.data;
      setFormData({
        name: businessData.name || "",
        type: businessData.type || "",
        category: businessData.category || "",
        description: businessData.description || "",
        phone: businessData.contactDetails?.phone || "",
        email: businessData.contactDetails?.email || "",
        website: businessData.contactDetails?.website || "",
        socialMedia: {
          facebook: businessData.contactDetails?.socialMedia?.facebook || "",
          instagram: businessData.contactDetails?.socialMedia?.instagram || "",
          twitter: businessData.contactDetails?.socialMedia?.twitter || "",
          linkedin: businessData.contactDetails?.socialMedia?.linkedin || "",
          youtube: businessData.contactDetails?.socialMedia?.youtube || "",
        },
      });
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, [businessId]);

  const businessTypes = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
    { value: "both", label: "Product & Service" },
  ];

  const businessCategories = [
    { value: "cafe", label: "Café" },
    { value: "restaurant", label: "Restaurant" },
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "finance", label: "Finance" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "services", label: "Services" },
    { value: "other", label: "Other" },
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
      if (!formData.name?.trim()) newErrors.name = "Business name is required";
      if (!formData.type) newErrors.type = "Business type is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.description?.trim())
        newErrors.description = "Description is required";
    }

    if (section === "contact") {
      // Phone validation - allow international format
      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      }

      // Email validation
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Valid email required";
      }

      // URL validation for website
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website =
          "Valid URL required (must start with http:// or https://)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (section) => {
    if (validateSection(section)) {
      try {
        // Prepare data for API call
        if (section === "business") {
          // Call API to update business details
          const businessUpdateData = {
            name: formData.name,
            type: formData.type,
            category: formData.category,
            description: formData.description,
          };
          console.log("Updating business:", businessUpdateData);
          await databaseService.updateBusinessProfile(businessId, businessUpdateData);
        } else if (section === "contact") {
          // Call API to update contact details
          const contactUpdateData = {
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            socialMedia: formData.socialMedia,
          };
          console.log("Updating contact:", contactUpdateData);
          await databaseService.updateBusinessContact(businessId, contactUpdateData);
        }

        setShowSuccess(true);
        setActiveSection(null);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Error saving data:", error);
        // Handle error appropriately
      }
    }
  };

  const handleCancel = () => {
    setActiveSection(null);
    setErrors({});
    fetchFormData(); // Reload original data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

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
            <Edit3 className="text-white" size={30} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
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
                  name="name"
                  placeholder="Enter your business name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                />

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormSelect
                    label="Business Type *"
                    icon={Building2}
                    name="type"
                    options={businessTypes}
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    error={errors.type}
                  />

                  <FormSelect
                    label="Business Category *"
                    icon={Target}
                    name="category"
                    options={businessCategories}
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    error={errors.category}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={16} className="text-gray-500" />
                    Business Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your business, services, and what makes you unique"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    maxLength={500}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 resize-none ${
                      errors.description
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.description && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-red-500 text-xs mt-1"
                    >
                      <AlertCircle size={12} />
                      {errors.description}
                    </motion.div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.description?.length || 0}/500 characters
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
                    {formData.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Business Type</p>
                  <p className="text-gray-800 font-semibold capitalize">
                    {formData.type || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-gray-800 font-semibold capitalize">
                    {formData.category || "Not set"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-gray-800">
                    {formData.description || "No description provided"}
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
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormInput
                    label="Phone Number *"
                    icon={Phone}
                    name="phone"
                    type="tel"
                    placeholder="+1 510 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    error={errors.phone}
                  />

                  <FormInput
                    label="Email Address *"
                    icon={Mail}
                    name="email"
                    type="email"
                    placeholder="contact@yourbusiness.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={errors.email}
                  />
                </div>

                <FormInput
                  label="Website (Optional)"
                  icon={Globe}
                  name="website"
                  type="url"
                  placeholder="https://www.yourbusiness.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  error={errors.website}
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
                      placeholder="https://facebook.com/yourpage"
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
                      placeholder="https://instagram.com/yourprofile"
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
                      placeholder="https://twitter.com/yourprofile"
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
                      placeholder="https://linkedin.com/company/yourcompany"
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
                      placeholder="https://youtube.com/yourchannel"
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-800 font-semibold">
                      {formData.phone || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-800 font-semibold break-all">
                      {formData.email || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Website</p>
                  {formData.website ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold break-all"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    <p className="text-gray-400">Not set</p>
                  )}
                </div>

                <div className="pt-4 border-t-2 border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    Social Media
                  </h4>
                  {Object.values(formData.socialMedia).some((url) => url) ? (
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
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No social media links added
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
