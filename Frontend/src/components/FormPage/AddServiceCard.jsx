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
  Globe,
  Calendar,
  Award,
  Users,
  Image,
  AlertCircle,
  Check,
  Loader2,
  Star,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";

const AddServiceProviderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    categories: [],
    website: "",
    establishedYear: "",
    price: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    awards: [],
    images: [],
    imageMethod: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentAward, setCurrentAward] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const serviceTypes = [
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Business name must be at least 3 characters";
    }

    if (!formData.type) {
      newErrors.type = "Service type is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one business image is required";
    }

    if (!formData.imageMethod) {
      newErrors.imageMethod = "Please select an image method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log(formData);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      resetForm();
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      categories: [],

      website: "",

      establishedYear: "",
      price: "",

      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
      },
      awards: [],
      images: [],
      imageMethod: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSocialMediaChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const addCategory = () => {
    if (
      currentCategory.trim() &&
      !formData.categories.includes(currentCategory.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, currentCategory.trim()],
      }));
      setCurrentCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
  };

  const addAward = () => {
    if (currentAward.trim() && !formData.awards.includes(currentAward.trim())) {
      setFormData((prev) => ({
        ...prev,
        awards: [...prev.awards, currentAward.trim()],
      }));
      setCurrentAward("");
    }
  };

  const removeAward = (awardToRemove) => {
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards.filter((award) => award !== awardToRemove),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && formData.imageMethod === "upload") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          file: file,
          preview: e.target.result,
          method: "upload",
        };
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      };
      reader.readAsDataURL(file);
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
      className="min-h-screen py-20 px-3 relative"
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
              Add Service Provider
            </motion.h1>
            <p className="text-gray-300">
              Create your professional business listing
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
                    Service Provider Added!
                  </h2>
                  <p style={{ color: "#6b7280" }}>
                    Your business listing has been created successfully.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="py-8 sm:px-8 px-5 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Name */}
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
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter business name"
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

              {/* Service Type */}
              {/* <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#6b7280" }}>
                  <Tag size={16} style={{ color: "#9ca3af" }} />
                  Service Type *
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      borderColor: errors.type ? "#ef4444" : "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={12} />
                    {errors.type}
                  </motion.div>
                )}
              </motion.div>
            </div> */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-[#6b7280]">
                  <Tag size={16} className="text-[#9ca3af]" />
                  Service Type *
                </label>

                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none flex items-center justify-between bg-white"
                    style={{
                      borderColor: errors.type
                        ? "#ef4444"
                        : isOpen
                        ? "#495057"
                        : "#d1d5db",
                      boxShadow: isOpen
                        ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                        : "none",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span
                      className={
                        formData.type ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {formData.type || "Select service type"}
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
                          {serviceTypes.map((type, index) => (
                            <motion.button
                              key={type}
                              type="button"
                              onClick={() => handleInputChange("type", type)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              whileHover={{ x: 4 }}
                            >
                              <span
                                className={`font-medium  ${
                                  formData.type === type
                                    ? "text-[#22223b]"
                                    : "text-[#495057]"
                                }`}
                              >
                                {type}
                              </span>
                              {formData.type === type && (
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

                {errors.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500"
                  >
                    <AlertCircle size={12} />
                    {errors.type}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Globe size={16} style={{ color: "#9ca3af" }} />
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="www.yourwebsite.com"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
              {/* Established Year */}
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
                  <Calendar size={16} style={{ color: "#9ca3af" }} />
                  Established Year
                </label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    handleInputChange("establishedYear", e.target.value)
                  }
                  placeholder="e.g., 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>

              {/* Price Range */}
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
                  <Star size={16} style={{ color: "#9ca3af" }} />
                  Price Range
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., Starting from $99/hour"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
            </div>

            {/* Categories */}
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
                <Tag size={16} style={{ color: "#9ca3af" }} />
                Service Categories Tags
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory())
                  }
                  placeholder="e.g., Wedding Photography, Portraits"
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
                  onClick={addCategory}
                  className="px-4 py-3 rounded-xl transition-all duration-300 sm:w-auto w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  <Plus size={20} />
                  <span className="sm:hidden">Add Category</span>
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <motion.span
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: "#374151", color: "#ffffff" }}
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="hover:bg-red-500 rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Business Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Image size={16} style={{ color: "#9ca3af" }} />
                Business Images *
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

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleInputChange("imageMethod", "camera");
                    startCamera();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.imageMethod === "camera"
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      formData.imageMethod === "camera" ? "#1f2937" : "#ffffff",
                    color:
                      formData.imageMethod === "camera" ? "#ffffff" : "#374151",
                  }}
                >
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Capture Image</div>
                  <div className="text-xs opacity-75">Use camera</div>
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
                        Click to upload business image
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
                          Capture Business Photo
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

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={image.preview}
                        alt={`Business ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl shadow-md"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "#ef4444" }}
                      >
                        <X size={12} />
                      </motion.button>
                      <div
                        className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-xs text-white"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      >
                        {image.method === "upload" ? "Upload" : "Camera"}
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

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Users size={16} style={{ color: "#9ca3af" }} />
                Social Media Links
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Facebook size={16} style={{ color: "#1877F2" }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Facebook
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) =>
                      handleSocialMediaChange("facebook", e.target.value)
                    }
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Instagram size={16} style={{ color: "#E4405F" }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Instagram
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Twitter size={16} style={{ color: "#1DA1F2" }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Twitter
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) =>
                      handleSocialMediaChange("twitter", e.target.value)
                    }
                    placeholder="https://twitter.com/yourpage"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Youtube size={16} style={{ color: "#FF0000" }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      YouTube
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.socialMedia.youtube}
                    onChange={(e) =>
                      handleSocialMediaChange("youtube", e.target.value)
                    }
                    placeholder="https://youtube.com/yourchannel"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} style={{ color: "#0077B5" }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      LinkedIn
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) =>
                      handleSocialMediaChange("linkedin", e.target.value)
                    }
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Award size={16} style={{ color: "#9ca3af" }} />
                Awards & Recognition
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentAward}
                  onChange={(e) => setCurrentAward(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAward())
                  }
                  placeholder="e.g., Best Service Provider 2023"
                  className="flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{ borderColor: "#d1d5db", backgroundColor: "#ffffff" }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAward}
                  className="px-4 py-3 rounded-xl transition-all duration-300 sm:w-auto w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  <Plus size={20} />
                  <span className="sm:hidden">Add Award</span>
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.awards.map((award) => (
                  <motion.span
                    key={award}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
                  >
                    <Award size={14} />
                    {award}
                    <button
                      type="button"
                      onClick={() => removeAward(award)}
                      className="hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="space-y-2"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <FileText size={16} style={{ color: "#9ca3af" }} />
                Business Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your services, expertise, what makes your business unique..."
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
                      formData.description.length < 50 ? "#ef4444" : "#10b981",
                  }}
                >
                  {formData.description.length}/50 minimum characters
                </span>
                <span style={{ color: "#9ca3af" }}>
                  {formData.description.length}/2000
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
              transition={{ delay: 0.8 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Building2 size={20} />
                  Create Service Provider
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddServiceProviderForm;
