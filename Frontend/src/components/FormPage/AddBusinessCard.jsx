import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Clock,
  Image,
  Tag,
  FileText,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { AnimatedBackground } from "@/Pages/Category/ReusableComponent";
import { FileUpload, TimeSelect } from "../BusinessForm";

const AddBusinessCard = () => {
  // Static type for now - would come from Redux in real app
  const formType = "service"; // 'service' or 'product'

  const [formData, setFormData] = useState({
    categories: [],
    description: "",
    image: null,
    imagePreview: "",
    operatingType: "",
    openingTime: "",
    closingTime: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    if (!formData.operatingType) {
      newErrors.operatingType = "Operating type is required";
    }

    if (formData.operatingType === "manual") {
      if (!formData.openingTime) {
        newErrors.openingTime = "Opening time is required";
      }
      if (!formData.closingTime) {
        newErrors.closingTime = "Closing time is required";
      }
      if (
        formData.openingTime &&
        formData.closingTime &&
        formData.openingTime >= formData.closingTime
      ) {
        newErrors.closingTime = "Closing time must be after opening time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      // Reset form
      setFormData({
        categories: [],
        description: "",
        image: null,
        imagePreview: "",
        operatingType: "",
        openingTime: "",
        closingTime: "",
      });
    }, 3000);
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
      if (errors.categories) {
        setErrors((prev) => ({ ...prev, categories: "" }));
      }
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, imagePreview: e.target.result }));
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen py-20 px-3 sm:px-4 relative">
      <AnimatedBackground />

      <div className="max-w-2xl mx-auto relative z-10">
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
              Add {formType === "service" ? "Service" : "Product"} Card
            </motion.h1>
            <p className="text-gray-300">
              Create your professional {formType} listing
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
                    Registration Successful!
                  </h2>
                  <p style={{ color: "#6b7280" }}>
                    Your {formType} has been registered successfully.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="py-8 px-6 sm:px-8 space-y-8">
            {/* Categories Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Tag size={16} style={{ color: "#9ca3af" }} />
                {formType === "service" ? "Service" : "Product"} Categories
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory())
                  }
                  placeholder="Enter category name"
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

              {/* Categories Display */}
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category, index) => (
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

              {errors.categories && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} />
                  {errors.categories}
                </motion.div>
              )}
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Clock size={16} style={{ color: "#9ca3af" }} />
                Operating Hours
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("operatingType", "24/7")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.operatingType === "24/7"
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      formData.operatingType === "24/7" ? "#1f2937" : "#ffffff",
                    color:
                      formData.operatingType === "24/7" ? "#ffffff" : "#374151",
                  }}
                >
                  <div className="text-lg font-semibold">24/7</div>
                  <div className="text-sm opacity-75">Always Open</div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("operatingType", "manual")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.operatingType === "manual"
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      formData.operatingType === "manual"
                        ? "#1f2937"
                        : "#ffffff",
                    color:
                      formData.operatingType === "manual"
                        ? "#ffffff"
                        : "#374151",
                  }}
                >
                  <div className="text-lg font-semibold">Custom Hours</div>
                  <div className="text-sm opacity-75">Set Specific Times</div>
                </motion.button>
              </div>

              {errors.operatingType && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} />
                  {errors.operatingType}
                </motion.div>
              )}

              {/* Manual Time Selection */}
              <AnimatePresence>
                {formData.operatingType === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <TimeSelect
                      label="Opening Time"
                      icon={Clock}
                      value={formData.openingTime}
                      onChange={(e) =>
                        handleInputChange("openingTime", e.target.value)
                      }
                      error={errors.openingTime}
                    />
                    <TimeSelect
                      label="Closing Time"
                      icon={Clock}
                      value={formData.closingTime}
                      onChange={(e) =>
                        handleInputChange("closingTime", e.target.value)
                      }
                      error={errors.closingTime}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FileUpload
                label={`${
                  formType === "service" ? "Service" : "Product"
                } Image`}
                icon={Image}
                accept="image/*"
                onChange={handleFileUpload}
                preview={formData.imagePreview}
                description="JPG, PNG, or WEBP. Max 5MB."
                error={errors.image}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <FileText size={16} style={{ color: "#9ca3af" }} />
                {formType === "service" ? "Service" : "Product"} Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder={`Describe your ${formType} in detail...`}
                rows={4}
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
                  {formData.description.length}/500
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
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registering {formType === "service" ? "Service" : "Product"}
                  ...
                </>
              ) : (
                `Register ${formType === "service" ? "Service" : "Product"}`
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBusinessCard;
