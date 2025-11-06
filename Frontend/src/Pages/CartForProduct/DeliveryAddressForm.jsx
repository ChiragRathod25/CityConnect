import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  Shield,
  MapPin,
  Home,
  Building,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSummaryCard = ({ items, cartSummary, compact = false }) => {
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

      {!compact && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">
                Free Delivery
              </div>
              <div className="text-xs text-gray-600">
                On orders above ₹500
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">
                Secure Payment
              </div>
              <div className="text-xs text-gray-600">
                100% secure transactions
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DeliveryAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartSummary } = location.state || { cartItems: [], cartSummary: null };

  console.log('Cart Items:', cartItems);
  console.log('Cart Summary:', cartSummary);
  const [address, setAddress] = useState({
    addressType: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
    landmark: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment', { 
      state: { 
        address, 
        cartItems, 
        cartSummary 
      } 
    });
  };

  const handleBack = () => {
    navigate('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Address
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Step 2 of 3 - Where should we deliver?
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Address Type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "home", icon: Home, label: "Home" },
                      { value: "office", icon: Building, label: "Office" },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setAddress((prev) => ({ ...prev, addressType: value }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                          address.addressType === value
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fullAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Address
                  </label>
                  <textarea
                    id="fullAddress"
                    name="fullAddress"
                    value={address.fullAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    placeholder="House/Flat no., Building name, Street"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    placeholder="Nearby landmark"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                      placeholder="Mumbai"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    placeholder="400001"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummaryCard items={cartItems} cartSummary={cartSummary} compact />
              
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Delivery Information
                    </h4>
                    <p className="text-xs text-gray-600">
                      We deliver to most locations within 2-5 business days. 
                      Express delivery available for select areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryAddressPage;