import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import databaseService from "@/services/database.services";


// Product Card Component
export const ProductCard = ({ product, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle images - use product images or fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/400x300?text=No+Image'];

  // Calculate discount percentage if there's an original price
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Default values for missing fields
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  const isOpen = product.isOpen !== undefined ? product.isOpen : true;
  const inStock = product.stock > 0;
  const responseTime = product.responseTime || '24h';
  const distance = product.distance || 'N/A';

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 max-w-sm">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={productImages[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
          }}
        />

        {/* Image Navigation */}
        {productImages.length > 1 && (
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
              {productImages.map((_, index) => (
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
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-lg text-xs font-bold">
            Out of Stock
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
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
          <div className="text-right ml-2">
            <div className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Category and Brand */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{product.category}</span>
          </div>
          {product.brand && (
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{product.brand}</span>
            </div>
          )}
        </div>

        {/* Rating and Reviews (if available) */}
        {(rating > 0 || reviewCount > 0) && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {rating.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
              </span>
            </div>
            {distance !== 'N/A' && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                {distance}
              </div>
            )}
          </div>
        )}

        {/* Status and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isOpen ? "Available" : "Closed"}
            </div>
            {inStock && (
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                In Stock ({product.stock})
              </div>
            )}
            {product.deliveryCharge !== null && product.deliveryCharge !== undefined && (
              <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                ₹{product.deliveryCharge} delivery
              </div>
            )}
          </div>
          {responseTime && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {responseTime}
            </div>
          )}
        </div>

        {/* Warranty and Return Policy */}
        {(product.warranty || product.returnPolicyDays) && (
          <div className="text-xs text-gray-500 mb-3 flex gap-3">
            {product.warranty && (
              <span>⚡ Warranty: {product.warranty}</span>
            )}
            {product.returnPolicyDays && (
              <span>🔄 {product.returnPolicyDays}-day return</span>
            )}
          </div>
        )}

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
}


const ProductCardComponent = () => {
  const navigate = useNavigate();
  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };
  const [productList, setProductList] = useState([]);
  const fetchAllProducts = async () => {
    
    try {
      // Fetch all products from your API or database
      const response = await databaseService.getAllProducts();
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(()=>{
    fetchAllProducts();
  },[])

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {productList.map((product) => (
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

export default ProductCardComponent;
