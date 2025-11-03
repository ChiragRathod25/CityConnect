import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Edit,
  Check,
  X,
  AlertCircle,
  Map,
  CheckCircle,
} from "lucide-react";
import MoveBackButton from "../ui/MoveBackButton";
import Modal from "../Modal";
import DeliveryMap from "../map/DeliveryMap";
import databaseService from "@/services/database.services";
import { useParams } from "react-router-dom";

const EditLocationComponent = ({
  currentLocation,
  onLocationUpdate,
  onCancel,
}) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    address: "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");
  const [isModified, setIsModified] = useState(false);

  // Initialize with current location
  useEffect(() => {
    if (currentLocation) {
      setEditedLocation({
        address: currentLocation.address || "",
        street: currentLocation.street || "",
        city: currentLocation.city || "",
        district: currentLocation.district || "",
        state: currentLocation.state || "",
        postalCode: currentLocation.postalCode || "",
        lat: currentLocation.lat ? currentLocation.lat.toString() : "",
        lng: currentLocation.lng ? currentLocation.lng.toString() : "",
      });
    }
  }, [currentLocation]);

  const handleMapLocationSelect = (coords) => {
    setEditedLocation((prev) => ({
      ...prev,
      lat: coords.lat.toFixed(6),
      lng: coords.lng.toFixed(6),
    }));
    setShowMapModal(false);
    setIsModified(true);
  };

  const handleInputChange = (field, value) => {
    setEditedLocation((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsModified(true);
    setError("");
  };

  const handleSaveLocation = () => {
    const { address, city, state, postalCode, lat, lng, street } =
      editedLocation;

    // Validate required fields
    if (!address || !city || !state || !postalCode) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate postal code
    if (postalCode.length !== 6) {
      setError("Postal code must be 6 digits");
      return;
    }

    // Parse coordinates if provided
    const parsedLat = lat ? parseFloat(lat) : 0;
    const parsedLng = lng ? parseFloat(lng) : 0;

    const updatedLocation = {
      lat: parsedLat,
      lng: parsedLng,
      address,
      street: street || "",
      city,
      district: editedLocation.district || city,
      state,
      postalCode,
      country: "India",
    };

    onLocationUpdate(updatedLocation);
    
    setIsModified(false);
    setError("");
  };

  return (
    <>
      {/* Modal for Map Selection */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Update Business Location on Map"
      >
        <DeliveryMap
          mode="business"
          onLocationSelect={handleMapLocationSelect}
          initialLocation={
            editedLocation.lat && editedLocation.lng
              ? {
                  lat: parseFloat(editedLocation.lat),
                  lng: parseFloat(editedLocation.lng),
                }
              : null
          }
        />
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Edit className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                Edit Business Location
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Update your business address and coordinates
              </p>
            </div>
          </div>

          {/* Map Selection Button */}
          <div className="mb-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMapModal(true)}
              className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
            >
              <Map size={20} />
              <span className="text-sm sm:text-base">
                Update Location on Map
              </span>
            </motion.button>
          </div>

          {/* Edit Form */}
          <div className="space-y-4 bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Complete Address *
                </label>
                <input
                  type="text"
                  placeholder="Enter full business address"
                  value={editedLocation.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Street/Area (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter street or area"
                  value={editedLocation.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={editedLocation.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  District (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter district"
                  value={editedLocation.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={editedLocation.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit postal code"
                  value={editedLocation.postalCode}
                  onChange={(e) =>
                    handleInputChange(
                      "postalCode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>Coordinates (Optional)</span>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit">
                    Use "Update Location on Map" button above
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={editedLocation.lat}
                    onChange={(e) => handleInputChange("lat", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={editedLocation.lng}
                    onChange={(e) => handleInputChange("lng", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Coordinates are optional. Select them on the map or leave
                  empty.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveLocation}
                disabled={!isModified}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors w-full sm:w-auto text-sm sm:text-base ${
                  isModified
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Check size={16} className="sm:w-4 sm:h-4" />
                <span>Save Changes</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                <X size={16} className="sm:w-4 sm:h-4" />
                <span>Cancel</span>
              </motion.button>
            </div>
          </div>

          {/* Current Location Display */}
          {currentLocation && !isModified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle
                  className="text-blue-500 flex-shrink-0"
                  size={18}
                />
                <span className="font-medium text-blue-800 text-sm sm:text-base">
                  Current Location
                </span>
              </div>
              <p className="text-sm text-blue-700 font-medium break-words">
                {currentLocation.address}
              </p>
              {currentLocation.street && (
                <p className="text-sm text-blue-600 mt-1 break-words">
                  {currentLocation.street}
                </p>
              )}
              {currentLocation.city && (
                <p className="text-sm text-blue-600 mt-1 break-words">
                  📍 {currentLocation.city}, {currentLocation.state} -{" "}
                  {currentLocation.postalCode}
                </p>
              )}
              {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
                <p className="text-xs text-blue-600 mt-1 font-mono break-all">
                  Coordinates: {currentLocation.lat}, {currentLocation.lng}
                </p>
              )}
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4"
            >
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Modified Indicator */}
          {isModified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4"
            >
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="text-sm font-medium">
                  You have unsaved changes
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Demo Implementation
const EditLocationAndAddress = ({ onBack }) => {
  const [currentLocation, setCurrentLocation] = useState({
    address: "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    lat: "",
    lng: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleLocationUpdate = async (updatedLocation) => {
    const updatedLocationResponce = await databaseService.updateBusinessLocationById(currentLocation._id, updatedLocation);

    console.log("updated location response",updatedLocationResponce?.data)

    setCurrentLocation(updatedLocationResponce.data);
    setIsEditing(false);
    alert("Location updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  const { businessId } = useParams();

  useEffect(() => {
    const fetchLocation = async () => {
      //fetch the current location from API
      const location = await databaseService.getBusinessLocation(businessId);
      console.log("Updated current location",location?.data)
      setCurrentLocation(location?.data);
    };
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50  px-4 pt-4 pb-20">
      <div className="relative z-10 pb-4 sm:pb-0">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={onBack} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-white animate-bounce" size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Edit Business Location
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Update your business address and location coordinates
          </p>
        </div>

        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Current Location
              </h2>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-700">
                  <strong>Address:</strong> {currentLocation.address}
                </p>
                <p className="text-gray-700">
                  <strong>Street:</strong> {currentLocation.street}
                </p>
                <p className="text-gray-700">
                  <strong>City:</strong> {currentLocation.city}
                </p>
                <p className="text-gray-700">
                  <strong>State:</strong> {currentLocation.state}
                </p>
                <p className="text-gray-700">
                  <strong>Postal Code:</strong> {currentLocation.postalCode}
                </p>
                <p className="text-gray-700 font-mono">
                  <strong>Coordinates:</strong> {currentLocation.lat},{" "}
                  {currentLocation.lng}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Edit size={20} />
              Edit Location
            </motion.button>
          </motion.div>
        ) : (
          <EditLocationComponent
            currentLocation={currentLocation}
            onLocationUpdate={handleLocationUpdate}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default EditLocationAndAddress;
