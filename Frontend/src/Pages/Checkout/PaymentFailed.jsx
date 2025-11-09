import React, { useEffect, useState } from "react";
import {
  XCircle,
  RefreshCcw,
  Home,
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  const { errorMessage, orderDetails } = location.state || {
    errorMessage: "Payment could not be processed",
    orderDetails: null,
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRetryPayment = () => {
    if (orderDetails) {
      navigate("/payment", {
        state: {
          address: orderDetails.address,
          cartItems: orderDetails.cartItems,
          cartSummary: orderDetails.cartSummary,
        },
      });
    } else {
      navigate("/cart");
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const commonReasons = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      title: "Insufficient Balance",
      description: "Your account may not have enough funds",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      title: "Card Declined",
      description: "Your card issuer may have declined the transaction",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      title: "Network Issue",
      description: "Connection problem during payment processing",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      title: "Incorrect Details",
      description: "Payment information may have been entered incorrectly",
    },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Failed Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't process your payment. Please try again or use a different payment method.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="bg-red-50 border-b border-red-100 p-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Transaction Failed
                </h3>
                <p className="text-sm text-gray-600">
                  {errorMessage || "Your payment could not be completed at this time"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Common Reasons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                Common Reasons for Payment Failure
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {commonReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 rounded-lg p-4 border border-orange-100"
                  >
                    <div className="flex items-start gap-3">
                      {reason.icon}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {reason.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">
                What you can do:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Check your account balance and card details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Try a different payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Contact your bank if the issue persists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use Cash on Delivery option instead</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleRetryPayment}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry Payment
          </button>

          <button
            onClick={handleGoToCart}
            className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 rounded-xl font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you're experiencing issues with payment, our customer support team is here to help.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="tel:+911234567890"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Call Us</div>
                <div className="text-xs text-gray-600">+91 123-456-7890</div>
              </div>
            </a>

            <a
              href="mailto:support@cityconnect.com"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email Us</div>
                <div className="text-xs text-gray-600">support@cityconnect.com</div>
              </div>
            </a>
          </div>
        </div>

        {/* Go to Home */}
        <div className="text-center mt-8">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>
        </div>

        {/* Important Note */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong className="text-gray-900">Important:</strong> Your order has not been placed. 
            No amount has been deducted from your account. If you see a deduction, 
            it will be automatically refunded within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;