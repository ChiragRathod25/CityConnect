import { X, User, Home, Grid3X3, Info, Phone, LogOut, MapPin, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { GoogleTranslate } from '.';

const SideDrawer = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth?.userData?.user);
  const navigate = useNavigate();
  
  // State for dropdowns
  const [cityDropdown, setCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Anand");
  
 const cities = [
  "Anand",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Mahesana",
  "Ghandhinagar",
];
  
  const links = {
    main: [
      {
        name: 'Home',
        to: '/',
        icon: Home
      },
      {
        name: 'Category', 
        to: '/category',
        icon: Grid3X3
      },
    ],
    secondary: [
      {
        name: 'About',
        to: '/about',
        icon: Info
      },
      {
        name: 'Contact Us',
        to: '/contactus',
        icon: Phone
      },
    ],
  };

  const handleLogout = () => {
    // Add your logout logic here
    onClose();
    navigate('/logout');
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40" 
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sliding Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 w-80 h-full bg-white border-r border-gray-200 shadow-2xl z-50 overflow-y-auto"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logoFinal.png"
                alt="CityConnect Logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                CityConnect
              </span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 hover:bg-gray-200 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Profile Section */}
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => {
                onClose();
                navigate('/user-profile');
              }}
            >
              <div className="relative">
                <img
                  src={
                    user?.avatar ||
                    `/avatar.webp` ||
                    'https://www.pngkey.com/png/full/115-1150420_avatar-png-pic-male-avatar-icon-png.png'
                  }
                  alt={user?.firstName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-gray-300 transition-all"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
              </div>
              <User className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              onClick={() => {
                onClose();
                navigate('/login');
              }}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Login to view profile
              </span>
            </motion.div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 overflow-y-auto w-full space-y-6">
          {/* Location & Language Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Preferences
            </h4>
            <div className="space-x-3 grid grid-cols-2">
              {/* City Selector */}
              <div className="relative">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">City</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-center flex items-center justify-between px-2 py-2  border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 bg-gray-50"
                  onClick={() => {
                    setCityDropdown(!cityDropdown);
                    setLanguageDropdown(false);
                  }}
                >
                  <span>{selectedCity}</span>
                  <motion.div
                    animate={{ rotate: cityDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {cityDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-xl border border-gray-200 z-50 overflow-hidden max-h-48 min-w-48 overflow-y-auto"
                    >
                      {cities.map((city, index) => (
                        <motion.button
                          key={city}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{
                            backgroundColor: "#f3f4f6",
                            x: 4,
                          }}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group"
                          onClick={() => {
                            setSelectedCity(city);
                            setCityDropdown(false);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin size={12} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            <span>{city}</span>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Selector */}
              <div className="relative ">
                <div className="flex items-center space-x-3 mb-2">
                  <Globe size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Language</span>
                </div>
                <AnimatePresence>
                   <GoogleTranslate/>
                </AnimatePresence>
              </div>
              </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Main Navigation */}
          <div>
            <h4 className="text-xs  font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Main
            </h4>
            <div className="grid grid-cols-2">
              {links.main.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex items-center space-x-2 px-1 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                    >
                      <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                      <span className="font-medium">{link.name}</span>
                      <motion.div
                        className="ml-auto w-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 group-hover:w-4 transition-all duration-300"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Secondary Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Support
            </h4>
            <div className="grid grid-cols-2">
              {links.secondary.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-1 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                    >
                      <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                      <span className="font-medium">{link.name}</span>
                      <motion.div
                        className="ml-auto w-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 group-hover:w-4 transition-all duration-300"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Logout Section */}
          {/* {user && (
            <>
              <div className="border-t border-gray-200"></div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                  <motion.div
                    className="ml-auto w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-4 transition-all duration-300"
                  />
                </button>
              </motion.div>
            </>
          )} */}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-16 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              CityConnect v1.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Made with care for your community
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SideDrawer;