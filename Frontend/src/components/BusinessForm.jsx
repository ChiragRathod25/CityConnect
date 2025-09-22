import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  MapPin,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Phone,
  Mail,
  FileText,
  Clock,
  Shield,
  CheckCircle,
  Loader,
  Store,
  Sparkles,
  ChevronDown,
  Calendar,
  Award,
  Heart,
  Target,
  Map as MapIcon,
  AlertCircle,
  Check,
  X,
  Send,
  Truck,
  ArrowRight,
  Users,
  Zap,
  CreditCard,
  Locate,
  Info,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import Modal from "./Modal.jsx"

// Enhanced color palette
const colors = {
  primary: "#000000",
  primaryHover: "#1f2937",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  lightBG: "#f8fafc",
  cardBG: "#ffffff",
  borderLight: "#e5e7eb",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
};

// Floating Animation Components
const FloatingElement = ({ size = 80, delay = 0, children, ...props }) => (
  <motion.div
    className="absolute opacity-20 pointer-events-none"
    animate={{
      y: [-20, 20, -20],
      x: [-15, 15, -15],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: Math.random() * 3 + 4,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
    {...props}
  >
    {children}
  </motion.div>
);

const MovingDots = ({ count = 50 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gray-400/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: Math.random() * 10 + 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Enhanced Form Components
const FormInput = ({ label, icon: Icon, error, className = "", ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    <div className="relative">
      <input
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs mt-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  </div>
);

const FormSelect = ({
  label,
  icon: Icon,
  options = [],
  error,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.value === props.value) || null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({ target: { value: option.value } });
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 text-left flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-200"
          } ${className}`}
        >
          <span
            className={
              selectedOption?.value ? "text-gray-900" : "text-gray-500"
            }
          >
            {selectedOption?.label || "Select an option"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto"
            >
              {options
                .filter((opt) => opt.value !== "")
                .map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{
                      backgroundColor: "#f3f4f6",
                      x: 8,
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(option)}
                  >
                    <span className="group-hover:font-semibold transition-all">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export const TimeSelect = ({ label, icon: Icon, error, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(props.value || "");
  const dropdownRef = useRef(null);

  // Generate time options every 30 minutes
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = new Date(
        `2000-01-01T${timeValue}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: timeValue, label: displayTime });
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (timeOption) => {
    setSelectedTime(timeOption.value);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({ target: { value: timeOption.value } });
    }
  };

  const selectedOption = timeOptions.find((opt) => opt.value === selectedTime);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 text-left flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption?.label || "Select time"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto"
            >
              {timeOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{
                    backgroundColor: "#f3f4f6",
                    x: 8,
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(option)}
                >
                  <span className="group-hover:font-semibold transition-all">
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-xs"
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  );
};

const ToggleSwitch = ({ label, description, checked, onChange, error }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Truck size={16} className="text-gray-600" />
          {label}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <motion.span
          animate={{
            x: checked ? 22 : 2,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
        />
      </motion.button>
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-red-500 text-xs"
      >
        <AlertCircle size={12} />
        {error}
      </motion.div>
    )}
  </div>
);

import { Map } from "lucide-react";
import DeliveryMap from "./map/DeliveryMap.jsx";
const MapComponent = ({ onLocationSelect, selectedLocation, error }) => {
  const [mapError, setMapError] = useState("");
  const [manualLocation, setManualLocation] = useState({
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [showManualInput, setShowManualInput] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);

  // Load Google Maps Script
  useEffect(() => {
    if (showMap && !window.google) {
      loadGoogleMapsScript();
    } else if (showMap && window.google) {
      initializeMap();
    }
  }, [showMap]);

  const loadGoogleMapsScript = () => {
    const script = document.createElement("script");
    script.src = ``;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsMapLoaded(true);
      initializeMap();
    };
    script.onerror = () => {
      setMapError(
        "Failed to load Google Maps. Using alternative map interface."
      );
      setIsMapLoaded(true);
      initializeFallbackMap();
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Default to Vadodara, Gujarat
    const defaultCenter = { lat: 22.3039, lng: 73.1812 };

    try {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Add click listener
      googleMapRef.current.addListener("click", handleMapClick);

      // Get current location
      getCurrentLocation();
    } catch (error) {
      console.error("Google Maps initialization failed:", error);
      initializeFallbackMap();
    }
  };

  const initializeFallbackMap = () => {
    // Fallback to custom map interface
    setIsMapLoaded(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(pos);

          if (googleMapRef.current) {
            // Center map on current location
            googleMapRef.current.setCenter(pos);

            // Add current location marker
            if (currentLocationMarkerRef.current) {
              currentLocationMarkerRef.current.setMap(null);
            }

            currentLocationMarkerRef.current = new window.google.maps.Marker({
              position: pos,
              map: googleMapRef.current,
              title: "Your Current Location",
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });
          }

          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
        }
      );
    }
  };

  const handleMapClick = async (event) => {
    let lat, lng;

    if (window.google && event.latLng) {
      // Google Maps click
      lat = event.latLng.lat();
      lng = event.latLng.lng();
    } else {
      // Fallback map click
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      lat = 22.3039 + 0.1 * (0.5 - y / rect.height);
      lng = 73.1812 + 0.1 * (x / rect.width - 0.5);
    }

    setSelectedCoords({ lat, lng });

    if (googleMapRef.current && window.google) {
      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMapRef.current,
        title: "Selected Location",
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Update position if marker is dragged
      markerRef.current.addListener("dragend", (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setSelectedCoords({ lat: newLat, lng: newLng });
      });
    }
  };

  const confirmMapLocation = async () => {
    if (!selectedCoords) return;

    setIsConfirming(true);

    try {
      let addressData;

      if (window.google) {
        // Use Google's Geocoding service
        const geocoder = new window.google.maps.Geocoder();
        const response = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: selectedCoords }, (results, status) => {
            if (status === "OK" && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error("Geocoding failed"));
            }
          });
        });

        const addressComponents = response.address_components;
        const formattedAddress = response.formatted_address;

        addressData = {
          lat: selectedCoords.lat,
          lng: selectedCoords.lng,
          address: formattedAddress,
          city:
            getAddressComponent(addressComponents, "locality") ||
            getAddressComponent(
              addressComponents,
              "administrative_area_level_2"
            ),
          district: getAddressComponent(
            addressComponents,
            "administrative_area_level_2"
          ),
          state: getAddressComponent(
            addressComponents,
            "administrative_area_level_1"
          ),
          pincode: getAddressComponent(addressComponents, "postal_code"),
        };
      } else {
        // Fallback mock data
        await new Promise((resolve) => setTimeout(resolve, 1500));
        addressData = {
          lat: selectedCoords.lat,
          lng: selectedCoords.lng,
          address: `Near ${Math.floor(
            Math.random() * 100
          )} Main Street, Block ${Math.floor(Math.random() * 20)}`,
          city: "Vadodara",
          district: "Vadodara",
          state: "Gujarat",
          pincode: `39000${Math.floor(Math.random() * 10)}`,
        };
      }

      onLocationSelect(addressData);
      setIsConfirming(false);
      setShowMap(false);
      setSelectedCoords(null);
    } catch (error) {
      setMapError("Failed to get address details");
      setIsConfirming(false);
    }
  };

  const getAddressComponent = (components, type) => {
    const component = components.find((comp) => comp.types.includes(type));
    return component ? component.long_name : "";
  };

  const handleManualLocationSubmit = () => {
    if (
      manualLocation.address &&
      manualLocation.city &&
      manualLocation.state &&
      manualLocation.pincode
    ) {
      onLocationSelect({
        lat: 0,
        lng: 0,
        ...manualLocation,
      });
      setShowManualInput(false);
      setManualLocation({
        address: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      });
    }
  };

  const centerOnCurrentLocation = () => {
    if (currentLocation && googleMapRef.current) {
      googleMapRef.current.setCenter(currentLocation);
      googleMapRef.current.setZoom(15);
    } else {
      getCurrentLocation();
    }
  };

  
  // set Modal Functionality
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState(null);
  const [modalTitle, setModalTitle] = React.useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleView = () => {

    setModalTitle('Location');
    setModalContent(
      <div className="flex flex-col items-center justify-center">
        <DeliveryMap  mode="business"  />
      </div>
    );
    openModal();
  };
  
  return (
    <>
     <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        // className="w-full max-w-3xl h-full overflow-y-auto"
      >
        <div className="flex flex-col items-center justify-center">{modalContent}</div>
      </Modal>

    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <MapPin size={16} className="text-gray-500" />
        Business Location *
      </label>

      <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Location Selection</h3>
            <p className="text-sm text-gray-600">
              Choose your preferred method
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleView()
            }
            className="flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            <Map size={20} />
            Select on Map
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowManualInput(true)}
            className="flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            <MapPin size={20} />
            Manual Entry
          </motion.button>
        </div>

        {/* Interactive Map Modal */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Select Your Business Location
                  </h3>
                  <button
                    onClick={() => {
                      setShowMap(false);
                      setSelectedCoords(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative">
                  {/* Map Container */}
                  {window.google ? (
                    <div
                      ref={mapRef}
                      className="w-full h-[500px] bg-gray-100"
                    />
                  ) : (
                    <div
                      onClick={handleMapClick}
                      className="w-full h-[500px] bg-gradient-to-br from-green-100 via-blue-100 to-green-200 relative cursor-crosshair overflow-hidden"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
                        `,
                      }}
                    >
                      {/* Grid lines for fallback map */}
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={`v-${i}`}
                            className="absolute h-full border-l border-gray-400"
                            style={{ left: `${(i + 1) * 5}%` }}
                          />
                        ))}
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={`h-${i}`}
                            className="absolute w-full border-t border-gray-400"
                            style={{ top: `${(i + 1) * 6.67}%` }}
                          />
                        ))}
                      </div>

                      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow text-sm font-medium">
                        📍 Vadodara, Gujarat (Demo Map)
                      </div>

                      {!isMapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                          <div className="text-center">
                            <Loader
                              className="animate-spin mx-auto mb-2"
                              size={24}
                            />
                            <p className="text-sm text-gray-600">
                              Loading map...
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedCoords && !window.google && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${
                              50 + (selectedCoords.lng - 73.1812) * 1000
                            }%`,
                            top: `${
                              50 - (selectedCoords.lat - 22.3039) * 1000
                            }%`,
                          }}
                        >
                          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full opacity-30"
                          />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Map controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={centerOnCurrentLocation}
                      disabled={isLocating}
                      className="bg-white p-3 rounded-lg shadow hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                      title="Find My Location"
                    >
                      {isLocating ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <Locate size={18} className="text-blue-600" />
                      )}
                    </button>
                  </div>

                  {/* Click instruction */}
                  {!selectedCoords && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg text-sm">
                      🎯 Click anywhere on the map to select your business
                      location
                    </div>
                  )}
                </div>

                {/* Location confirmation */}
                {selectedCoords && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Selected Coordinates:
                        </p>
                        <p className="font-mono text-sm font-medium">
                          {selectedCoords.lat.toFixed(6)},{" "}
                          {selectedCoords.lng.toFixed(6)}
                        </p>
                      </div>
                      <button
                        onClick={confirmMapLocation}
                        disabled={isConfirming}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                      >
                        {isConfirming ? (
                          <>
                            <Loader className="animate-spin" size={16} />
                            Getting Address...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Confirm This Location
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Input Form */}
        <AnimatePresence>
          {showManualInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 bg-white rounded-xl p-4 border border-gray-200"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full business address"
                    value={manualLocation.address}
                    onChange={(e) =>
                      setManualLocation((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={manualLocation.city}
                    onChange={(e) =>
                      setManualLocation((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="Enter district"
                    value={manualLocation.district}
                    onChange={(e) =>
                      setManualLocation((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    value={manualLocation.state}
                    onChange={(e) =>
                      setManualLocation((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={manualLocation.pincode}
                    onChange={(e) =>
                      setManualLocation((prev) => ({
                        ...prev,
                        pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManualLocationSubmit}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium hover:bg-green-700 transition-colors w-full sm:w-auto text-sm sm:text-base"
                >
                  <Check size={16} className="sm:size-4" />
                  <span>Confirm Location</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowManualInput(false)}
                  className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors w-full sm:w-auto text-sm sm:text-base"
                >
                  <X size={16} className="sm:size-4" />
                  <span>Cancel</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Location Display */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-500" size={18} />
              <span className="font-medium text-green-800">
                ✅ Location Confirmed
              </span>
            </div>
            <p className="text-sm text-green-700 font-medium">
              {selectedLocation.address}
            </p>
            {selectedLocation.city && (
              <p className="text-sm text-green-600 mt-1">
                📍 {selectedLocation.city}, {selectedLocation.district},{" "}
                {selectedLocation.state} - {selectedLocation.pincode}
              </p>
            )}
            {selectedLocation.lat !== 0 && selectedLocation.lng !== 0 && (
              <p className="text-xs text-green-600 mt-1 font-mono">
                Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            )}
          </motion.div>
        )}

        {/* Error Display */}
        {(mapError || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4"
          >
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{mapError || error}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  
    </>
  );
};

export const FileUpload = ({
  label,
  accept,
  onChange,
  icon: Icon,
  description,
  preview,
  error,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        id={label.replace(/\s+/g, "-").toLowerCase()}
      />
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="cursor-pointer block"
      >
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 mx-auto rounded-lg object-cover shadow-md"
            />
            <p className="text-sm text-green-600 font-medium">
              File uploaded successfully
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-10 h-10 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 font-medium">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        )}
      </label>
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-red-500 text-xs"
      >
        <AlertCircle size={12} />
        {error}
      </motion.div>
    )}
  </div>
);

const ModernSellerForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",

    // Business Information
    businessName: "",
    businessType: "",
    businessCategory: "",
    businessDescription: "",
    yearsInBusiness: "",

    // Location Details
    location: null,

    // Business Settings
    deliveryAvailable: false,
    homeServiceAvailable: false,
    paymentMethods: [],
    openingTime: "",
    closingTime: "",
    weeklyOff: "",

    // KYC Verification Files (Required)
    govtIdProof: null,
    selfieWithId: null,

    // Business Documents
    businessLicense: null, // Optional
    businessPhoto: null,

    // Professional Profile
    professionalPhoto: null,

    // Agreement
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In your component, add this function
  const getDocumentUploadProgress = () => {
    const requiredDocs = [
      "govtIdProof",
      "selfieWithId",
      "businessPhoto",
      "professionalPhoto",
    ];
    const optionalDocs = ["businessLicense"];

    const requiredCompleted = requiredDocs.filter(
      (doc) => formData[doc]
    ).length;
    const optionalCompleted = optionalDocs.filter(
      (doc) => formData[doc]
    ).length;

    const totalDocs = requiredDocs.length + optionalDocs.length;
    const totalCompleted = requiredCompleted + optionalCompleted;

    return {
      completed: totalCompleted,
      total: totalDocs,
      percentage: Math.round((totalCompleted / totalDocs) * 100),
      required: { completed: requiredCompleted, total: requiredDocs.length },
      optional: { completed: optionalCompleted, total: optionalDocs.length },
    };
  };

  const businessTypes = [
    { value: "", label: "Select Business Type" },
    { value: "product", label: "Products Only" },
    { value: "service", label: "Services Only" },
    { value: "both", label: "Both Products & Services" },
  ];

  const businessCategories = [
    { value: "", label: "Select Category" },
    { value: "tailor", label: "Tailor & Clothing" },
    { value: "cobbler", label: "Cobbler & Shoe Repair" },
    { value: "restaurant", label: "Restaurant & Food" },
    { value: "plumber", label: "Plumbing Services" },
    { value: "rickshaw", label: "Transport & Rickshaw" },
    { value: "grocery", label: "Grocery & General Store" },
    { value: "salon", label: "Beauty & Salon" },
    { value: "electronics", label: "Electronics & Repair" },
    { value: "medical", label: "Medical & Pharmacy" },
    { value: "education", label: "Education & Coaching" },
    { value: "other", label: "Other Services" },
  ];

  const yearsOptions = [
    { value: "", label: "Select Experience" },
    { value: "0-1", label: "Less than 1 year" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "More than 10 years" },
  ];

  const weekDays = [
    { value: "", label: "Select weekly off day" },
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "none", label: "No weekly off" },
  ];

  const paymentOptions = [
    "Cash",
    "UPI",
    "Card",
    "Net Banking",
    "Digital Wallet",
  ];

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Business Details", icon: Building2 },
    { number: 3, title: "Location & Hours", icon: MapPin },
    { number: 4, title: "Documents", icon: Upload },
    { number: 5, title: "Review & Submit", icon: CheckCircle },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentMethodToggle = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      const allowedTypes = {
        businessLicense: ["application/pdf", "image/jpeg", "image/png"],
        idProof: ["application/pdf", "image/jpeg", "image/png"],
        businessPhoto: ["image/jpeg", "image/png", "image/webp"],
      };

      if (allowedTypes[field] && !allowedTypes[field].includes(file.type)) {
        const fileTypeNames = {
          "application/pdf": "PDF",
          "image/jpeg": "JPEG",
          "image/png": "PNG",
          "image/webp": "WebP",
        };
        const allowed = allowedTypes[field]
          .map((type) => fileTypeNames[type])
          .join(", ");
        setErrors((prev) => ({
          ...prev,
          [field]: `Only ${allowed} files are allowed`,
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.result,
        }));
        // Clear error when file is uploaded successfully
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
        } else if (formData.fullName.length < 2) {
          newErrors.fullName = "Full name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
          newErrors.fullName =
            "Full name should only contain letters and spaces";
        }

        if (!formData.contactNumber.trim()) {
          newErrors.contactNumber = "Contact number is required";
        } else if (
          !/^[6-9]\d{9}$/.test(formData.contactNumber.replace(/\D/g, ""))
        ) {
          newErrors.contactNumber =
            "Please enter a valid 10-digit Indian mobile number";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password =
            "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        break;

      case 2:
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        } else if (formData.businessName.length < 2) {
          newErrors.businessName =
            "Business name must be at least 2 characters";
        }

        if (!formData.businessType) {
          newErrors.businessType = "Business type is required";
        }

        if (!formData.businessCategory) {
          newErrors.businessCategory = "Business category is required";
        }

        if (!formData.businessDescription.trim()) {
          newErrors.businessDescription = "Business description is required";
        } else if (formData.businessDescription.length < 20) {
          newErrors.businessDescription =
            "Business description must be at least 20 characters";
        }

        if (!formData.yearsInBusiness) {
          newErrors.yearsInBusiness = "Years of experience is required";
        }
        break;

      case 3:
        if (!formData.location) {
          newErrors.location = "Business location is required";
        }

        if (!formData.openingTime) {
          newErrors.openingTime = "Opening time is required";
        }

        if (!formData.closingTime) {
          newErrors.closingTime = "Closing time is required";
        }

        if (formData.openingTime && formData.closingTime) {
          const openTime = new Date(`2000-01-01T${formData.openingTime}`);
          const closeTime = new Date(`2000-01-01T${formData.closingTime}`);

          if (closeTime <= openTime) {
            newErrors.closingTime = "Closing time must be after opening time";
          }
        }

        if (!formData.weeklyOff) {
          newErrors.weeklyOff = "Weekly off day selection is required";
        }
        break;

      // case 4:
      //   if (!formData.businessLicense) {
      //     newErrors.businessLicense =
      //       "Business license/registration document is required";
      //   }

      //   if (!formData.idProof) {
      //     newErrors.idProof = "ID proof document is required";
      //   }

      //   if (!formData.businessPhoto) {
      //     newErrors.businessPhoto = "Business photo is required";
      //   }
      //   break;

      case 4:
        // KYC Verification (Required)
        if (!formData.govtIdProof) {
          newErrors.govtIdProof =
            "Government ID proof is required for verification";
        }

        if (!formData.selfieWithId) {
          newErrors.selfieWithId =
            "Selfie with ID is required for face verification";
        }

        // Business Documents
        if (!formData.businessPhoto) {
          newErrors.businessPhoto = "Business/workspace photo is required";
        }

        if (!formData.professionalPhoto) {
          newErrors.professionalPhoto =
            "Professional profile photo is required";
        }

        // Business license is now optional - no validation needed
        // if (!formData.businessLicense) {
        //   newErrors.businessLicense = "Business license is optional but recommended";
        // }
        break;

      case 5:
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = "You must accept the terms and conditions";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Show success message
      alert(
        "Registration successful! Welcome to CityConnect. You will receive a confirmation email shortly."
      );

      // Reset form
      setFormData({
        fullName: "",
        contactNumber: "",
        email: "",
        password: "",
        businessName: "",
        businessType: "",
        businessCategory: "",
        businessDescription: "",
        yearsInBusiness: "",
        location: null,
        deliveryAvailable: false,
        homeServiceAvailable: false,
        paymentMethods: [],
        openingTime: "",
        closingTime: "",
        weeklyOff: "",
        businessLicense: null,
        idProof: null,
        businessPhoto: null,
        acceptTerms: false,
      });
      setCurrentStep(1);
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h3>
              <p className="text-gray-600 mt-2">
                Let's start with your basic details
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                icon={User}
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                error={errors.fullName}
              />

              <FormInput
                label="Contact Number"
                icon={Phone}
                name="contactNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange(
                    "contactNumber",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                error={errors.contactNumber}
              />

              <FormInput
                label="Email Address"
                icon={Mail}
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />

              <div className="relative">
                <FormInput
                  label="Password"
                  icon={Shield}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={errors.password}
                  className="pr-12"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <div className="py-2">
                      <EyeOff size={20} />
                    </div>
                  ) : (
                    <div className="py-2">
                      <Eye size={20} />
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Business Details
              </h3>
              <p className="text-gray-600 mt-2">Tell us about your business</p>
            </div>

            <FormInput
              label="Business Name"
              icon={Store}
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              error={errors.businessName}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormSelect
                label="Business Type"
                icon={Building2}
                name="businessType"
                options={businessTypes}
                value={formData.businessType}
                onChange={(e) =>
                  handleInputChange("businessType", e.target.value)
                }
                error={errors.businessType}
              />

              <FormSelect
                label="Business Category"
                icon={Target}
                name="businessCategory"
                options={businessCategories}
                value={formData.businessCategory}
                onChange={(e) =>
                  handleInputChange("businessCategory", e.target.value)
                }
                error={errors.businessCategory}
              />
            </div>

            <FormSelect
              label="Years in Business"
              icon={Calendar}
              name="yearsInBusiness"
              options={yearsOptions}
              value={formData.yearsInBusiness}
              onChange={(e) =>
                handleInputChange("yearsInBusiness", e.target.value)
              }
              error={errors.yearsInBusiness}
            />

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} className="text-gray-500" />
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business, services, and what makes you unique (minimum 20 characters)"
                rows={4}
                value={formData.businessDescription}
                onChange={(e) =>
                  handleInputChange("businessDescription", e.target.value)
                }
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 resize-none ${
                  errors.businessDescription
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200"
                }`}
              />
              {errors.businessDescription && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-xs mt-1"
                >
                  <AlertCircle size={12} />
                  {errors.businessDescription}
                </motion.div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formData.businessDescription.length}/500 characters
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Location & Hours
              </h3>
              <p className="text-gray-600 mt-2">
                Set your business location and operating hours
              </p>
            </div>

            <MapComponent
              onLocationSelect={(location) =>
                handleInputChange("location", location)
              }
              selectedLocation={formData.location}
              error={errors.location}
            />

            <div className="grid md:grid-cols-3 gap-6">
              <TimeSelect
                label="Opening Time"
                icon={Clock}
                name="openingTime"
                value={formData.openingTime}
                onChange={(e) =>
                  handleInputChange("openingTime", e.target.value)
                }
                error={errors.openingTime}
              />

              <TimeSelect
                label="Closing Time"
                icon={Clock}
                name="closingTime"
                value={formData.closingTime}
                onChange={(e) =>
                  handleInputChange("closingTime", e.target.value)
                }
                error={errors.closingTime}
              />

              <FormSelect
                label="Weekly Off Day"
                icon={Calendar}
                name="weeklyOff"
                options={weekDays}
                value={formData.weeklyOff}
                onChange={(e) => handleInputChange("weeklyOff", e.target.value)}
                error={errors.weeklyOff}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CreditCard size={16} className="text-gray-500" />
                Payment Methods Accepted
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentOptions.map((method) => (
                  <motion.button
                    key={method}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethodToggle(method)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.paymentMethods.includes(method)
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {method}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ToggleSwitch
                label="Delivery Available"
                description="Enable this if you provide home delivery service"
                checked={formData.deliveryAvailable}
                onChange={(value) =>
                  handleInputChange("deliveryAvailable", value)
                }
                error={errors.deliveryAvailable}
              />

              <GlassCard className="p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.homeServiceAvailable}
                    onChange={(e) =>
                      handleInputChange(
                        "homeServiceAvailable",
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 text-black border-2 border-gray-300 rounded "
                  />
                  <div>
                    <span className="font-semibold text-gray-700">
                      Home Service
                    </span>
                    <p className="text-sm text-gray-500">
                      I can provide services at customer location
                    </p>
                  </div>
                </label>
              </GlassCard>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Identity Verification & Documents
              </h3>
              <p className="text-gray-600 mt-2">
                Complete KYC verification to ensure platform security
              </p>
            </div>

            {/* KYC Verification Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-blue-800">
                  KYC Verification (Required)
                </h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FileUpload
                  label="Government ID Proof *"
                  icon={CreditCard}
                  accept=".pdf,.jpg,.jpeg,.png"
                  description="Aadhaar, Passport, Driving License, Voter ID (PDF, JPG, PNG - Max 5MB)"
                  onChange={(e) => handleFileUpload("govtIdProof", e)}
                  preview={formData.govtIdProof}
                  error={errors.govtIdProof}
                  priority="high"
                />

                <FileUpload
                  label="Selfie with ID *"
                  icon={Camera}
                  accept=".jpg,.jpeg,.png,.webp"
                  description="Clear selfie holding your ID document (JPG, PNG, WebP - Max 5MB)"
                  onChange={(e) => handleFileUpload("selfieWithId", e)}
                  preview={formData.selfieWithId}
                  error={errors.selfieWithId}
                  priority="high"
                />
              </div>

              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-600 mt-0.5" size={16} />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">
                      Identity Verification Process:
                    </p>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Your ID will be verified using OCR technology</li>
                      <li>
                        • Facial recognition will match your selfie with ID
                        photo
                      </li>
                      <li>
                        • This helps prevent fake accounts and ensures platform
                        security
                      </li>
                      <li>• All documents are encrypted and stored securely</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Documents Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Business Information
                </h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FileUpload
                  label="Business License (Optional)"
                  icon={Award}
                  accept=".pdf,.jpg,.jpeg,.png"
                  description="Business registration/GST certificate (PDF, JPG, PNG - Max 5MB)"
                  onChange={(e) => handleFileUpload("businessLicense", e)}
                  preview={formData.businessLicense}
                  error={errors.businessLicense}
                  optional={true}
                />

                <FileUpload
                  label="Business/Workspace Photo *"
                  icon={Store}
                  accept=".jpg,.jpeg,.png,.webp"
                  description="Clear photo of your business/workspace (JPG, PNG, WebP - Max 5MB)"
                  onChange={(e) => handleFileUpload("businessPhoto", e)}
                  preview={formData.businessPhoto}
                  error={errors.businessPhoto}
                  priority="medium"
                />
              </div>

              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Business Verification:</p>
                    <p>
                      While business license is optional, providing it helps
                      build trust with customers and may unlock additional
                      features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Photo Section */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-green-800">
                  Professional Profile
                </h4>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <FileUpload
                  label="Professional Profile Photo *"
                  icon={Camera}
                  accept=".jpg,.jpeg,.png,.webp"
                  description="Professional headshot for your seller profile (JPG, PNG, WebP - Max 5MB)"
                  onChange={(e) => handleFileUpload("professionalPhoto", e)}
                  preview={formData.professionalPhoto}
                  error={errors.professionalPhoto}
                  priority="medium"
                />
              </div>

              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5" size={16} />
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-1">Profile Photo Tips:</p>
                    <ul className="space-y-1 text-green-600">
                      <li>• Use a clear, well-lit photo</li>
                      <li>• Face should be clearly visible</li>
                      <li>• Professional attire recommended</li>
                      <li>
                        • This photo will be displayed on your seller profile
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-red-600 mt-0.5" size={16} />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Security & Privacy:</p>
                  <p>
                    All uploaded documents are encrypted and used solely for
                    verification purposes. We employ advanced AI and OCR
                    technology to detect fraudulent documents and ensure
                    platform integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {Object.values(errors).filter(Boolean).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-medium">
                  Please complete the required verification:
                </p>
                <ul className="text-red-600 text-sm mt-2 space-y-1">
                  {Object.entries(errors).map(
                    ([field, error]) => error && <li key={field}>• {error}</li>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Review & Submit
              </h3>
              <p className="text-gray-600 mt-2">
                Please review your information before submitting
              </p>
            </div>

            <div className="space-y-6">
              {/* Personal Information Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-500" />
                  Personal Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">
                      {formData.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <span className="ml-2 font-medium">
                      {formData.contactNumber}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{formData.email}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Business Information Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-purple-500" />
                  Business Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Business Name:</span>
                    <span className="ml-2 font-medium">
                      {formData.businessName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">
                      {formData.businessType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">
                      {formData.businessCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Experience:</span>
                    <span className="ml-2 font-medium">
                      {formData.yearsInBusiness}
                    </span>
                  </div>
                  {formData.businessDescription && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Description:</span>
                      <p className="ml-2 font-medium mt-1">
                        {formData.businessDescription}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Location & Hours Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-500" />
                  Location & Hours
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {formData.location && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">
                        {formData.location.address}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Hours:</span>
                    <span className="ml-2 font-medium">
                      {formData.openingTime} - {formData.closingTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weekly Off:</span>
                    <span className="ml-2 font-medium capitalize">
                      {formData.weeklyOff || "None"}
                    </span>
                  </div>
                  {formData.paymentMethods.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Payment Methods:</span>
                      <div className="ml-2 flex flex-wrap gap-2 mt-1">
                        {formData.paymentMethods.map((method) => (
                          <span
                            key={method}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Services Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-orange-500" />
                  Additional Services
                </h4>
                <div className="flex gap-4">
                  <div
                    className={`px-4 py-2 rounded-lg border-2 ${
                      formData.deliveryAvailable
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <span className="font-medium">Delivery: </span>
                    <span>
                      {formData.deliveryAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg border-2 ${
                      formData.homeServiceAvailable
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <span className="font-medium">Home Service: </span>
                    <span>
                      {formData.homeServiceAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Documents Review */}
              {/* <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-red-500" />
                  Documents Uploaded
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: "businessLicense", label: "Business License" },
                    { key: "idProof", label: "ID Proof" },
                    { key: "businessPhoto", label: "Business Photo" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData[key]
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {formData[key] ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Upload size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-gray-600">
                          {formData[key] ? "Uploaded" : "Not uploaded"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard> */}

              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Verification Documents
                </h4>

                {/* KYC Documents Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <CreditCard size={16} />
                    KYC Verification (Required)
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "govtIdProof",
                        label: "Government ID Proof",
                        required: true,
                      },
                      {
                        key: "selfieWithId",
                        label: "Selfie with ID",
                        required: true,
                      },
                    ].map(({ key, label, required }) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData[key]
                              ? verificationStatus[key] === "verified"
                                ? "bg-green-500 text-white"
                                : verificationStatus[key] === "verifying"
                                ? "bg-yellow-500 text-white"
                                : verificationStatus[key] === "failed"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          {formData[key] ? (
                            verificationStatus[key] === "verified" ? (
                              <CheckCircle size={16} />
                            ) : verificationStatus[key] === "verifying" ? (
                              <Loader className="animate-spin" size={16} />
                            ) : verificationStatus[key] === "failed" ? (
                              <XCircle size={16} />
                            ) : (
                              <Upload size={16} />
                            )
                          ) : (
                            <Upload size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{label}</p>
                            {required && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {formData[key]
                              ? verificationStatus[key] === "verified"
                                ? "Verified ✓"
                                : verificationStatus[key] === "verifying"
                                ? "Verifying..."
                                : verificationStatus[key] === "failed"
                                ? "Verification Failed"
                                : "Uploaded"
                              : "Not uploaded"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Documents Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Briefcase size={16} />
                    Business Documents
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "businessLicense",
                        label: "Business License",
                        required: false,
                      },
                      {
                        key: "businessPhoto",
                        label: "Business/Workspace Photo",
                        required: true,
                      },
                    ].map(({ key, label, required }) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData[key]
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          {formData[key] ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Upload size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{label}</p>
                            {required && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                            {!required && (
                              <span className="text-green-600 text-xs">
                                (Optional)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {formData[key] ? "Uploaded" : "Not uploaded"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Profile Section */}
                <div>
                  <h5 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                    <User size={16} />
                    Professional Profile
                  </h5>
                  <div className="grid md:grid-cols-1 gap-4">
                    {[
                      {
                        key: "professionalPhoto",
                        label: "Professional Profile Photo",
                        required: true,
                      },
                    ].map(({ key, label, required }) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData[key]
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          {formData[key] ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Camera size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{label}</p>
                            {required && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {formData[key] ? "Uploaded" : "Not uploaded"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Status */}
                {/* <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {Object.values(formData).filter(Boolean).length}/5
                      completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (Object.values(formData).filter(Boolean).length / 5) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div> */}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Document Upload Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {getDocumentUploadProgress().completed}/
                      {getDocumentUploadProgress().total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getDocumentUploadProgress().percentage}%`,
                      }}
                    ></div>
                  </div>

                  {/* Additional Progress Details */}
                  <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Required:{" "}
                        {getDocumentUploadProgress().required.completed}/
                        {getDocumentUploadProgress().required.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Optional:{" "}
                        {getDocumentUploadProgress().optional.completed}/
                        {getDocumentUploadProgress().optional.total}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Terms & Conditions */}
              <GlassCard className="p-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      handleInputChange("acceptTerms", e.target.checked)
                    }
                    className="w-5 h-5 text-black border-2 border-gray-300 rounded  mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">
                      Accept Terms & Conditions
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </button>
                      . I confirm that all the information provided is accurate
                      and I have the authority to register this business.
                    </p>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </label>
              </GlassCard>

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <AlertCircle size={16} />
                  {errors.submit}
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <MovingDots count={600} density={120} />

      {/* Floating Elements */}
      <FloatingElement size={100} delay={0} style={{ top: "10%", left: "10%" }}>
        <div className="w-6 h-6 bg-blue-500/20 rounded-full" />
      </FloatingElement>
      <FloatingElement size={80} delay={1} style={{ top: "20%", right: "15%" }}>
        <Store className="text-purple-500/20" size={32} />
      </FloatingElement>
      <FloatingElement
        size={60}
        delay={2}
        style={{ bottom: "15%", left: "20%" }}
      >
        <Sparkles className="text-orange-500/20" size={24} />
      </FloatingElement>
      <FloatingElement
        size={90}
        delay={3}
        style={{ bottom: "25%", right: "10%" }}
      >
        <div className="w-4 h-4 bg-green-500/20 rotate-45" />
      </FloatingElement>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <Store size={20} />
            Become a Seller
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our Business Network
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register your business and connect with thousands of customers in
            your area
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center  overflow-x-auto space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex  items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-black text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-white text-black"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={16} />
                      ) : (
                        <step.icon size={16} />
                      )}
                    </div>
                    <span className="hidden md:block font-medium text-sm">
                      {step.title}
                    </span>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard className="py-8 px-4 shadow-xl">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2 justify-between mt-12 pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02, x: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-400"
                }`}
              >
                <ArrowRight size={20} className="rotate-180" />
                Previous
              </motion.button>

              {currentStep < 5 ? (
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 border-2 border-black bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Next
                  <ArrowRight size={20} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center ml-2 justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 border-2 sm:py-3 bg-green-600 text-white rounded-xl border-green-600 sm:rounded-xl font-medium sm:font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={17} className="sm:size-5" />
                      <span>Submit</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            {[
              { icon: Shield, text: "Secure & Protected" },
              { icon: Award, text: "Verified Platform" },
              { icon: Users, text: "10,000+ Sellers" },
              { icon: Heart, text: "Trusted by Many" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
              >
                <item.icon size={18} className="text-gray-500" />
                <span className="font-medium text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
            By registering, you agree that your information will be verified for
            authenticity. We're committed to maintaining a trustworthy
            marketplace for all our users.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernSellerForm;
