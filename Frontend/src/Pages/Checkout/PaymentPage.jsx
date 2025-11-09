import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Package,
  Shield,
  CheckCircle,
  Edit2,
  Home,
  Building,
  Loader2,
  Lock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import databaseService from "@/services/database.services";

const OrderSummaryCard = ({ items, cartSummary, compact = false }) => {
  const subtotal =
    cartSummary?.subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalSavings = originalTotal - subtotal;
  const deliveryCharge =
    cartSummary?.deliveryCharge || (subtotal > 500 ? 0 : 50);
  const tax = cartSummary?.tax || Math.round(subtotal * 0.12);
  const grandTotal = cartSummary?.grandTotal || subtotal + deliveryCharge + tax;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
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

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, cartItems, cartSummary } = location.state || {
    address: null,
    cartItems: [],
    cartSummary: null,
  };

  useEffect(() => {
    console.log("PaymentPage loaded with:", {
      address,
      cartItems,
      cartSummary,
    });
  }, [address, cartItems, cartSummary]);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const subtotal =
    cartSummary?.subtotal ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge =
    cartSummary?.deliveryCharge || (subtotal > 500 ? 0 : 50);
  const tax = cartSummary?.tax || Math.round(subtotal * 0.12);
  const grandTotal = cartSummary?.grandTotal || subtotal + deliveryCharge + tax;

  const handlePayment = async () => {
    setIsLoading(true);
    //     items,
    // subtotal,
    // deliveryCharge,
    // tax,
    // discount,
    // totalAmount,
    // deliveryAddress,
    // paymentMethod

    //  "Credit Card",
    //     "Debit Card",
    //     "UPI",
    //     "Cash on Delivery",
    //     "Net Banking",

    console.log("Cart Items:", cartItems);

    //rename id of cartItems to productId for backend
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      productId: item.id,
    }));
    console.log("Updated Cart Items for Order:", updatedCartItems);
    const orderData = {
      items: updatedCartItems,
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      tax: tax,
      discount: 0,
      totalAmount: grandTotal,
      deliveryAddress: address,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay",
    };

    try {
      if (paymentMethod === "cod") {
        // Handle Cash on Delivery
        console.log("Processing COD order...");
        // Call your API to create order with COD
        const response = await databaseService.createOrder(orderData);
        console.log("Order created successfully:", response);

        // Clear cart after successful order creation
        await databaseService.clearCart();

        setTimeout(() => {
          setIsLoading(false);
          navigate("/payment-success", {
            state: {
              orderDetails: {
                address,
                cartItems,
                paymentMethod: "cod",
                grandTotal,
              },
            },
          });
        }, 1500);
      } else {
        // Handle Razorpay Payment
        const notes = {
          address: JSON.stringify(address),
          itemCount: cartItems.length,
          amount: grandTotal,
        };

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
          amount: grandTotal * 100, // Amount in paise
          currency: "INR",
          name: "CityConnect",
          description: "Order Payment",
          image: "https://your-logo-url.com/logo.png", // Your logo URL
          handler: async function (response) {
            try {
              console.log("Payment successful:", response);
              // Verify payment on backend
              // await databaseService.verifyPayment({
              //   razorpay_order_id: response.razorpay_order_id,
              //   razorpay_payment_id: response.razorpay_payment_id,
              //   razorpay_signature: response.razorpay_signature,
              //   address,
              //   cartItems,
              // });
              const fetchResponse = await databaseService.createOrder({
                ...orderData,
                transactionId: response.razorpay_payment_id,
              });
              console.log("Order created successfully:", fetchResponse);

              // Clear cart after successful order creation
              await databaseService.clearCart();

              setIsLoading(false);
              navigate("/payment-success", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderDetails: {
                    address,
                    cartItems,
                    paymentMethod: "razorpay",
                    grandTotal,
                  },
                },
              });
            } catch (error) {
              console.error("Payment verification failed:", error);
              setIsLoading(false);
              navigate("/payment-failed");
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          notes: notes,
          theme: {
            color: "#1f2937",
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setIsLoading(false);
      alert("Payment failed. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1, {
      state: {
        cartItems,
        cartSummary,
      },
    });
  };

  const handleEditAddress = () => {
    navigate("/delivery-address", {
      state: {
        cartItems,
        cartSummary,
        existingAddress: address,
      },
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
              <p className="text-sm text-gray-600 mt-1">
                Step 3 of 3 - Complete your order
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Delivery Address
                    </h3>
                    <p className="text-sm text-gray-600">Confirmed</p>
                  </div>
                </div>
                <button
                  onClick={handleEditAddress}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="p-1.5 bg-white rounded">
                    {address?.addressType === "home" ? (
                      <Home className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Building className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {address?.addressType || "Home"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address?.fullAddress}
                    </p>
                    {address?.landmark && (
                      <p className="text-sm text-gray-600">
                        Landmark: {address.landmark}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {address?.city}, {address?.state} - {address?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Items ({cartItems.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">
                      Card / UPI / Netbanking
                    </div>
                    <div className="text-sm text-gray-600">
                      Secure payment via Razorpay
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "razorpay"
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "razorpay" && (
                      <div className="w-3 h-3 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">
                      Cash on Delivery
                    </div>
                    <div className="text-sm text-gray-600">
                      Pay when you receive
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-3 h-3 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummaryCard
                items={cartItems}
                cartSummary={cartSummary}
                compact
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {paymentMethod === "cod"
                      ? "Place Order"
                      : `Pay ₹${grandTotal}`}
                  </>
                )}
              </motion.button>

              <div className="mt-4 bg-green-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Secure Payment
                    </h4>
                    <p className="text-xs text-gray-600">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  SSL Secure
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  PCI Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
