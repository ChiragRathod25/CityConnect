import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TopBar = ({ onMenuClick, notificationsCount }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Hamburger Icon */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuClick} 
        className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Site Title */}
      <motion.h1
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="text-xl font-bold cursor-pointer text-gray-800 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2"
        onClick={() => navigate("/")}
      >
        <img
          src="/logoFinal.png"
          alt="CityConnect Logo"
          className="h-8 w-8 rounded-lg object-cover"
        />
        <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          CityConnect
        </span>
      </motion.h1>

      {/* Notifications */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
        onClick={() => navigate("/notification")}
      >
        <Bell className="w-6 h-6" />
        {notificationsCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg"
          >
            {notificationsCount > 99 ? '99+' : notificationsCount}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TopBar;