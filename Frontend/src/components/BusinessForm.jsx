import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Building2, 
  MapPin, 
  Camera, 
  Upload, 
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
  AlertCircle, 
  Check, 
  X, 
  Send, 
  Truck, 
  ArrowRight, 
  Users, 
  Zap, 
  CreditCard, 
  Info, 
  Briefcase, 
  AlertTriangle,
  Map as MapIcon,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  DollarSign,
  Image as ImageIcon,
  Trash2
} from "lucide-react";

// Import Modal and DeliveryMap components
// Note: In your actual code, adjust these imports to match your file structure
import Modal from "./Modal.jsx";
import DeliveryMap from "./map/DeliveryMap.jsx";
import { useSelector } from "react-redux";
import databaseService from "@/services/database.services.js";
import { useNavigate } from "react-router-dom";

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
    // Business Information (maps to Business model)
    businessName: "", // name
    businessType: "", // type: "product", "service", "both"
    businessCategory: "", // category
    businessDescription: "", // description
    establishedYear: "", // establishedYear
    numberOfEmployees: "", // numberOfEmployees
    annualRevenue: "", // annualRevenue (optional)
    logo: null, // logo
    images: [], // images array

    // Business Contact (maps to BusinessContact model)
    phone: "", // phone
    email: "", // email
    website: "", // website (optional)
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },

    // Business Location (maps to BusinessLocation model)
    location: null, // will contain: lat, lng, address, street, city, state, postalCode, country

    // Business Hours (maps to BusinessHour model - array of 7 days)
    businessHours: [
      { dayOfWeek: "Monday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Tuesday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Wednesday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Thursday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Friday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Saturday", openTime: "", closeTime: "", isClosed: false },
      { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: false },
    ],

    // Agreement
    acceptTerms: false,
  });

//   const initialFormData = {
//   // Business Information
//   businessName: "TechNova Solutions",
//   businessType: "service", // "product" | "service" | "both"
//   businessCategory: "cafe",
//   businessDescription:
//     "TechNova Solutions provides custom software development, web applications, and digital transformation services for startups and enterprises.",
//   establishedYear: "2018",
//   numberOfEmployees: "45",
//   annualRevenue: "2.5M USD",
//   logo: "https://example.com/uploads/technova-logo.png",
//   images: [
//     "https://example.com/uploads/office-1.jpg",
//     "https://example.com/uploads/team-photo.jpg",
//     "https://example.com/uploads/workspace.jpg",
//   ],

//   // Business Contact
//   phone: "+1 415 987 6543",
//   email: "contact@technovasolutions.com",
//   website: "https://technovasolutions.com",
//   socialMedia: {
//     facebook: "https://facebook.com/technovasolutions",
//     twitter: "https://twitter.com/technova_inc",
//     instagram: "https://instagram.com/technova_solutions",
//     linkedin: "https://linkedin.com/company/technovasolutions",
//     youtube: "https://youtube.com/@technovasolutions",
//   },

//   // Business Location
//   location: {
//     lat: 37.7749,
//     lng: -122.4194,
//     address: "123 Market Street, San Francisco, CA 94103",
//     street: "123 Market Street",
//     city: "San Francisco",
//     state: "California",
//     postalCode: "94103",
//     country: "USA",
//   },

//   // Business Hours
//   businessHours: [
//     { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
//     { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
//     { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
//     { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
//     { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
//     { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "02:00 PM", isClosed: false },
//     { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true },
//   ],

