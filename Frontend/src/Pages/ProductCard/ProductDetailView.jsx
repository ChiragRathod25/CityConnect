import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Star,
  Store,
  MapPin,
  Weight,
  Ruler,
  Award,
  Package,
  RotateCcw,
  Shield,
  Truck,
  Tag,
  ShoppingCart,
  MessageCircle,
  Heart,
  ChevronRight,
} from "lucide-react";
import { sampleProducts } from "./ProductCard";

const ProductDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Find product by ID from your sampleProducts array
  const product = sampleProducts.find((p) => p.id === parseInt(id));

  // If product not found, redirect or show error
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/card");
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const nextReview = () => {
    setCurrentReview((prev) =>
      prev === product.reviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevReview = () => {
    setCurrentReview((prev) =>
      prev === 0 ? product.reviews.length - 1 : prev - 1
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <motion.button
            whileHover={{ x: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 px-4 sm:px-6 py-3 rounded-2xl shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">Back to Products</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16"
        >
          {/* Image Gallery */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 md:space-y-8"
          >
            <motion.div
              className="relative h-80 sm:h-96 lg:h-[500px] xl:h-[550px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-lg shadow-lg"
                >
                  {product.discount}% OFF
                </motion.div>
              )}
            </motion.div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide"
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                      index === currentImageIndex
                        ? "border-gray-800 shadow-lg ring-2 ring-gray-300"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={cardVariants}>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 md:mb-6 gap-4"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{product.price}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-lg sm:text-xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
              >
                <span className="text-lg sm:text-xl text-gray-600 flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </motion.div>

              {/* Status Badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 mb-6 md:mb-8"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                    product.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isOpen ? "🟢 Open Now" : "🔴 Closed"}
                </motion.span>
                {product.inStock && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                  >
                    📦 In Stock
                  </motion.span>
                )}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  {product.distance}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={cardVariants}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="font-bold  text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                {product.description}
              </p>
            </motion.div>

            {/* Specifications */}
            <motion.div
              variants={itemVariants}
              className="grid sm:grid-cols-1  gap-6"
            >
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 space-y-4 md:space-y-5 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold  text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                  Specifications
                </h3>
                {product.weight && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <Weight className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>Weight:</strong> {product.weight}
                    </span>
                  </motion.div>
                )}
                {product.dimensions && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <Ruler className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>Dimensions:</strong> {product.dimensions}
                    </span>
                  </motion.div>
                )}
                {product.brand && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <Award className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>Brand:</strong> {product.brand}
                    </span>
                  </motion.div>
                )}
                {product.sku && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>SKU:</strong> {product.sku}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white  p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 space-y-4 md:space-y-5 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold   text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                  Policies
                </h3>
                {product.returnPeriod && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>Return:</strong> {product.returnPeriod}
                    </span>
                  </motion.div>
                )}
                {product.warranty && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-base md:text-lg">
                      <strong>Warranty:</strong> {product.warranty}
                    </span>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3"
                >
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 text-base md:text-lg">
                    <strong>Delivery:</strong> Free delivery
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300  text-center"
              >
                <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-gray-100 text-gray-700 px-4 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md text-sm md:text-base"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Purchase Actions */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -3 }}
              className="bg-white text-center p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 "
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 md:mb-8">
                <label className="font-bold text-xl md:text-2xl text-gray-700">
                  Quantity:
                </label>
                <div className="flex w-fit items-center border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6", scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 sm:px-6 py-3 text-lg md:text-xl font-bold  transition-all duration-200"
                  >
                    -
                  </motion.button>
                  <span className="px-6 sm:px-8 py-3 border-x-2 border-gray-200 text-lg md:text-xl font-bold min-w-[60px] sm:min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6", scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4  sm:px-6 py-3 text-lg md:text-xl font-bold  transition-all duration-200"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <div className="flex  sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.isOpen || !product.inStock}
                  className={`flex-1 py-4 w-fit md:py-5 px-6 md:px-8 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                    product.isOpen && product.inStock
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="hidden sm:inline">
                    {product.isOpen
                      ? product.inStock
                        ? "Add to Cart"
                        : "Out of Stock"
                      : "Store Closed"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 md:p-5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all duration-300 w-fit  shadow-sm hover:shadow-md"
                >
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 md:p-5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-sm w-fit hover:shadow-md"
                >
                  <Heart className="w-6 h-6 md:w-7 md:h-7" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-12 md:mt-20"
          >
            {/* Reviews Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-4"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Customer Reviews
              </h3>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <span className="text-lg sm:text-xl font-medium text-gray-600">
                  {currentReview + 1} of {product.reviews.length}
                </span>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#d1d5db" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevReview}
                    disabled={product.reviews.length <= 1}
                    className="p-3 md:p-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#d1d5db" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextReview}
                    disabled={product.reviews.length <= 1}
                    className="p-3 md:p-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:shadow-md"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Review Card */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 300, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -300, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-gray-100 hover:shadow-3xl transition-all duration-500"
                >
                  {/* Review Content */}
                  <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    {/* Reviewer Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0 self-center lg:self-start"
                    >
                      <img
                        src={product.reviews[currentReview].reviewer.photo}
                        alt={product.reviews[currentReview].reviewer.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                      />
                    </motion.div>

                    {/* Review Details */}
                    <div className="flex-1 space-y-6">
                      {/* Reviewer Info & Rating */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-3">
                          <h5 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                            {product.reviews[currentReview].reviewer.name}
                          </h5>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              {renderStars(
                                product.reviews[currentReview].rating
                              )}
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              {product.reviews[currentReview].rating}.0
                            </span>
                          </div>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="text-sm sm:text-base text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium self-start"
                        >
                          {new Date(
                            product.reviews[currentReview].date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </motion.span>
                      </div>

                      {/* Review Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 bg-gray-50 p-6 rounded-2xl"
                      >
                        {product.reviews[currentReview].description}
                      </motion.p>

                      {/* Review Images */}
                      {product.reviews[currentReview].images &&
                        product.reviews[currentReview].images.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex space-x-4 overflow-x-auto pb-2"
                          >
                            {product.reviews[currentReview].images.map(
                              (image, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.05, y: -5 }}
                                  className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                  <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
                                  />
                                </motion.div>
                              )
                            )}
                          </motion.div>
                        )}
                    </div>
                  </div>

                  {/* Review Pagination Dots */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-8 md:mt-12 space-x-3"
                  >
                    {product.reviews.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentReview(index)}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                          index === currentReview
                            ? "bg-gray-900 scale-125 shadow-lg"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailView;
