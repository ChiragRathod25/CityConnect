import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Ruler,
  Weight,
  RotateCcw,
  Award,
  Tag,
  Store,
} from "lucide-react";

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Artisan Coffee House Blend",
    category: "Café & Restaurant",
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.8,
    reviewCount: 124,
    distance: "0.5 km",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
    ],
    isOpen: true,
    responseTime: "< 1 hour",
    inStock: true,
    description:
      "Premium blend of Ethiopian and Colombian beans, roasted to perfection. Rich, smooth taste with hints of chocolate and caramel.",
    weight: "250g",
    dimensions: "15x10x5 cm",
    returnPeriod: "7 days",
    returnPolicy: "Easy returns within 7 days of delivery",
    warranty: "30 days",
    sku: "COFFEE-001",
    brand: "Artisan Coffee House",
    tags: ["organic", "fair-trade", "premium", "arabica"],
    reviews: [
      {
        reviewer: {
          name: "John D.",
          photo:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        rating: 5,
        description:
          "Excellent coffee with rich flavor! The Ethiopian blend is absolutely perfect. I've been ordering this for months and it never disappoints. Highly recommend for coffee enthusiasts.",
        date: "2024-01-15T10:30:00Z",
        images: [
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200",
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200",
        ],
      },
      {
        reviewer: {
          name: "Sarah M.",
          photo:
            "https://images.unsplash.com/photo-1494790108755-2616b612b602?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4,
        description:
          "Good quality coffee with prompt delivery. The packaging was excellent and the aroma is amazing. Perfect for morning coffee rituals.",
        date: "2024-01-10T14:45:00Z",
        images: [],
      },
      {
        reviewer: {
          name: "Mike R.",
          photo:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        rating: 5,
        description:
          "Best coffee I've had in years! The blend is perfect, not too strong but full of flavor. Will definitely order again.",
        date: "2024-01-08T09:15:00Z",
        images: [
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Handcrafted Leather Wallet",
    category: "Fashion & Accessories",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.6,
    reviewCount: 89,
    distance: "1.2 km",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    ],
    isOpen: false,
    responseTime: "2-3 hours",
    inStock: true,
    description:
      "Genuine leather wallet with multiple card slots and coin pocket. Handcrafted by local artisans.",
    weight: "120g",
    dimensions: "11x8x2 cm",
    returnPeriod: "15 days",
    returnPolicy: "Full refund if not satisfied",
    warranty: "1 year craftsmanship warranty",
    sku: "WALLET-LTR-001",
    brand: "CraftMaster",
    tags: ["leather", "handmade", "premium", "durable"],
    reviews: [
      {
        reviewer: {
          name: "Alex P.",
          photo:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        },
        rating: 5,
        description:
          "Outstanding craftsmanship! The leather quality is exceptional and the stitching is perfect. Worth every penny.",
        date: "2024-01-12T16:20:00Z",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
        ],
      },
      {
        reviewer: {
          name: "Emma L.",
          photo:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4,
        description:
          "Beautiful wallet with great attention to detail. Fits perfectly in my pocket and has plenty of card slots.",
        date: "2024-01-05T11:30:00Z",
        images: [],
      },
    ],
  },
];

// Product Card Component
const ProductCard = ({ product, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 max-w-sm">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {product.discount}% OFF
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`p-2 rounded-full transition-colors ${
              isSaved
                ? "bg-blue-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full transition-colors ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <div className="text-right ml-2">
            <div className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-1 mb-3">
          <Store className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {product.distance}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isOpen ? "Open Now" : "Closed"}
            </div>
            {product.inStock && (
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                In Stock
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.responseTime}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};




// Product Detail View Component
// const ProductDetailView = ({ product, onBack }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentReview, setCurrentReview] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${
//           i < Math.floor(rating)
//             ? 'text-yellow-400 fill-current'
//             : 'text-gray-300'
//         }`}
//       />
//     ));
//   };

//   const nextReview = () => {
//     setCurrentReview((prev) =>
//       prev === product.reviews.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevReview = () => {
//     setCurrentReview((prev) =>
//       prev === 0 ? product.reviews.length - 1 : prev - 1
//     );
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="min-h-screen bg-gray-50"
//     >
//       {/* Header */}
//       <motion.div
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white shadow-sm border-b border-gray-200"
//       >
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <motion.button
//             whileHover={{ x: -5, scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={onBack}
//             className="flex items-center gap-3 text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 bg-gray-100 px-6 py-3 rounded-xl"
//           >
//             <ChevronLeft className="w-6 h-6" />
//             <span className="text-lg">Back to Products</span>
//           </motion.button>
//         </div>
//       </motion.div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Image Gallery */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="space-y-6"
//           >
//             <div className="relative h-96 lg:h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
//               <motion.img
//                 key={currentImageIndex}
//                 initial={{ opacity: 0, scale: 1.1 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//                 src={product.images[currentImageIndex]}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//               {product.discount > 0 && (
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.5, type: "spring" }}
//                   className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg"
//                 >
//                   {product.discount}% OFF
//                 </motion.div>
//               )}
//             </div>

//             {/* Image Thumbnails */}
//             {product.images.length > 1 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//                 className="flex gap-4 overflow-x-auto pb-2"
//               >
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
//                       index === currentImageIndex
//                         ? 'border-gray-800 shadow-lg'
//                         : 'border-gray-200 hover:border-gray-400'
//                     }`}
//                   >
//                     <img src={image} alt="" className="w-full h-full object-cover" />
//                   </motion.button>
//                 ))}
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Product Info */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="space-y-8"
//           >
//             <div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//                 className="flex items-start justify-between mb-4"
//               >
//                 <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//                   {product.name}
//                 </h1>
//                 <div className="text-right ml-4">
//                   <div className="text-3xl lg:text-4xl font-bold text-gray-900">₹{product.price}</div>
//                   {product.originalPrice > product.price && (
//                     <div className="text-xl text-gray-500 line-through">
//                       ₹{product.originalPrice}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//                 className="flex items-center gap-6 mb-6"
//               >
//                 <span className="text-xl text-gray-600 flex items-center gap-2">
//                   <Store className="w-5 h-5" />
//                   {product.category}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-1">
//                     {renderStars(product.rating)}
//                   </div>
//                   <span className="font-bold text-lg text-gray-900">{product.rating}</span>
//                   <span className="text-gray-500">({product.reviewCount} reviews)</span>
//                 </div>
//               </motion.div>

//               {/* Status Badges */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6, duration: 0.5 }}
//                 className="flex flex-wrap gap-3 mb-6"
//               >
//                 <span className={`px-4 py-2 rounded-full text-sm font-bold ${
//                   product.isOpen
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-red-100 text-red-700'
//                 }`}>
//                   {product.isOpen ? '🟢 Open Now' : '🔴 Closed'}
//                 </span>
//                 {product.inStock && (
//                   <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
//                     📦 In Stock
//                   </span>
//                 )}
//                 <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
//                   <MapPin className="w-4 h-4" />
//                   {product.distance}
//                 </span>
//               </motion.div>
//             </div>

//             {/* Description */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7, duration: 0.5 }}
//               className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200"
//             >
//               <h3 className="font-bold text-xl text-gray-900 mb-4">Description</h3>
//               <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
//             </motion.div>

//             {/* Specifications */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8, duration: 0.5 }}
//               className="grid md:grid-cols-2 gap-6"
//             >
//               <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 space-y-4">
//                 <h3 className="font-bold text-xl text-gray-900 mb-4">Specifications</h3>
//                 {product.weight && (
//                   <div className="flex items-center gap-3">
//                     <Weight className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>Weight:</strong> {product.weight}</span>
//                   </div>
//                 )}
//                 {product.dimensions && (
//                   <div className="flex items-center gap-3">
//                     <Ruler className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>Dimensions:</strong> {product.dimensions}</span>
//                   </div>
//                 )}
//                 {product.brand && (
//                   <div className="flex items-center gap-3">
//                     <Award className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>Brand:</strong> {product.brand}</span>
//                   </div>
//                 )}
//                 {product.sku && (
//                   <div className="flex items-center gap-3">
//                     <Package className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>SKU:</strong> {product.sku}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 space-y-4">
//                 <h3 className="font-bold text-xl text-gray-900 mb-4">Policies</h3>
//                 {product.returnPeriod && (
//                   <div className="flex items-center gap-3">
//                     <RotateCcw className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>Return:</strong> {product.returnPeriod}</span>
//                   </div>
//                 )}
//                 {product.warranty && (
//                   <div className="flex items-center gap-3">
//                     <Shield className="w-5 h-5 text-gray-400" />
//                     <span className="text-gray-600"><strong>Warranty:</strong> {product.warranty}</span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-3">
//                   <Truck className="w-5 h-5 text-gray-400" />
//                   <span className="text-gray-600"><strong>Delivery:</strong> Free delivery</span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Tags */}
//             {product.tags && product.tags.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.9, duration: 0.5 }}
//                 className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200"
//               >
//                 <h3 className="font-bold text-xl text-gray-900 mb-4">Tags</h3>
//                 <div className="flex flex-wrap gap-3">
//                   {product.tags.map((tag, index) => (
//                     <motion.span
//                       key={index}
//                       initial={{ opacity: 0, scale: 0 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: 1 + index * 0.1 }}
//                       className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
//                     >
//                       <Tag className="w-4 h-4" />
//                       {tag}
//                     </motion.span>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             {/* Purchase Actions */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.1, duration: 0.5 }}
//               className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200"
//             >
//               <div className="flex items-center gap-6 mb-6">
//                 <label className="font-bold text-xl text-gray-700">Quantity:</label>
//                 <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
//                   <motion.button
//                     whileHover={{ backgroundColor: "#f3f4f6" }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors"
//                   >
//                     -
//                   </motion.button>
//                   <span className="px-6 py-3 border-x-2 border-gray-200 text-lg font-bold min-w-[60px] text-center">
//                     {quantity}
//                   </span>
//                   <motion.button
//                     whileHover={{ backgroundColor: "#f3f4f6" }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors"
//                   >
//                     +
//                   </motion.button>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   disabled={!product.isOpen || !product.inStock}
//                   className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
//                     product.isOpen && product.inStock
//                       ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   <ShoppingCart className="w-6 h-6" />
//                   {product.isOpen
//                     ? (product.inStock ? 'Add to Cart' : 'Out of Stock')
//                     : 'Store Closed'
//                   }
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
//                 >
//                   <MessageCircle className="w-7 h-7" />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
//                 >
//                   <Heart className="w-7 h-7" />
//                 </motion.button>
//               </div>
//             </motion.div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Reviews Section - Using your exact code structure */}
//         {product.reviews && product.reviews.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.3, duration: 0.5 }}
//             className="mt-16"
//           >
//             <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
//               <h3
//                 className="text-2xl mb-4  font-bold"
//                 style={{ color: "#1f2937" }}
//               >
//                 Customer Reviews
//               </h3>
//               <div className="flex items-center space-x-3 sm:space-x-6">
//                 <span
//                   className="text-md sm:text-xl font-medium"
//                   style={{ color: "#6b7280" }}
//                 >
//                   {currentReview + 1} of {product.reviews.length}
//                 </span>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={prevReview}
//                     disabled={product.reviews.length <= 1}
//                     className="p-2 sm:p-3 cursor-pointer rounded-xl hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     style={{
//                       backgroundColor: "#e2e8f0",
//                       color: "#374151",
//                     }}
//                   >
//                     <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5" />
//                   </button>
//                   <button
//                     onClick={nextReview}
//                     disabled={product.reviews.length <= 1}
//                     className="p-2 sm:p-3 rounded-xl cursor-pointer hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     style={{
//                       backgroundColor: "#e2e8f0",
//                       color: "#374151",
//                     }}
//                   >
//                     <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="relative overflow-hidden">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentReview}
//                   initial={{ opacity: 0, x: 300 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -300 }}
//                   transition={{ duration: 0.5, ease: "easeInOut" }}
//                   className="rounded-2xl p-4 sm:p-8 shadow-xl border-2"
//                   style={{
//                     borderColor: "#e2e8f0",
//                     backgroundColor: "#ffffff",
//                   }}
//                 >
//                   <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
//                     <img
//                       src={product.reviews[currentReview].reviewer.photo}
//                       alt={product.reviews[currentReview].reviewer.name}
//                       className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover flex-shrink-0 ring-4 ring-white shadow-lg"
//                     />
//                     <div className="flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
//                         <div>
//                           <h5
//                             className="text-lg sm:text-xl font-bold mb-1 sm:mb-2"
//                             style={{ color: "#1f2937" }}
//                           >
//                             {product.reviews[currentReview].reviewer.name}
//                           </h5>
//                           <div className="flex items-center space-x-2 sm:space-x-3">
//                             <div className="flex items-center space-x-1">
//                               {renderStars(product.reviews[currentReview].rating)}
//                             </div>
//                             <span
//                               className="text-base sm:text-lg font-bold"
//                               style={{ color: "#1f2937" }}
//                             >
//                               {product.reviews[currentReview].rating}.0
//                             </span>
//                           </div>
//                         </div>
//                         <span
//                           className="text-xs sm:text-sm mt-2 sm:mt-0"
//                           style={{ color: "#6b7280" }}
//                         >
//                           {new Date(
//                             product.reviews[currentReview].date
//                           ).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>

//                       <p
//                         className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6"
//                         style={{ color: "#6b7280" }}
//                       >
//                         {product.reviews[currentReview].description}
//                       </p>

//                       {product.reviews[currentReview].images &&
//                         product.reviews[currentReview].images.length > 0 && (
//                           <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
//                             {product.reviews[currentReview].images.map(
//                               (image, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
//                                 >
//                                   <img
//                                     src={image}
//                                     alt={`Review image ${index + 1}`}
//                                     className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover"
//                                   />
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         )}
//                     </div>
//                   </div>

//                   {/* Review Pagination Dots - Optimized for Mobile */}
//                   <div className="flex justify-center mt-4 sm:mt-8 space-x-2 sm:space-x-2">
//                     {product.reviews.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setCurrentReview(index)}
//                         className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
//                           index === currentReview
//                             ? "scale-125"
//                             : "hover:scale-110"
//                         }`}
//                         style={{
//                           backgroundColor:
//                             index === currentReview
//                               ? "#1f2937"
//                               : "#d1d5db",
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}
//       {/* </div> */}
//     </motion.div>
//   );
// };



const ProductDetailView = ({ product, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
            onClick={onBack}
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

// Main App Component
const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return <ProductDetailView product={selectedProduct} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
