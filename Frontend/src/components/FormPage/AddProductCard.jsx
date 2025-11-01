import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Upload,
  Camera,
  Wand2,
  Package,
  Tag,
  FileText,
  DollarSign,
  Hash,
  Image,
  AlertCircle,
  Check,
  Loader2,
  Star,
  MapPin,
  Users,
  Package2,
} from "lucide-react";
import { AnimatedBackground } from "@/Pages/Category/ReusableComponent";
import { FileUpload } from "../common/FormComponents";

const AddProductCard = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    sku: "",
    weight: "",
    dimensions: "",
    tags: [],
    images: [],
    imageMethod: "", // 'upload','camera'
    warranty: "",
    deliverycharge: "",
    returnPolicy: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock quantity is required";
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (!formData.imageMethod) {
      newErrors.imageMethod = "Please select an image method";
    }

    if (!formData.deliverycharge) {
      newErrors.deliverycharge = "Please Write The Delivery Charges";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log(formData);
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        sku: "",
        weight: "",
        dimensions: "",
        tags: [],
        images: [],
        imageMethod: "",
        warranty: "",
        deliverycharge: "",
        returnPolicy: "",
      });
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
    <div className="min-h-screen py-20 px-3 relative">
      <AnimatedBackground />
      <div className="max-w-4xl mx-auto relative z-10">
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
              Add Product Card
            </motion.h1>
            <p className="text-gray-300">
              Create your professional product listing
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
                    Product Added Successfully!
                  </h2>
                  <p style={{ color: "#6b7280" }}>
                    Your product has been added to the catalog.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="py-8 sm:px-8 px-5 space-y-8">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Name */}
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
                  <Package size={16} style={{ color: "#9ca3af" }} />
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
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
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Tag size={16} style={{ color: "#9ca3af" }} />
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  placeholder="e.g., Electronics, Clothing"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
            </div>

            {/* Price and Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price */}
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
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
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

              {/* Stock */}
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
                  <Hash size={16} style={{ color: "#9ca3af" }} />
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: errors.stock ? "#ef4444" : "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
                {errors.stock && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={12} />
                    {errors.stock}
                  </motion.div>
                )}
              </motion.div>

              {/* Brand */}
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
                  <Star size={16} style={{ color: "#9ca3af" }} />
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Brand name"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>

              {/* SKU */}
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
                  <Hash size={16} style={{ color: "#9ca3af" }} />
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Product SKU"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
            </div>

            {/* Product Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Image size={16} style={{ color: "#9ca3af" }} />
                Product Images *
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

              {/* File Upload Component */}
              {formData.imageMethod === "upload" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FileUpload
                    label="Upload Product Image"
                    icon={Upload}
                    accept="image/*"
                    onChange={handleFileUpload}
                    description="JPG, PNG, or WEBP. Max 5MB."
                    error={errors.images}
                  />
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
                          Capture Product Photo
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
                          style={{
                            borderColor: "#d1d5db",
                            color: "#374151",
                          }}
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
                        alt={`Product ${index + 1}`}
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

            {/* Tags Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Tag size={16} style={{ color: "#9ca3af" }} />
                Product Tags
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Enter tag (e.g., bestseller, new, sale)"
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

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
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

            {/* Additional Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight */}
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
                  <Package size={16} style={{ color: "#9ca3af" }} />
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="e.g., 1.5 kg"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>

              {/* Dimensions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <MapPin size={16} style={{ color: "#9ca3af" }} />
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) =>
                    handleInputChange("dimensions", e.target.value)
                  }
                  placeholder="e.g., 20x15x10 cm"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>

              {/* Warranty */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Star size={16} style={{ color: "#9ca3af" }} />
                  Warranty Period
                </label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) =>
                    handleInputChange("warranty", e.target.value)
                  }
                  placeholder="e.g., 3 months"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#6b7280" }}
                >
                  <Package2 size={16} style={{ color: "#9ca3af" }} />
                  Delivery Charges
                </label>
                <input
                  type="text"
                  value={formData.deliverycharge}
                  onChange={(e) =>
                    handleInputChange("deliverycharge", e.target.value)
                  }
                  placeholder="e.g., 30"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                  }}
                />
              </motion.div>
            </div>

            {/* Return Policy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
              className="space-y-4"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <Users size={16} style={{ color: "#9ca3af" }} />
                Return Policy
              </label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["0","7", "15", "30", "60"].map((days) => (
                  <motion.button
                    key={days}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("returnPolicy", days)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      formData.returnPolicy === days
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        formData.returnPolicy === days ? "#1f2937" : "#ffffff",
                      color:
                        formData.returnPolicy === days ? "#ffffff" : "#374151",
                    }}
                  >
                    <div className="font-semibold">{days} Days</div>
                    <div className="text-xs opacity-75">Return</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Description - Last */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <label
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#6b7280" }}
              >
                <FileText size={16} style={{ color: "#9ca3af" }} />
                Product Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your product in detail - features, benefits, specifications..."
                rows={5}
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
                  {formData.description.length}/1000
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
              transition={{ delay: 0.9 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Adding Product...
                </>
              ) : (
                <>
                  <Package size={20} />
                  Add Product to Catalog
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProductCard;
