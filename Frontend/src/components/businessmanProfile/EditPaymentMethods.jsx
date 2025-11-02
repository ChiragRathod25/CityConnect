import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  AlertCircle,
  Save,
  Check,
  ArrowLeft,
} from "lucide-react";
import MoveBackButton from "../ui/MoveBackButton";



const PaymentMethodTag = ({ icon: Icon, label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
        selected
          ? "border-gray-800 bg-gray-800 text-white shadow-xl scale-[1.02]"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-lg hover:scale-[1.02]"
      }`}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-[scale-in_0.3s_ease-out]">
          <Check size={16} className="text-white stroke-[3]" />
        </div>
      )}
      <div className={`p-3 rounded-xl transition-all ${selected ? "bg-gray-700" : "bg-gray-50 group-hover:bg-gray-100"}`}>
        <Icon size={32} className={selected ? "text-white" : "text-gray-700"} strokeWidth={1.5} />
      </div>
      <span
        className={`text-sm font-semibold tracking-wide ${
          selected ? "text-white" : "text-gray-800"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

const PaymentMethodsEditor = ({onBack}) => {
  const [selectedMethods, setSelectedMethods] = useState({
    cash: false,
    upi: false,
    cards: false,
    wallet: false,
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const paymentMethods = [
    { id: "cash", icon: Banknote, label: "Cash" },
    { id: "upi", icon: Smartphone, label: "UPI" },
    { id: "cards", icon: CreditCard, label: "Credit/Debit Cards" },
    { id: "wallet", icon: Wallet, label: "Digital Wallet" },
  ];

  const toggleMethod = (methodId) => {
    setSelectedMethods({
      ...selectedMethods,
      [methodId]: !selectedMethods[methodId],
    });
    setSaved(false);

    const newErrors = { ...errors };
    delete newErrors.paymentMethods;
    setErrors(newErrors);
  };

  const handleSave = () => {
    const hasSelectedMethod = Object.values(selectedMethods).some(
      (value) => value
    );

    if (!hasSelectedMethod) {
      setErrors({
        paymentMethods: "Please select at least one payment method",
      });
      return;
    }

    const selectedMethodsList = Object.keys(selectedMethods).filter(
      (key) => selectedMethods[key]
    );

    console.log("Saving payment methods:", selectedMethodsList);
    setErrors({});
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const selectedCount = Object.values(selectedMethods).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-8 px-4">
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }
      `}</style>
      
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <MoveBackButton onClick={onBack} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
              <CreditCard className="text-white animate-bounce" size={36} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Payment Methods
            </h1>
            <p className="text-gray-300 text-base max-w-md mx-auto">
              Select accepted payment methods for your business
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-10">
            {/* Payment Methods Section */}
            <div className="mb-8">
              <div className="mb-6 grid gap-4 sm:flex sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gray-800 rounded-full"></span>
                  Accepted Payment Methods
                  <span className="text-red-500">*</span>
                </h2>
                {selectedCount > 0 && (
                  <span className="bg-gray-800 w-fit text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md animate-fade-in-up">
                    {selectedCount} selected
                  </span>
                )}
              </div>

              {errors.paymentMethods && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-6 bg-red-50 p-4 rounded-xl border-2 border-red-200 animate-fade-in-up">
                  <AlertCircle size={18} />
                  <span className="font-medium">{errors.paymentMethods}</span>
                </div>
              )}

              {/* Payment Method Tags Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {paymentMethods.map((method) => (
                  <PaymentMethodTag
                    key={method.id}
                    icon={method.icon}
                    label={method.label}
                    selected={selectedMethods[method.id]}
                    onClick={() => toggleMethod(method.id)}
                  />
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  <span className="text-2xl mr-2">💡</span>
                  Select all payment methods you accept. Customers will see these options when booking or purchasing.
                </p>
              </div>
            </div>

            {/* Selected Methods Summary */}
            {selectedCount > 0 && (
              <div className="mb-8 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 animate-fade-in-up">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Selected Payment Methods
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(selectedMethods)
                    .filter(([_, selected]) => selected)
                    .map(([methodId]) => {
                      const method = paymentMethods.find(
                        (m) => m.id === methodId
                      );
                      const Icon = method.icon;
                      return (
                        <div
                          key={methodId}
                          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md"
                        >
                          <Icon size={16} />
                          {method.label}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-base tracking-wide hover:scale-[1.01]"
            >
              <Save size={22} strokeWidth={2} />
              Save Payment Methods
            </button>

            {/* Success Message */}
            {saved && (
              <div className="mt-5 bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-2xl text-center font-semibold shadow-md animate-fade-in-up">
                <Check size={20} className="inline mr-2" />
                Payment methods saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsEditor;