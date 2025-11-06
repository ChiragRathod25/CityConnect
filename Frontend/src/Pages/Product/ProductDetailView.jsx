import { useState, useEffect } from "react";
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
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import databaseService from "@/services/database.services";

const ProductDetailView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data - replace with your actual API call
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Replace this with your actual API endpoint
        const response=await databaseService.getBusinessProduct(productId);
        const data=response.data;
        setProduct(data);  
        
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  // Handle images - use product images or fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  // Parse tags if they're stored as JSON string
  const parseTags = (tags) => {
    if (!tags || tags.length === 0) return [];
    try {
      // If it's a string that looks like JSON, parse it
      if (typeof tags[0] === 'string' && tags[0].startsWith('[')) {
        return JSON.parse(tags[0]);
      }
      // If it's a comma-separated string
      if (typeof tags[0] === 'string' && tags[0].includes(',')) {
        return tags[0].split(',').map(t => t.trim());
      }
      return tags;
    } catch {
      return tags;
    }
  };

  const displayTags = parseTags(product.tags);

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

  // Stock status
  const isInStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

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

  const handleAddToCart = async () => {
    try {
      // Replace this with your actual API call to add to cart
      const response=await databaseService.addProductToCart(productId, quantity);
      console.log('Add to cart response:', response);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-sm border-b border-gray-200"
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
              className="relative h-80 sm:h-96 lg:h-[500px] xl:h-[550px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              
              {/* Stock Badge */}
              {isLowStock && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Only {product.stock} left
                </motion.div>
              )}
              
              {!isInStock && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Out of Stock
                </motion.div>
              )}
            </motion.div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide"
              >
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.08, y: -4 }}
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
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
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
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-lg sm:text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
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
                {product.brand && (
                  <span className="text-lg sm:text-xl text-gray-600 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {product.brand}
                  </span>
                )}
              </motion.div>

              {/* Status Badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 mb-6 md:mb-8"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm flex items-center gap-2 ${
                    isInStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isInStock ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                </motion.span>
                
                {product.deliveryCharge !== null && product.deliveryCharge !== undefined && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    {product.deliveryCharge === 0 ? 'Free Delivery' : `₹${product.deliveryCharge} Delivery`}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -3 }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="font-bold text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6 flex items-center justify-center gap-2">
                <Package className="w-6 h-6" />
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                {product.description}
              </p>
            </motion.div>

            {/* Specifications & Policies Grid */}
            <motion.div
              variants={itemVariants}
              className="grid sm:grid-cols-2 gap-6"
            >
              {/* Specifications */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-3xl shadow-lg border border-blue-100 space-y-4 md:space-y-5 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                  📋 Specifications
                </h3>
                {product.weight && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <Weight className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>Weight:</strong> {product.weight}
                    </span>
                  </motion.div>
                )}
                {product.dimensions && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <Ruler className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>Dimensions:</strong> {product.dimensions}
                    </span>
                  </motion.div>
                )}
                {product.sku && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>SKU:</strong> {product.sku}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Policies */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-white p-6 md:p-8 rounded-3xl shadow-lg border border-green-100 space-y-4 md:space-y-5 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold text-center text-xl md:text-2xl text-gray-900 mb-4 md:mb-6">
                  🛡️ Policies
                </h3>
                {product.returnPolicyDays && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <RotateCcw className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>Return:</strong> {product.returnPolicyDays}-day return
                    </span>
                  </motion.div>
                )}
                {product.warranty && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>Warranty:</strong> {product.warranty}
                    </span>
                  </motion.div>
                )}
                {product.deliveryCharge !== null && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl"
                  >
                    <Truck className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-base md:text-lg">
                      <strong>Delivery:</strong> {product.deliveryCharge === 0 ? 'Free' : `₹${product.deliveryCharge}`}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Tags */}
            {displayTags && displayTags.length > 0 && (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-purple-50 to-white p-6 md:p-8 rounded-3xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-4 md:mb-6 text-center flex items-center justify-center gap-2">
                  <Tag className="w-6 h-6" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {displayTags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-3 rounded-full font-medium flex items-center gap-2 hover:from-purple-200 hover:to-pink-200 transition-all duration-200 shadow-sm hover:shadow-md text-sm md:text-base"
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
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 md:mb-8">
                <label className="font-bold text-xl md:text-2xl">
                  Quantity:
                </label>
                <div className="flex items-center border-2 border-gray-600 rounded-2xl overflow-hidden shadow-lg bg-gray-800">
                  <motion.button
                    whileHover={{ backgroundColor: "#4b5563", scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 sm:px-6 py-3 text-lg md:text-xl font-bold text-white transition-all duration-200"
                  >
                    -
                  </motion.button>
                  <span className="px-6 sm:px-8 py-3 border-x-2 border-gray-600 text-lg md:text-xl font-bold min-w-[60px] sm:min-w-[80px] text-center bg-gray-700">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ backgroundColor: "#4b5563", scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-4 sm:px-6 py-3 text-lg md:text-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: isInStock ? 1.05 : 1, y: isInStock ? -2 : 0 }}
                  whileTap={{ scale: isInStock ? 0.98 : 1 }}
                  disabled={!isInStock}
                  onClick={() => handleAddToCart()}
                  className={`flex-1 py-4 md:py-5 px-6 md:px-8 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                    isInStock
                      ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 md:p-5 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 md:p-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 md:w-7 md:h-7 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailView;