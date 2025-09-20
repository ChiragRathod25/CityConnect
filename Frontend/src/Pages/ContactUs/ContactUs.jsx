import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ChevronDown, X } from 'lucide-react';

const ContactUsPage = () => {
  const [selectedCenter, setSelectedCenter] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Sample centers data with real coordinates
  const centers = [
    {
      id: 1,
      name: 'Mumbai Center',
      address: '123 Business District, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
      phone: '+91 98765 43210',
      email: 'mumbai@company.com',
      coordinates: [19.0596, 72.8656]
    },
    {
      id: 2,
      name: 'Delhi Center',
      address: '456 Corporate Hub, Connaught Place, New Delhi, Delhi 110001',
      phone: '+91 98765 43211',
      email: 'delhi@company.com',
      coordinates: [28.6315, 77.2167]
    },
    {
      id: 3,
      name: 'Bangalore Center',
      address: '789 Tech Park, Electronic City, Bangalore, Karnataka 560100',
      phone: '+91 98765 43212',
      email: 'bangalore@company.com',
      coordinates: [12.8456, 77.6603]
    },
    {
      id: 4,
      name: 'Chennai Center',
      address: '321 IT Corridor, OMR, Chennai, Tamil Nadu 600096',
      phone: '+91 98765 43213',
      email: 'chennai@company.com',
      coordinates: [12.8642, 80.2049]
    }
  ];

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      // Load Leaflet dynamically
      const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
      
      if (mapRef.current && !mapInstanceRef.current) {
        // Create map
        mapInstanceRef.current = L.map(mapRef.current, {
          center: centers[selectedCenter].coordinates,
          zoom: 13,
          zoomControl: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add marker with custom styling
        const marker = L.marker(centers[selectedCenter].coordinates, {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `
              <div class="animate-pulse bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-slate-800 text-lg mb-2">${centers[selectedCenter].name}</h3>
              <p class="text-sm text-gray-600 mb-2">${centers[selectedCenter].address}</p>
              <div class="space-y-1">
                <p class="text-sm font-medium text-green-600">${centers[selectedCenter].phone}</p>
                <p class="text-sm font-medium text-blue-600">${centers[selectedCenter].email}</p>
              </div>
            </div>
          `);
      }
    };

    // Load CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when center changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Import Leaflet dynamically again for updates
      import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js').then((L) => {
        const map = mapInstanceRef.current;
        
        // Smooth pan to new location
        map.flyTo(centers[selectedCenter].coordinates, 13, {
          duration: 1.5
        });
        
        // Remove existing markers
        map.eachLayer((layer) => {
          if (layer.options && layer.options.icon) {
            map.removeLayer(layer);
          }
        });
        
        // Add new marker with animation
        setTimeout(() => {
          const marker = L.marker(centers[selectedCenter].coordinates, {
            icon: L.divIcon({
              className: 'custom-marker',
              html: `
                <div class="animate-bounce bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              `,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          })
            .addTo(map)
            .bindPopup(`
              <div class="p-3 min-w-[200px]">
                <h3 class="font-bold text-slate-800 text-lg mb-2">${centers[selectedCenter].name}</h3>
                <p class="text-sm text-gray-600 mb-2">${centers[selectedCenter].address}</p>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-green-600">${centers[selectedCenter].phone}</p>
                  <p class="text-sm font-medium text-blue-600">${centers[selectedCenter].email}</p>
                </div>
              </div>
            `)
            .openPopup();
        }, 500);
      });
    }
  }, [selectedCenter]);

  const validateForm = () => {
    const { name, email, phone, subject, message } = formData;
    
    if (!name.trim()) return { isValid: false, message: 'Name is required' };
    if (!email.trim()) return { isValid: false, message: 'Email is required' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, message: 'Please enter a valid email' };
    }
    if (!phone.trim()) return { isValid: false, message: 'Phone number is required' };
    if (!/^\+?[\d\s-()]{10,}$/.test(phone)) {
      return { isValid: false, message: 'Please enter a valid phone number' };
    }
    if (!subject.trim()) return { isValid: false, message: 'Subject is required' };
    if (!message.trim()) return { isValid: false, message: 'Message is required' };
    
    return { isValid: true, message: '' };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      setFormStatus({ type: 'error', message: validation.message });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Simulate API call
    setTimeout(() => {
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formStatus.type === 'error') {
      setFormStatus({ type: '', message: '' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-8 -left-8 w-96 h-96 bg-indigo-500/10 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We'd love to hear from you. Contact us to learn more about our services 
            or visit one of our locations worldwide.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 py-10 px-5"
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2 
              className="text-3xl text-center sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8"
              animate={floatAnimation}
            >
              Send us a Message
            </motion.h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-slate-700 font-semibold mb-3">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Your full name"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-slate-700 font-semibold mb-3">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-slate-700 font-semibold mb-3">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="+91 98765 43210"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-slate-700 font-semibold mb-3">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="How can we help?"
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-slate-700 font-semibold mb-3">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
                  placeholder="Tell us about your project or inquiry..."
                />
              </motion.div>

              <AnimatePresence>
                {formStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
                      formStatus.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {formStatus.type === 'success' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </motion.div>
                    <span className="font-medium">{formStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isSubmitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white shadow-xl hover:shadow-2xl'
                }`}
                whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <motion.div 
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Send className="h-6 w-6" />
                    </motion.div>
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Map and Centers */}
          <motion.div 
            className="space-y-8"
            variants={itemVariants}
          >
            {/* Modern Center Dropdown */}
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              style={{ zIndex: isDropdownOpen ? 40 : 10 }}
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">Our Locations</h3>
              
              <div className="relative z-50">
                <motion.button
                  type="button"
                  className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-xl cursor-pointer flex items-center justify-between relative focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </motion.div>
                    <span className="font-semibold text-slate-700">{centers[selectedCenter].name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-lg border-2 border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        {centers.map((center, index) => (
                          <motion.div
                            key={center.id}
                            className={`px-5 py-4 cursor-pointer flex items-center space-x-3 transition-all duration-200 ${
                              selectedCenter === index 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedCenter(index);
                              setIsDropdownOpen(false);
                            }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{center.name}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Selected Center Info */}
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
              key={selectedCenter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex items-start space-x-4 mb-6">
                <motion.div
                  animate={floatAnimation}
                  className="bg-blue-100 p-3 rounded-full"
                >
                  <MapPin className="h-6 w-6 text-blue-600" />
                </motion.div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800">{centers[selectedCenter].name}</h4>
                  <p className="text-slate-600 mt-1">{centers[selectedCenter].address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="bg-green-100 p-2 rounded-full"
                  >
                    <Phone className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <span className="text-slate-700 font-medium group-hover:text-green-600 transition-colors">
                    {centers[selectedCenter].phone}
                  </span>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: -15, scale: 1.1 }}
                    className="bg-purple-100 p-2 rounded-full"
                  >
                    <Mail className="h-5 w-5 text-purple-600" />
                  </motion.div>
                  <span className="text-slate-700 font-medium group-hover:text-purple-600 transition-colors">
                    {centers[selectedCenter].email}
                  </span>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="bg-orange-100 p-2 rounded-full"
                  >
                    <Clock className="h-5 w-5 text-orange-600" />
                  </motion.div>
                  <span className="text-slate-700 font-medium group-hover:text-orange-600 transition-colors">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Real Leaflet Map */}
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 h-96"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div 
                ref={mapRef}
                className="w-full h-full rounded-2xl overflow-hidden border-2 border-slate-200"
                style={{ minHeight: '300px' }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-20"
          variants={containerVariants}
        >
          {[
            { icon: Phone, title: 'Call Us', desc1: '+91 98765 43210', desc2: 'Mon - Fri, 9AM - 6PM', color: 'green' },
            { icon: Mail, title: 'Email Us', desc1: 'hello@company.com', desc2: "We'll respond within 24h", color: 'blue' },
            { icon: MapPin, title: 'Visit Us', desc1: '4 Global Locations', desc2: 'Open Mon - Fri', color: 'purple' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="text-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10"
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div 
                className={`bg-${item.color}-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className={`h-10 w-10 text-${item.color}-600`} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-600 font-medium">{item.desc1}</p>
              <p className="text-slate-500">{item.desc2}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Close dropdown when clicking outside - removed as we handle it inside AnimatePresence */}
    </div>
  );
};

export default ContactUsPage;