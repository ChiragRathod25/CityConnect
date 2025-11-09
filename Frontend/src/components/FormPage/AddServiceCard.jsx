import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Upload,
  Camera,
  Building2,
  Tag,
  FileText,
  Clock,
  Award,
  Image,
  AlertCircle,
  Check,
  Loader2,
  DollarSign,
  ChevronDown,
  MapPin,
  Shield,
  XCircle,
  Calendar,
} from "lucide-react";
import databaseService from "@/services/database.services";
import BusinessmanProfileDashboard from "@/Pages/BusinessmanProfile/BusinessmanProfile";
import { useNavigate, useParams } from "react-router-dom";

const ServiceForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { businessId } = useParams();

  const { serviceId } = useParams();
  const fetchServiceDetails = async (serviceId) => {
    try {
      const response = await databaseService.getBusinessService(serviceId);
      return response.data;
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  useEffect(() => {
    if (editMode && serviceId) {
      fetchServiceDetails(serviceId).then((service) => {
        if (service) {
          setFormData(service);
        }
       //response:  tags: ['["sale","new","tag"]'],
       //separate tags to display correctly
       setFormData((prev) => ({
         ...prev,
          tags: JSON.parse(service?.tags || "[]"),
        }));

        //display images if already exist
        setImagePreviews(service?.images || []);
      });
    }
  }, [editMode, serviceId]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    serviceType: "onsite",
    availability: "",
    tags: [],
    images: [],
    warrantyDays: 0,
    cancellationPolicy: "flexible",
    imageMethod: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const serviceCategories = [
    "Photography",
    "Videography",
    "Catering",
    "Event Planning",
    "Repair Services",
    "Cleaning Services",
    "Consulting",
    "Design Services",
    "Construction",
    "Beauty & Spa",
    "Fitness & Wellness",
    "Transportation",
    "Other",
  ];

  const serviceTypes = [
    { value: "onsite", label: "On-Site Service", icon: MapPin },
    { value: "offsite", label: "Off-Site Service", icon: Building2 },
    { value: "remote", label: "Remote Service", icon: Camera },
  ];

  const warrantyOptions = [
    { value: 0, label: "No Warranty" },
    { value: 7, label: "7 Days" },
    { value: 15, label: "15 Days" },
    { value: 30, label: "30 Days" },
  ];

  const cancellationPolicies = [
    { value: "no-cancel", label: "No Cancellation", icon: XCircle },
    { value: "24hr", label: "24 Hours Notice", icon: Clock },
    { value: "48hr", label: "48 Hours Notice", icon: Clock },
    { value: "flexible", label: "Flexible", icon: Check },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Service name must be at least 3 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Service name must not exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.price || formData.price < 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one service image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    setLoading(true);
    //prepare data
    const serviceData = {
      ...formData,
    };

    // edit existing service
    if (editMode && serviceId) {
      try {
        const response = await databaseService.updateBusinessService(
          serviceId,
          serviceData
        );
        console.log("Service updated:", response);
        setSuccess(true);
        navigate(`/dashboard/business/${businessId}/services`);
      } catch (error) {
        console.error("Error updating service:", error);
      } finally {
        setLoading(false);
        return;
      }
    }

    // add new service
    try {
      const response = await databaseService.addBusinessService(
        businessId,
        serviceData
      );
      console.log("Service added:", response);
      setSuccess(true);
      navigate(`/business-profile`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      serviceType: "onsite",
      availability: "",
      tags: [],
      images: [],
      warrantyDays: 0,
      cancellationPolicy: "flexible",
      imageMethod: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const [imagePreviews, setImagePreviews] = useState([]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, file], // store only the File object
      imageMethod: "upload",
    }));

    setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const newImage = {
          id: Date.now(),
          file: blob,
          preview: canvas.toDataURL(),
          method: "camera",
        };
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      });

      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  return (
    <div
      className="min-h-screen py-10 pb-10 sm:pb-20 px-3 relative"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Header */}
          <div
            className="px-8 py-6 text-center"
            style={{ backgroundColor: "#1f2937" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {editMode ? "Edit" : "Add"} Business Service
            </motion.h1>
            <p className="text-gray-300">
              {editMode ? "Edit" : "Add"} your professional service listing
            </p>
          </div>

          {/* Success Animation */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#10b981" }}
                  >
                    <Check size={40} className="text-white" />
                  </motion.div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "#1f2937" }}
                  >
                    Service Added Successfully!
                  </h2>
                  <p style={{ color: "#6b7280" }}>
                    Your service has been created and is now active.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="py-8 sm:px-8 px-5 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Building2 size={16} style={{ color: "#9ca3af" }} />
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter service name"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: errors.name ? "#ef4444" : "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={12} />
                    {errors.name}
                  </motion.div>
                )}
              </motion.div>

              {/* Category */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-[#6b7280]">
                  <Tag size={16} className="text-[#9ca3af]" />
                  Service Category
                </label>

                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none flex items-center justify-between bg-white"
                    style={{
                      borderColor: isOpen ? "#495057" : "#d1d5db",
                      boxShadow: isOpen
                        ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                        : "none",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span
                      className={
                        formData.category ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {formData.category || "Select category"}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
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
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl overflow-hidden"
                      >
                        <div className="max-h-64 overflow-y-auto">
                          {serviceCategories.map((category, index) => (
                            <motion.button
                              key={category}
                              type="button"
                              onClick={() =>
                                handleInputChange("category", category)
                              }
                              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              whileHover={{ x: 4 }}
                            >
                              <span
                                className={`font-medium ${
                                  formData.category === category
                                    ? "text-[#22223b]"
                                    : "text-[#495057]"
                                }`}
                              >
                                {category}
                              </span>
                              {formData.category === category && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                >
                                  <Check size={18} className="text-[#212529]" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <DollarSign size={16} style={{ color: "#9ca3af" }} />
                  Price *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: errors.price ? "#ef4444" : "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
                {errors.price && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={12} />
                    {errors.price}
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Clock size={16} style={{ color: "#9ca3af" }} />
                  Duration *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="e.g., 30 mins, 2 hours"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: errors.duration ? "#ef4444" : "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
                {errors.duration && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={12} />
                    {errors.duration}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Service Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <MapPin size={16} style={{ color: "#9ca3af" }} />
                Service Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("serviceType", type.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                      formData.serviceType === type.value
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        formData.serviceType === type.value
                          ? "#1f2937"
                          : "#ffffff",
                      color:
                        formData.serviceType === type.value
                          ? "#ffffff"
                          : "#374151",
                    }}
                  >
                    <type.icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Calendar size={16} style={{ color: "#9ca3af" }} />
                Availability
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                placeholder="e.g., Mon–Fri 9AM–6PM"
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                style={{
                  borderColor: "#d1d5db",
                  backgroundColor: "#ffffff",
                }}
              />
            </motion.div>

            {/* Warranty and Cancellation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Shield size={16} style={{ color: "#9ca3af" }} />
                  Warranty Period
                </label>
                <select
                  value={formData.warrantyDays}
                  onChange={(e) =>
                    handleInputChange("warrantyDays", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none appearance-none cursor-pointer"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {warrantyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <XCircle size={16} style={{ color: "#9ca3af" }} />
                  Cancellation Policy
                </label>
                <select
                  value={formData.cancellationPolicy}
                  onChange={(e) =>
                    handleInputChange("cancellationPolicy", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none appearance-none cursor-pointer"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {cancellationPolicies.map((policy) => (
                    <option key={policy.value} value={policy.value}>
                      {policy.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Tag size={16} style={{ color: "#9ca3af" }} />
                Service Tags
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="e.g., Professional, Quick, Affordable"
                  className="flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTag}
                  className="px-4 py-3 rounded-xl transition-all duration-300 sm:w-auto w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  <Plus size={20} />
                  <span className="sm:hidden">Add Tag</span>
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: "#374151", color: "#ffffff" }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-red-500 rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Service Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Image size={16} style={{ color: "#9ca3af" }} />
                Service Images *
              </label>

              {/* Image Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("imageMethod", "upload")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.imageMethod === "upload"
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      formData.imageMethod === "upload" ? "#1f2937" : "#ffffff",
                    color:
                      formData.imageMethod === "upload" ? "#ffffff" : "#374151",
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Upload Image</div>
                  <div className="text-xs opacity-75">From device</div>
                </motion.button>
              </div>

              {errors.imageMethod && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} />
                  {errors.imageMethod}
                </motion.div>
              )}

              {/* File Upload */}
              {formData.imageMethod === "upload" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block">
                    <div
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition-all duration-300"
                      style={{ borderColor: "#d1d5db" }}
                    >
                      <Upload
                        className="w-12 h-12 mx-auto mb-3"
                        style={{ color: "#9ca3af" }}
                      />
                      <p
                        className="font-semibold mb-1"
                        style={{ color: "#374151" }}
                      >
                        Click to upload service image
                      </p>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        JPG, PNG, or WEBP. Max 5MB.
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}

              {/* Camera Modal */}
              <AnimatePresence>
                {showCamera && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
                    >
                      <div className="text-center mb-4">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "#1f2937" }}
                        >
                          Capture Service Photo
                        </h3>
                      </div>

                      <div className="relative mb-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-xl"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={capturePhoto}
                          className="flex-1 py-3 rounded-xl text-white font-semibold"
                          style={{ backgroundColor: "#1f2937" }}
                        >
                          <Camera className="w-5 h-5 mx-auto mb-1" />
                          Capture
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={stopCamera}
                          className="flex-1 py-3 rounded-xl border-2 font-semibold"
                          style={{ borderColor: "#d1d5db", color: "#374151" }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🖼️ Image Preview Grid */}
              {imagePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3"
                >
                  {imagePreviews.map((src, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                      />

                      {/* ❌ Delete button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </motion.button>

                      {/* 📸 Image method label */}
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-xs text-white bg-black bg-opacity-60 capitalize">
                        {formData.imageMethod || "upload"}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {errors.images && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} />
                  {errors.images}
                </motion.div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <FileText size={16} style={{ color: "#9ca3af" }} />
                Service Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your service, what's included, benefits, and what makes it unique..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none resize-none"
                style={{
                  borderColor: errors.description ? "#ef4444" : "#d1d5db",
                  backgroundColor: "#ffffff",
                }}
              />
              <div className="flex justify-between text-xs">
                <span
                  style={{
                    color:
                      formData.description.length < 20 ? "#ef4444" : "#10b981",
                  }}
                >
                  {formData.description.length}/20 minimum characters
                </span>
                <span style={{ color: "#9ca3af" }}>
                  {formData.description.length} characters
                </span>
              </div>
              {errors.description && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} />
                  {errors.description}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
              style={{ backgroundColor: loading ? "#6b7280" : "#1f2937" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {editMode ? "Editing" : "Creating"} Service...
                </>
              ) : (
                <>
                  <Building2 size={20} />
                  {editMode ? "Edit" : "Add"} Service
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceForm;
