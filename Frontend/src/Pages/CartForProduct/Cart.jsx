import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import databaseService from "@/services/database.services";

// Transform API response to component format
const transformCartItem = (item) => ({
  id: item.productId._id,
  name: item.productId.name,
  category: item.productId.category,
  price: item.productId.price,
  originalPrice: item.productId.price,
  discount: 0,
  rating: 4.5,
  reviewCount: 0,
  distance: "1.0 km",
  image: item.productId.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  quantity: item.quantity,
  inStock: item.productId.stock > 0,
  weight: item.productId.weight,
  brand: item.productId.brand,
  deliveryCharge: item.productId.deliveryCharge,
  stock: item.productId.stock,
});

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
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Store className="w-3 h-3" />
                {item.category}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemove}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ₹{totalPrice}
              </span>
              {savings > 0 && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ₹{originalTotal}
                </span>
              )}
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg">
              <motion.button
                whileHover={{ backgroundColor: "#e5e7eb" }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                className="p-2 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </motion.button>
              <span className="px-3 font-semibold text-sm min-w-[30px] text-center">
                {item.quantity}
              </span>
              <motion.button
                whileHover={{ backgroundColor: "#e5e7eb" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OrderSummaryCard = ({ items, cartSummary }) => {
  const subtotal = cartSummary?.subtotal || items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const originalTotal = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalSavings = originalTotal - subtotal;
  const deliveryCharge = cartSummary?.deliveryCharge || (subtotal > 500 ? 0 : 50);
  const tax = cartSummary?.tax || Math.round(subtotal * 0.12);
  const grandTotal = cartSummary?.grandTotal || (subtotal + deliveryCharge + tax);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({items.length} items)
          </span>
          <span className="font-semibold text-gray-900">₹{subtotal}</span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Savings</span>
            <span className="font-semibold">-₹{totalSavings}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Charges</span>
          <span
            className={`font-semibold ${
              deliveryCharge === 0 ? "text-green-600" : "text-gray-900"
            }`}
          >
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (12%)</span>
          <span className="font-semibold text-gray-900">₹{tax}</span>
        </div>

        <div className="border-t pt-3 border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{grandTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getUserCartDetails = async () => {
    try {
      setIsLoading(true);
      const response = await databaseService.getUserCart();
      console.log("User cart data:", response);
      
      if (response.data?.items) {
        const transformedItems = response.data.items.map(transformCartItem);
        setCartItems(transformedItems);
        setCartSummary({
          subtotal: response.data.subtotal,
          deliveryCharge: response.data.deliveryCharge,
          tax: response.data.tax,
          grandTotal: response.data.grandTotal,
          itemCount: response.data.itemCount,
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await databaseService.updateCartItem(productId, quantity);
      await getUserCartDetails();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      await databaseService.removeItemFromCart(productId);
      await getUserCartDetails();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  useEffect(() => {
    getUserCartDetails();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    updateCartItem(id, newQuantity);
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    removeCartItem(id);
  };

  const handleCheckout = (cartItems, cartSummary) => {
    console.log("Proceeding to checkout with:", { cartItems, cartSummary });
    navigate('/delivery-address-form', { 
      state: { 
        cartItems, 
        cartSummary 
      } 
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-900" />
          </motion.div>
          <p className="text-lg font-medium text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <ShoppingCart className="w-32 h-32 mx-auto text-gray-300 mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
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
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummaryCard items={cartItems} cartSummary={cartSummary} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckout(cartItems, cartSummary)}
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;