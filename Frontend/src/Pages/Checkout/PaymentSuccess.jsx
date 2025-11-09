import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  ShoppingBag,
  Home,
  Building,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, orderDetails } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { address, cartItems = [], paymentMethod, grandTotal } = orderDetails || {};

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
    }
    setIsVisible(true);
  }, [orderDetails, navigate]);

  const generateInvoicePDF = () => {
    setIsDownloading(true);
    
    // Create invoice content
    const invoiceWindow = window.open("", "_blank");
    
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
      0
    );
    const totalSavings = originalTotal - subtotal;
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.12);
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - CityConnect</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; background: #fff; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #1f2937; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 32px; font-weight: bold; color: #1f2937; }
          .invoice-title { font-size: 24px; color: #6b7280; margin-top: 10px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-block { flex: 1; }
          .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
          .info-value { font-size: 14px; color: #1f2937; line-height: 1.6; }
          .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .items-table th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; }
          .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; }
          .summary-section { margin-left: auto; width: 300px; margin-top: 20px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .summary-row.total { border-top: 2px solid #1f2937; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">CityConnect</div>
            <div class="invoice-title">Order Invoice</div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Order Date</div>
              <div class="info-value">${new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
            
            <div class="info-block">
              <div class="info-label">Payment Method</div>
              <div class="info-value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}</div>
              ${paymentId ? `<div class="info-value" style="font-size: 12px; color: #6b7280;">ID: ${paymentId}</div>` : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Delivery Address</div>
              <div class="info-value">
                ${address?.fullAddress || ''}<br>
                ${address?.landmark ? `Landmark: ${address.landmark}<br>` : ''}
                ${address?.city || ''}, ${address?.state || ''} - ${address?.pincode || ''}
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary-section">
            <div class="summary-row">
              <span>Subtotal (${cartItems.length} items)</span>
              <span>₹${subtotal}</span>
            </div>
            ${totalSavings > 0 ? `
              <div class="summary-row" style="color: #10b981;">
                <span>Total Savings</span>
                <span>-₹${totalSavings}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span>Delivery Charges</span>
              <span>${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>
            <div class="summary-row">
              <span>Tax (12%)</span>
              <span>₹${tax}</span>
            </div>
            <div class="summary-row total">
              <span>Total Amount</span>
              <span>₹${grandTotal}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with CityConnect!</p>
            <p>For any queries, please contact our customer support.</p>
          </div>
        </div>
        
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
      </html>
    `;
    
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const calculateSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
      0
    );
    const totalSavings = originalTotal - subtotal;
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.12);
    
    return { subtotal, totalSavings, deliveryCharge, tax };
  };

  const summary = calculateSummary();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Payment Info */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Amount Paid</p>
                <p className="text-3xl font-bold">₹{grandTotal}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm mb-1">Payment Method</p>
                <p className="text-lg font-semibold">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                {paymentId && (
                  <p className="text-xs text-green-100 mt-1">ID: {paymentId}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Delivery Address */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
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

            {/* Order Items */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Order Items ({cartItems.length})
                </h3>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Payment Summary</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{summary.subtotal}</span>
                </div>
                {summary.totalSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Savings</span>
                    <span className="font-semibold">-₹{summary.totalSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className={`font-semibold ${summary.deliveryCharge === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {summary.deliveryCharge === 0 ? "FREE" : `₹${summary.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (12%)</span>
                  <span className="font-semibold text-gray-900">₹{summary.tax}</span>
                </div>
                <div className="border-t pt-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    Estimated Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered within 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={generateInvoicePDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 rounded-xl font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? "Generating..." : "Download Invoice"}
          </button>

          <button
            onClick={() => navigate("/history")}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            View All Orders
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;