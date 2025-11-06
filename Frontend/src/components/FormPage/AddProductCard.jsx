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
import { useNavigate, useParams } from "react-router-dom";
import databaseService from "@/services/database.services";

// Mock AnimatedBackground component
const AnimatedBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70" />
);

// Mock FileUpload component
const FileUpload = ({
  label,
  icon: Icon,
  accept,
  onChange,
  description,
  error,
}) => (
  <div className="space-y-2">
    <label className="block">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
        <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </label>
    {error && (
      <div className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} />
        {error}
      </div>
    )}
  </div>
);

const ProductForm = ({ editMode = false }) => {
  const { businessId } = useParams();

  const { productId } = useParams();

  const fetchProductDetails = async (productId) => {
    try {
      const product = await databaseService.getBusinessProduct(productId);
      return product;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  useEffect(() => {
    if (editMode && businessId && productId) {
      fetchProductDetails(productId).then((product) => {
        if (product) {
          setFormData(product?.data);

          //response:  tags: ['["sale","new","tag"]'],
          //separate tags to display correctly
          setFormData((prev) => ({
            ...prev,
            tags: JSON.parse(product?.data?.tags || "[]"),
          }));

          //display images if already exist
          setImagePreviews(product?.data?.images || []);
        }
      });
    }
  }, [editMode, productId]);

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
    images: [], // array of multiple images locally stored before upload
    imageMethod: "", // 'upload', 'camera', 'ai'
    warranty: "",
    deliveryCharge: "",
    returnPolicyDays: 0,
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
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be >= 0";
    }

    if (!formData.stock && formData.stock !== "0") {
      newErrors.stock = "Stock quantity is required";
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (formData.deliveryCharge && parseFloat(formData.deliveryCharge) < 0) {
      newErrors.deliveryCharge = "Delivery charge cannot be negative";
    }

    console.log("Validation Errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    const trueFalse = validateForm();
    if (!trueFalse) return;

    setLoading(true);

    
    // Prepare data matching the model structure

    const productData = {
      ...formData,
    };

    if(editMode && productId){
      try {
        const response= await databaseService.updateBusinessProduct(
          productId,
          productData
        );
        console.log("Product updated successfully:", response);
        setSuccess(true);
        navigate("/products");
      } catch (error) {
        console.error("Error updating product:", error);
      }finally{
        setLoading(false);
        return;
      }
    }

    // if not edit mode, add new product
    try {
      const response = await databaseService.addBusinessProduct(
        businessId,
        productData
      );
      console.log("Product added successfully:", response);
      setSuccess(true);

      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
    }

    setLoading(false);
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

      const dataUrl = canvas.toDataURL("image/jpeg");
      const newImage = {
        id: Date.now(),
        url: dataUrl, // In production, upload to CDN/S3
        filename: `camera-${Date.now()}.jpg`,
        method: "camera",
        size: undefined, // Calculate from blob if needed
        alt: formData.name || "Product image",
      };
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }

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

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen py-20 px-3 relative">
      <AnimatedBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl shadow-2xl overflow-hidden bg-white"
        >
          {/* Header */}
          <div className="px-8 py-6 text-center bg-gray-800">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {editMode ? "Edit" : "Add"} Product Card
            </motion.h1>
            <p className="text-gray-300">
              {editMode ? "Update" : "Create"} your professional product listing
            </p>
          </div>

          {/* Success Animation */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-95"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={40} className="text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Product Added Successfully!
                  </h2>
                  <p className="text-gray-600">
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Package size={16} className="text-gray-400" />
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Tag size={16} className="text-gray-400" />
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  placeholder="e.g., Electronics, Clothing"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <DollarSign size={16} className="text-gray-400" />
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Hash size={16} className="text-gray-400" />
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Star size={16} className="text-gray-400" />
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Brand name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </motion.div>

              {/* SKU */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Hash size={16} className="text-gray-400" />
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Product SKU"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Image size={16} className="text-gray-400" />
                Product Images *
              </label>

              {/* Image Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("imageMethod", "upload")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.imageMethod === "upload"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Upload Image</div>
                  <div className="text-xs opacity-75">From device</div>
                </motion.button>

                {/* <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleInputChange("imageMethod", "camera");
                    startCamera();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.imageMethod === "camera"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Capture Image</div>
                  <div className="text-xs opacity-75">Use camera</div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleInputChange("imageMethod", "ai");
                    alert("AI image generation coming soon!");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    formData.imageMethod === "ai"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Wand2 className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">AI Generated</div>
                  <div className="text-xs opacity-75">Coming soon</div>
                </motion.button> */}
              </div>

              {errors.imageMethod && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-red-500"
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
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="bg-white rounded-2xl p-6 max-w-md w-full"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Capture Product Photo
                        </h3>
                      </div>

                      <div className="relative mb-4 bg-black rounded-xl overflow-hidden">
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
                          className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-semibold flex flex-col items-center"
                        >
                          <Camera className="w-5 h-5 mb-1" />
                          Capture
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={stopCamera}
                          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold"
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
                  className="flex items-center gap-1 text-xs text-red-500"
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
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Tag size={16} className="text-gray-400" />
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
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTag}
                  className="px-6 py-3 rounded-xl bg-gray-800 text-white transition-all duration-300 sm:w-auto w-full flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  <span>Add Tag</span>
                </motion.button>
              </div>

              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-red-500 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Package size={16} className="text-gray-400" />
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="e.g., 1.5 kg"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </motion.div>

              {/* Dimensions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) =>
                    handleInputChange("dimensions", e.target.value)
                  }
                  placeholder="e.g., 20x15x10 cm"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </motion.div>

              {/* Warranty */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Star size={16} className="text-gray-400" />
                  Warranty Period
                </label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) =>
                    handleInputChange("warranty", e.target.value)
                  }
                  placeholder="e.g., 3 months, 1 year"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </motion.div>

              {/* Delivery Charge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <Package2 size={16} className="text-gray-400" />
                  Delivery Charge
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deliveryCharge}
                  onChange={(e) =>
                    handleInputChange("deliveryCharge", e.target.value)
                  }
                  placeholder="e.g., 30"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                    errors.deliveryCharge ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.deliveryCharge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500"
                  >
                    <AlertCircle size={12} />
                    {errors.deliveryCharge}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Return Policy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Users size={16} className="text-gray-400" />
                Return Policy Days
              </label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[0, 7, 15, 30, 60].map((days) => (
                  <motion.button
                    key={days}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("returnPolicyDays", days)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      formData.returnPolicyDays === days
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">{days} Days</div>
                    <div className="text-xs opacity-75">
                      {days === 0 ? "No Return" : "Return"}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Description - Last */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <FileText size={16} className="text-gray-400" />
                Product Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your product in detail - features, benefits, specifications..."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="flex justify-between text-xs">
                <span
                  className={
                    formData.description.length < 20
                      ? "text-red-500"
                      : "text-green-600"
                  }
                >
                  {formData.description.length}/20 minimum characters
                </span>
                <span className="text-gray-400">
                  {formData.description.length}/1000
                </span>
              </div>
              {errors.description && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-xs text-red-500"
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
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {editMode ? "Updating" : "Adding"} Product...
                </>
              ) : (
                <>
                  <Package size={20} />
                  {editMode ? "Update" : "Add"} Product to Catalog
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductForm;
