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
import { ProductCard } from "./ProductCard";

const AllProductsByBusiness = () => {
  const { businessId } = useParams();
  const [productList, setProductList] = useState([]);
  const fetchProductsOfBusiness = async (businessId) => {
    try {
      const response = await databaseService.getProductsByBusinessId(
        businessId
      );
      console.log("Fetched products:", response.data);
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProductsOfBusiness(businessId);
  }, [businessId]);

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

export default AllProductsByBusiness;
