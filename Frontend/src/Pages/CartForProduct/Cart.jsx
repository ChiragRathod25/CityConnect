import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Shield,
  Star,
  MapPin,
  Store,
  Heart,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialCartItems = [
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
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    quantity: 2,
    inStock: true,
    weight: "250g",
    brand: "Artisan Coffee House",
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    quantity: 1,
    inStock: true,
    weight: "120g",
    brand: "CraftMaster",
  },
  {
    id: 3,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    rating: 4.9,
    reviewCount: 256,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    quantity: 1,
    inStock: true,
    weight: "300g",
    brand: "AudioTech",
  },
];

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const totalPrice = item.price * item.quantity;
  const originalTotal = item.originalPrice * item.quantity;
  const savings = originalTotal - totalPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: 0,
        scale: isRemoving ? 0.95 : 1,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
      style={{ borderColor: "#e2e8f0" }}
    >
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-full sm:w-32 md:w-40 h-32 md:h-40 rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Details */}
        <div className="flex-1 space-y-3 md:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="space-y-1">
              <h3
                className="text-lg md:text-xl mr-14 md:mr-0  font-bold leading-tight"
                style={{ color: "#1f2937" }}
              >
                {item.name}
              </h3>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#6b7280" }}
              >
                <Store className="w-4 h-4" />
                {item.category}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(item.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#374151" }}
                >
                  {item.rating} ({item.reviewCount})
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: "#fee2e2" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemove}
              className=" absolute  right-10 sm:relative sm:right-0 p-2 text-red-500  hover:text-red-500 rounded-xl transition-colors bg-gray-200 self-start"
            > 
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Price and Quantity */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: "#1f2937" }}
                >
                  ₹{totalPrice}
                </span>
                {item.discount > 0 && (
                  <span
                    className="text-lg line-through"
                    style={{ color: "#6b7280" }}
                  >
                    ₹{originalTotal}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  You save ₹{savings} ({item.discount}% off)
                </div>
              )}
              <div className="text-xs" style={{ color: "#6b7280" }}>
                Price per item: ₹{item.price}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ color: "#374151" }}
              >
                Qty:
              </span>
              <div
                className="flex items-center rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <motion.button
                  whileHover={{ backgroundColor: "#e2e8f0" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="p-3 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span
                  className="px-4 py-3 font-bold min-w-[50px] text-center"
                  style={{ color: "#1f2937" }}
                >
                  {item.quantity}
                </span>
                <motion.button
                  whileHover={{ backgroundColor: "#e2e8f0" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-3 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div
            className="flex flex-wrap gap-3 pt-2 border-t"
            style={{ borderColor: "#f8fafc" }}
          >
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: "#6b7280" }}
            >
              <Package className="w-3 h-3" />
              {item.weight}
            </div>
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: "#6b7280" }}
            >
              <MapPin className="w-3 h-3" />
              {item.distance}
            </div>
            <div className="text-xs text-green-600 font-medium">✓ In Stock</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OrderSummary = ({ items, onCheckout }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const originalTotal = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalSavings = originalTotal - subtotal;
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.12); // 12% tax
  const grandTotal = subtotal + deliveryCharge + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border sticky top-6"
      style={{ borderColor: "#e2e8f0" }}
    >
      <h3 className="text-2xl font-bold mb-6" style={{ color: "#1f2937" }}>
        Order Summary
      </h3>

      {/* Summary Lines */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span style={{ color: "#6b7280" }}>
            Subtotal ({items.length} items)
          </span>
          <span className="font-semibold" style={{ color: "#1f2937" }}>
            ₹{subtotal}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Total Savings</span>
            <span className="font-semibold">-₹{totalSavings}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span style={{ color: "#6b7280" }}>Delivery Charges</span>
          <span
            className={`font-semibold ${
              deliveryCharge === 0 ? "text-green-600" : ""
            }`}
            style={deliveryCharge !== 0 ? { color: "#1f2937" } : {}}
          >
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span style={{ color: "#6b7280" }}>Tax (12%)</span>
          <span className="font-semibold" style={{ color: "#1f2937" }}>
            ₹{tax}
          </span>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "#e2e8f0" }}>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold" style={{ color: "#1f2937" }}>
              Grand Total
            </span>
            <span className="text-2xl font-bold" style={{ color: "#1f2937" }}>
              ₹{grandTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <Truck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-semibold" style={{ color: "#1f2937" }}>
              Free Delivery
            </div>
            <div className="text-sm" style={{ color: "#6b7280" }}>
              On orders above ₹500
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold" style={{ color: "#1f2937" }}>
              Secure Payment
            </div>
            <div className="text-sm" style={{ color: "#6b7280" }}>
              100% secure transactions
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="w-full text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl"
          style={{ backgroundColor: "#1f2937" }}
        >
          <CreditCard className="w-6 h-6" />
          Proceed to Checkout
        </motion.button>
      </div>

      {/* Trust Indicators */}
      <div
        className="flex justify-center gap-6 mt-6 pt-6 border-t"
        style={{ borderColor: "#f8fafc" }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#1f2937" }}>
            100%
          </div>
          <div className="text-xs" style={{ color: "#6b7280" }}>
            Secure Payment
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#1f2937" }}>
            24/7
          </div>
          <div className="text-xs" style={{ color: "#6b7280" }}>
            Support
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#1f2937" }}>
            100%
          </div>
          <div className="text-xs" style={{ color: "#6b7280" }}>
            Authentic
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="text-center py-16 md:py-24"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
      className="mb-8"
    >
      <ShoppingCart
        className="w-24 h-24 md:w-32 md:h-32 mx-auto"
        style={{ color: "#d1d5db" }}
      />
    </motion.div>
    <h2
      className="text-2xl md:text-3xl font-bold mb-4"
      style={{ color: "#1f2937" }}
    >
      Your cart is empty
    </h2>
    <p className="mb-8 max-w-md mx-auto" style={{ color: "#6b7280" }}>
      Looks like you haven't added any items to your cart yet. Start shopping to
      fill it up!
    </p>
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
      style={{ backgroundColor: "#1f2937" }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#374151")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#1f2937")}
    >
      Continue Shopping
    </motion.button>
  </motion.div>
);

const ShoppingCartApp = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const navigate = useNavigate();
  const updateQuantity = (id, newQuantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    navigate('/delivery-address-form');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Header */}
      <motion.header
        variants={headerVariants}
        style={{ borderColor: "#e2e8f0" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 mb-8 md:mb-0"
            >
              <motion.button
                whileHover={{ scale: 1.02, x: -5 }}
                whileTap={{ scale: 0.98 }}
                className="flex text-sm sm:text-md items-center gap-3 font-medium bg-white px-4  py-3 sm:px-6 sm:py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border"
                style={{ color: "#6b7280", borderColor: "#e2e8f0" }}
                onMouseEnter={(e) => (e.target.style.color = "#1f2937")}
                onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </motion.button>
            </motion.div>
            <div className="flex justify-center items-center gap-6">
              <div className="space-y-1">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ color: "#1f2937" }}
                >
                  Shopping Cart
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-center font-medium"
                  style={{ color: "#6b7280" }}
                >
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div className="space-y-4 md:space-y-6" layout>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 mb-10 md:mb-0">
              <OrderSummary items={cartItems} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShoppingCartApp;
