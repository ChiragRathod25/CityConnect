import MoveBackButton from "@/components/ui/MoveBackButton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryAddressForm() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Address submitted:", address);

    navigate("/payment");
  };

  const handleBack = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="relative pt-2 z-10 bg-gray-50">
        <div className="relative  sm:mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={handleBack} />
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 pb-10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border-2 border-gray-200 py-8 px-4 sm:px-8">
          <h2 className="text-2xl text-center font-semibold text-gray-900 mb-6">
            Delivery Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={address.street}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
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
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                placeholder="400001"
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />
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
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition resize-none"
                placeholder="Complete address with landmarks"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
            >
              Save Address
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
