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
import ProductDetailView from "./ProductDetailView";
import { useNavigate } from "react-router-dom";

// Sample product data
export const sampleProducts = [
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

const ProductCardComponent = () => {
  const navigate = useNavigate();
  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
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

export default ProductCardComponent;