//   // Agreement
//   acceptTerms: true,
// };

  const personalInfo = useSelector((state) => state?.auth?.userData?.user);

  useEffect(() => {
    if (personalInfo) {
      setFormData((prev) => ({
        ...prev,
        phone: personalInfo.phoneNumber || "",
        email: personalInfo.email || "",
      }));
    }
  }, [personalInfo]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    { value: "", label: "Select Business Type" },
    { value: "product", label: "Products Only" },
    { value: "service", label: "Services Only" },
    { value: "both", label: "Both Products & Services" },
  ];

  const businessCategories = [
    { value: "", label: "Select Category" },
    { value: "restaurant", label: "Restaurant" },
    { value: "cafe", label: "Cafe" },
    { value: "gym", label: "Gym" },
    { value: "salon", label: "Salon [Beauty Services]" },
    { value: "transport", label: "Transport" },
    { value: "education", label: "Education" },
    { value: "medical", label: "Medical Healthcare" },
    { value: "shopping", label: "Shopping Retail" },
    { value: "entertainment", label: "Entertainment Events" },
    { value: "services", label: "Professional Services" },
    { value: "other", label: "Other" },
  ];

  const yearsOptions = [
    { value: "", label: "Select Year" },
    ...Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
      const year = 1900 + i;
      return { value: year.toString(), label: year.toString() };
    }).reverse(),
  ];

  const employeeOptions = [
    { value: "", label: "Select Range" },
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501+", label: "500+ employees" },
  ];

  const steps = [
    { number: 1, title: "Business Details", icon: Building2 },
    { number: 2, title: "Contact & Social", icon: Phone },
    { number: 3, title: "Location", icon: MapPin },
    { number: 4, title: "Hours & Media", icon: Clock },
    { number: 5, title: "Review & Submit", icon: CheckCircle },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBusinessHourChange = (dayIndex, field, value) => {
    setFormData((prev) => {
      const newHours = [...prev.businessHours];
      newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
      return { ...prev, businessHours: newHours };
    });
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.result,
        }));
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Each image must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        }

        if (!formData.businessType) {
          newErrors.businessType = "Business type is required";
        }

        if (!formData.businessCategory) {
          newErrors.businessCategory = "Business category is required";
        }

        if (!formData.businessDescription.trim()) {
          newErrors.businessDescription = "Business description is required";
        } else if (formData.businessDescription.length > 500) {
          newErrors.businessDescription = "Description must be 500 characters or less";
        }

        if (!formData.establishedYear) {
          newErrors.establishedYear = "Established year is required";
        } else {
          const year = parseInt(formData.establishedYear);
          if (year < 1900 || year > new Date().getFullYear()) {
            newErrors.establishedYear = "Please enter a valid year";
          }
        }

        if (!formData.numberOfEmployees) {
          newErrors.numberOfEmployees = "Number of employees is required";
        }
        break;

      case 2:
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
          newErrors.phone = "Please enter a valid 10-digit Indian mobile number";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;

      case 3:
        if (!formData.location) {
          newErrors.location = "Business location is required";
        } else {
          if (!formData.location.address) {
            newErrors.location = "Complete address is required";
          }
          if (!formData.location.city) {
            newErrors.location = "City is required";
          }
          if (!formData.location.state) {
            newErrors.location = "State is required";
          }
          if (!formData.location.postalCode) {
            newErrors.location = "Postal code is required";
          }
        }
        break;

      case 4:
        const hasAnyHours = formData.businessHours.some(
          (day) => !day.isClosed && day.openTime && day.closeTime
        );
        if (!hasAnyHours) {
          newErrors.businessHours = "Please set business hours for at least one day";
        }

        // Validate that open time is before close time
        formData.businessHours.forEach((day, index) => {
          if (!day.isClosed && day.openTime && day.closeTime) {
            const openTime = new Date(`2000-01-01T${day.openTime}`);
            const closeTime = new Date(`2000-01-01T${day.closeTime}`);
            if (closeTime <= openTime) {
              newErrors[`businessHours_${index}`] = `${day.dayOfWeek}: Closing time must be after opening time`;
            }
          }
        });
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
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const navigate=useNavigate();

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // step 1;
      const registerBusinessInfo={
        name: formData.businessName,
        type: formData.businessType,
        category: formData.businessCategory,
        description: formData.businessDescription,
        establishedYear: formData.establishedYear,
        numberOfEmployees: formData.numberOfEmployees,
        annualRevenue: formData.annualRevenue,
        logo: formData.logo,
        images: formData.images,
      }
      const business = await databaseService.registerBusinessBasicInfo(registerBusinessInfo).then((response)=>response.data)
      
      if(!business || !business._id){
        throw new Error("Business registration failed");
      }
      console.log("Registered Business:", business);
      
      const businessId = business._id;
      // step 2: Business Contact
      const registerBusinessContactInfo={
        businessId: businessId,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        socialMedia: formData.socialMedia,
      }
      //temp data

      const businessContact = await databaseService.registerBusinessContactInfo(businessId, registerBusinessContactInfo);
      
      // step 3: Business Location
      const registerBusinessLocationInfo={  
        businessId: businessId,
        lat: formData.location.lat,
        lng: formData.location.lng,
        address: formData.location.address,
        street: formData.location.street,
        city: formData.location.city,
        state: formData.location.state,
        postalCode: formData.location.postalCode,
        country: formData.location.country,
      }
      const businessLocation = await databaseService.registerBusinessLocationInfo(businessId, registerBusinessLocationInfo);
      console.log("Registered Business Location:", businessLocation);

      // step 4: Business Hours
      for(const dayInfo of formData.businessHours){
        const registerBusinessHoursInfo={
          businessId: businessId,
          dayOfWeek: dayInfo.dayOfWeek,
          openTime: dayInfo.isClosed ? null : dayInfo.openTime,
          closeTime: dayInfo.isClosed ? null : dayInfo.closeTime,
          isClosed: dayInfo.isClosed,
        }
        await databaseService.registerBusinessHoursInfo(businessId,registerBusinessHoursInfo);
      }

      // All steps completed


      console.log("Form submitted:", formData);
      alert("Registration successful! Your business is pending verification.");
      navigate('/user-profile')

      // Reset form
      setFormData({
        businessName: "",
        businessType: "",
        businessCategory: "",
        businessDescription: "",
        establishedYear: "",
        numberOfEmployees: "",
        annualRevenue: "",
        logo: null,
        images: [],
        phone: "",
        email: "",
        website: "",
        socialMedia: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
        },
        location: null,
        businessHours: [
          { dayOfWeek: "Monday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Tuesday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Wednesday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Thursday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Friday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Saturday", openTime: "", closeTime: "", isClosed: false },
          { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: false },
        ],
        acceptTerms: false,
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission error:", error);
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
                <Building2 className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Business Details</h3>
              <p className="text-gray-600 mt-2">Tell us about your business</p>
            </div>

            <FormInput
              label="Business Name *"
              icon={Store}
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              error={errors.businessName}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormSelect
                label="Business Type *"
                icon={Building2}
                name="businessType"
                options={businessTypes}
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                error={errors.businessType}
              />

              <FormSelect
                label="Business Category *"
                icon={Target}
                name="businessCategory"
                options={businessCategories}
                value={formData.businessCategory}
                onChange={(e) => handleInputChange("businessCategory", e.target.value)}
                error={errors.businessCategory}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormSelect
                label="Established Year *"
                icon={Calendar}
                name="establishedYear"
                options={yearsOptions}
                value={formData.establishedYear}
                onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                error={errors.establishedYear}
              />

              <FormSelect
                label="Number of Employees *"
                icon={Users}
                name="numberOfEmployees"
                options={employeeOptions}
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange("numberOfEmployees", e.target.value)}
                error={errors.numberOfEmployees}
              />
            </div>

            <FormInput
              label="Annual Revenue (Optional)"
              icon={DollarSign}
              name="annualRevenue"
              type="number"
              placeholder="Enter annual revenue in INR"
              value={formData.annualRevenue}
              onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
            />

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} className="text-gray-500" />
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business, services, and what makes you unique (max 500 characters)"
                rows={4}
                value={formData.businessDescription}
                onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                maxLength={500}
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

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Contact Information</h3>
              <p className="text-gray-600 mt-2">How can customers reach you?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Phone Number *"
                icon={Phone}
                name="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={(e) =>
                  handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                error={errors.phone}
              />

              <FormInput
                label="Email Address *"
                icon={Mail}
                name="email"
                type="email"
                placeholder="Enter business email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />
            </div>

            <FormInput
              label="Website (Optional)"
              icon={Globe}
              name="website"
              type="url"
              placeholder="https://www.yourbusiness.com"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-600" />
                Social Media Links (Optional)
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="Facebook"
                  icon={Facebook}
                  name="facebook"
                  placeholder="Facebook page URL"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    handleInputChange("socialMedia", {
                      ...formData.socialMedia,
                      facebook: e.target.value,
                    })
                  }
                />

                <FormInput
                  label="Instagram"
                  icon={Instagram}
                  name="instagram"
                  placeholder="Instagram profile URL"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    handleInputChange("socialMedia", {
                      ...formData.socialMedia,
                      instagram: e.target.value,
                    })
                  }
                />

                <FormInput
                  label="Twitter"
                  icon={Twitter}
                  name="twitter"
                  placeholder="Twitter profile URL"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    handleInputChange("socialMedia", {
                      ...formData.socialMedia,
                      twitter: e.target.value,
                    })
                  }
                />

                <FormInput
                  label="LinkedIn"
                  icon={Linkedin}
                  name="linkedin"
                  placeholder="LinkedIn page URL"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) =>
                    handleInputChange("socialMedia", {
                      ...formData.socialMedia,
                      linkedin: e.target.value,
                    })
                  }
                />

                <FormInput
                  label="YouTube"
                  icon={Youtube}
                  name="youtube"
                  placeholder="YouTube channel URL"
                  value={formData.socialMedia.youtube}
                  onChange={(e) =>
                    handleInputChange("socialMedia", {
                      ...formData.socialMedia,
                      youtube: e.target.value,
                    })
                  }
                />
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
              <h3 className="text-2xl font-bold text-gray-800">Business Location</h3>
              <p className="text-gray-600 mt-2">Where is your business located?</p>
            </div>

            <MapComponent
              onLocationSelect={(location) => handleInputChange("location", location)}
              selectedLocation={formData.location}
              error={errors.location}
            />
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
                <Clock className="text-white animate-bounce" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Business Hours & Media</h3>
              <p className="text-gray-600 mt-2">Set your operating hours and upload media</p>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-purple-600" />
                Weekly Business Hours *
              </h4>
              {errors.businessHours && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-xs mb-4 bg-red-50 p-3 rounded-lg"
                >
                  <AlertCircle size={12} />
                  {errors.businessHours}
                </motion.div>
              )}
              <div className="space-y-3">
                {formData.businessHours.map((day, index) => (
                  <div
                    key={day.dayOfWeek}
                    className="bg-white rounded-xl p-4 border border-purple-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-800">{day.dayOfWeek}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.isClosed}
                          onChange={(e) =>
                            handleBusinessHourChange(index, "isClosed", e.target.checked)
                          }
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                    {!day.isClosed && (
                      <div className="grid grid-cols-2 gap-3">
                        <TimeSelect
                          label="Opening Time"
                          icon={Clock}
                          value={day.openTime}
                          onChange={(e) =>
                            handleBusinessHourChange(index, "openTime", e.target.value)
                          }
                          error={errors[`businessHours_${index}`]}
                        />
                        <TimeSelect
                          label="Closing Time"
                          icon={Clock}
                          value={day.closeTime}
                          onChange={(e) =>
                            handleBusinessHourChange(index, "closeTime", e.target.value)
                          }
                          error={errors[`businessHours_${index}`]}
                        />
                      </div>
                    )}
                    {day.isClosed && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Marked as closed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <FileUpload
              label="Business Logo (Optional)"
              icon={ImageIcon}
              accept=".jpg,.jpeg,.png,.webp"
              description="Upload your business logo (JPG, PNG, WebP - Max 5MB)"
              onChange={(e) => handleFileUpload("logo", e)}
              preview={formData.logo}
              error={errors.logo}
            />

            {/* Multiple Images Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ImageIcon size={16} className="text-gray-500" />
                Business Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-all">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="business-images"
                />
                <label
                  htmlFor="business-images"
                  className="cursor-pointer block text-center"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload multiple images of your business (Max 5MB each)
                  </p>
                </label>
              </div>

              {/* Display uploaded images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt={`Business ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {errors.images && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-xs"
                >
                  <AlertCircle size={12} />
                  {errors.images}
                </motion.div>
              )}
            </div>
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
              <h3 className="text-2xl font-bold text-gray-800">Review & Submit</h3>
              <p className="text-gray-600 mt-2">Please review your information before submitting</p>
            </div>

            <div className="space-y-6">
              {/* Business Information Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-purple-500" />
                  Business Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Business Name:</span>
                    <span className="ml-2 font-medium">{formData.businessName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{formData.businessType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{formData.businessCategory}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Established:</span>
                    <span className="ml-2 font-medium">{formData.establishedYear}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Employees:</span>
                    <span className="ml-2 font-medium">{formData.numberOfEmployees}</span>
                  </div>
                  {formData.annualRevenue && (
                    <div>
                      <span className="text-gray-600">Annual Revenue:</span>
                      <span className="ml-2 font-medium">₹{formData.annualRevenue}</span>
                    </div>
                  )}
                  {formData.businessDescription && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Description:</span>
                      <p className="ml-2 font-medium mt-1">{formData.businessDescription}</p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Contact Information Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-blue-500" />
                  Contact Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{formData.email}</span>
                  </div>
                  {formData.website && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Website:</span>
                      <span className="ml-2 font-medium text-blue-600">{formData.website}</span>
                    </div>
                  )}
                  {Object.values(formData.socialMedia).some((link) => link) && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Social Media:</span>
                      <div className="ml-2 flex flex-wrap gap-2 mt-1">
                        {formData.socialMedia.facebook && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Facebook size={12} /> Facebook
                          </span>
                        )}
                        {formData.socialMedia.instagram && (
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Instagram size={12} /> Instagram
                          </span>
                        )}
                        {formData.socialMedia.twitter && (
                          <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Twitter size={12} /> Twitter
                          </span>
                        )}
                        {formData.socialMedia.linkedin && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Linkedin size={12} /> LinkedIn
                          </span>
                        )}
                        {formData.socialMedia.youtube && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Youtube size={12} /> YouTube
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Location Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-500" />
                  Business Location
                </h4>
                {formData.location && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{formData.location.address}</p>
                    {formData.location.street && (
                      <p className="text-gray-600 mt-1">{formData.location.street}</p>
                    )}
                    <p className="text-gray-600 mt-1">
                      {formData.location.city}, {formData.location.state} - {formData.location.postalCode}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{formData.location.country}</p>
                    {formData.location.lat !== 0 && formData.location.lng !== 0 && (
                      <p className="text-gray-400 text-xs mt-2 font-mono">
                        Coordinates: {formData.location.lat}, {formData.location.lng}
                      </p>
                    )}
                  </div>
                )}
              </GlassCard>

              {/* Business Hours Review */}
              <GlassCard className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-orange-500" />
                  Business Hours
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {formData.businessHours.map((day) => (
                    <div
                      key={day.dayOfWeek}
                      className={`p-3 rounded-lg ${
                        day.isClosed ? "bg-gray-100" : "bg-green-50"
                      }`}
                    >
                      <span className="font-medium text-gray-800">{day.dayOfWeek}:</span>
                      {day.isClosed ? (
                        <span className="ml-2 text-gray-500">Closed</span>
                      ) : (
                        <span className="ml-2 text-gray-700">
                          {day.openTime} - {day.closeTime}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Media Review */}
              {(formData.logo || formData.images.length > 0) && (
                <GlassCard className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-indigo-500" />
                    Business Media
                  </h4>
                  <div className="space-y-4">
                    {formData.logo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Logo:</p>
                        <img
                          src={formData.logo}
                          alt="Business Logo"
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                    {formData.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Images ({formData.images.length}):
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {formData.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Business ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Terms & Conditions */}
              <GlassCard className="p-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                    className="w-5 h-5 text-black border-2 border-gray-300 rounded mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">Accept Terms & Conditions</span>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to the{" "}
                      <button type="button" className="text-blue-600 hover:underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </button>
                      . I confirm that all the information provided is accurate and I have the authority
                      to register this business.
                    </p>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
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
      <MovingDots count={600} />

      {/* Floating Elements */}
      <FloatingElement size={100} delay={0} style={{ top: "10%", left: "10%" }}>
        <div className="w-6 h-6 bg-blue-500/20 rounded-full" />
      </FloatingElement>
      <FloatingElement size={80} delay={1} style={{ top: "20%", right: "15%" }}>
        <Store className="text-purple-500/20" size={32} />
      </FloatingElement>
      <FloatingElement size={60} delay={2} style={{ bottom: "15%", left: "20%" }}>
        <Sparkles className="text-orange-500/20" size={24} />
      </FloatingElement>
      <FloatingElement size={90} delay={3} style={{ bottom: "25%", right: "10%" }}>
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
            Register your Business
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our Business Network
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register your business and connect with thousands of customers in your area
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center overflow-x-auto space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                      {isCompleted ? <CheckCircle size={16} /> : <step.icon size={16} />}
                    </div>
                    <span className="hidden md:block font-medium text-sm">{step.title}</span>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        currentStep > step.number ? "bg-green-500" : "bg-gray-200"
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
                    ? "text-gray-400 cursor-not-allowed border-gray-200"
                    : "text-gray-700 hover:bg-gray-100 border-gray-400"
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
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      <span>Submit Registration</span>
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
            By registering, you agree that your information will be verified for authenticity. We're
            committed to maintaining a trustworthy marketplace for all our users.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const MapComponent = ({ onLocationSelect, selectedLocation, error }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    address: "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    lat: "",
    lng: "",
  });

  const handleMapLocationSelect = (coords) => {
    // When location is selected from map, update the form
    setManualLocation(prev => ({
      ...prev,
      lat: coords.lat.toFixed(6),
      lng: coords.lng.toFixed(6)
    }));
    setShowMapModal(false);
    
    // If address details are already filled, submit the location
    if (manualLocation.address && manualLocation.city && manualLocation.state && manualLocation.postalCode) {
      onLocationSelect({
        lat: parseFloat(coords.lat.toFixed(6)),
        lng: parseFloat(coords.lng.toFixed(6)),
        address: manualLocation.address,
        street: manualLocation.street,
        city: manualLocation.city,
        district: manualLocation.district || manualLocation.city,
        state: manualLocation.state,
        postalCode: manualLocation.postalCode,
        country: "India",
      });
    }
  };

  const handleManualLocationSubmit = () => {
    const { address, city, state, postalCode, lat, lng, street } = manualLocation;
    
    // Validate required fields
    if (!address || !city || !state || !postalCode) {
      return;
    }

    // Parse coordinates if provided
    const parsedLat = lat ? parseFloat(lat) : 0;
    const parsedLng = lng ? parseFloat(lng) : 0;

    onLocationSelect({
      lat: parsedLat,
      lng: parsedLng,
      address,
      street: street || "",
      city,
      district: manualLocation.district || city,
      state,
      postalCode,
      country: "India",
    });
    
    setShowManualInput(false);
  };

  return (
    <>
      {/* Modal for Map Selection */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Select Business Location on Map"
      >
        <DeliveryMap
          mode="business"
          onLocationSelect={handleMapLocationSelect}
        />
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
                Enter your business address and optionally select coordinates on map
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowManualInput(true)}
              className="flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              <MapPin size={20} />
              Enter Address Details
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMapModal(true)}
              className="flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
            >
              <MapIcon size={20} />
              Select on Map (Optional)
            </motion.button>
          </div>

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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Complete Address *
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

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Street/Area (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter street or area"
                      value={manualLocation.street}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      City *
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
                      District (Optional)
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
                      State *
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit postal code"
                      value={manualLocation.postalCode}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          postalCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Coordinates (Optional - select on map or enter manually)
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Click "Select on Map" button above
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Latitude (e.g., 22.3072)"
                        value={manualLocation.lat}
                        onChange={(e) =>
                          setManualLocation((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Longitude (e.g., 73.1812)"
                        value={manualLocation.lng}
                        onChange={(e) =>
                          setManualLocation((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Coordinates are optional. You can select them on the map or leave empty.
                    </p>
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
              {selectedLocation.street && (
                <p className="text-sm text-green-600 mt-1">
                  {selectedLocation.street}
                </p>
              )}
              {selectedLocation.city && (
                <p className="text-sm text-green-600 mt-1">
                  📍 {selectedLocation.city}, {selectedLocation.state} - {selectedLocation.postalCode}
                </p>
              )}
              {selectedLocation.lat !== 0 && selectedLocation.lng !== 0 && (
                <p className="text-xs text-green-600 mt-1 font-mono">
                  Coordinates: {selectedLocation.lat}, {selectedLocation.lng}
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
                <AlertCircle size={16} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernSellerForm;