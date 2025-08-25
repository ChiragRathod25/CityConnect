import { useEffect, useState, useRef } from "react";
import { Menu, Search, ChevronDown, MapPin, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

// Mock data and functions for demo
const mockLogo = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop&crop=center";
const mockCities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
const mockLanguages = ["English", "Hindi", "Gujarati"];

const Navbar = ({ isAuthenticated = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForLanguage, setIsOpenForLanguage] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("New York");
  const [selectLanguage, setSelectLanguage] = useState("English");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mock user data
  const user = { name: "John Doe", role: "seller" };

  const handleLanguageChange = async (lang) => {
    setSelectLanguage(lang);
    setIsOpenForLanguage(false);
  };

  const handleLanguageDropdownClick = () => {
    setIsOpenForLanguage(!isOpenForLanguage);
    setCityDropdown(false);
  };
  
  const handleCityDropdownClick = () => {
    setCityDropdown(!cityDropdown);
    setIsOpenForLanguage(false);
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenForLanguage(false);
        setCityDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredCities = mockCities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Category", path: "/category" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    ...(user?.role === "seller" ? [{ name: "My Business", path: "/mybusiness" }] : [])
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-5000 transition-all duration-500 ${
      isScrolled ? 'px-4 pt-4' : 'px-0 pt-0'
    }`}>
      <motion.nav 
        ref={dropdownRef} 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`bg-white border border-gray-200 shadow-xl transition-all duration-500 ${
          isScrolled 
            ? 'rounded-2xl mx-auto max-w-7xl shadow-2xl' 
            : 'rounded-none shadow-lg'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={mockLogo}
                alt="NearbyGo Logo"
                className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                CityConnect
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-gray-900 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm"
                onClick={handleLanguageDropdownClick}
              >
                <span className="text-gray-800 font-semibold">{selectLanguage}</span>
                <motion.div
                  animate={{ rotate: isOpenForLanguage ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isOpenForLanguage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-3 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 w-40 py-2 z-50 overflow-hidden"
                  >
                    {mockLanguages.map((lang, index) => (
                      <motion.button
                        key={lang}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: "#f3f4f6",
                          x: 8
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium group"
                        onClick={() => handleLanguageChange(lang)}
                      >
                        <span className="group-hover:font-semibold transition-all">{lang}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Dropdown */}
            <div className="hidden sm:block relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-sm font-medium text-gray-700 min-w-[140px] shadow-sm"
                onClick={handleCityDropdownClick}
              >
                <MapPin size={16} className="text-gray-600 flex-shrink-0" />
                <span className="truncate">{selectedCity}</span>
                <motion.div
                  animate={{ rotate: cityDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
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
                    className="absolute top-full mt-3 right-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 w-72 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search your city..."
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-white shadow-sm"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-2">
                      {filteredCities.map((city, index) => (
                        <motion.button
                          key={city}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ 
                            backgroundColor: "#f3f4f6",
                            x: 8
                          }}
                          className="w-full text-left px-5 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 flex items-center space-x-3 group"
                          onClick={() => {
                            setSelectedCity(city);
                            setCityDropdown(false);
                            setCitySearch("");
                          }}
                        >
                          <MapPin size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                          <span className="font-medium">{city}</span>
                        </motion.button>
                      ))}
                      {filteredCities.length === 0 && (
                        <div className="px-5 py-8 text-center text-gray-500">
                          <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                          <p>No cities found</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile or Login */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <NavLink to='/profile'>
                  <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </motion.button>
                </NavLink>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Login
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="xl:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-gray-100 rounded-xl border border-gray-200 hover:bg-gray-200 hover:shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={28} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden"
            >
              <div className="py-8 space-y-6 bg-white backdrop-blur-xl rounded-2xl mt-4 border border-gray-200 shadow-2xl overflow-hidden">
                {/* Mobile Navigation Links */}
                <div className="space-y-3 px-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="block px-5 py-4 text-gray-700 font-semibold hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile City Selector */}
                <div className="px-6 sm:hidden">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300 shadow-sm"
                    onClick={() => setCityDropdown(!cityDropdown)}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin size={20} className="text-gray-600" />
                      <span className="font-semibold">{selectedCity}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: cityDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {cityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg"
                      >
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search your city..."
                              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white shadow-sm"
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCities.map((city, index) => (
                            <motion.button
                              key={city}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ 
                                backgroundColor: "#f3f4f6",
                                x: 8
                              }}
                              className="w-full text-left px-5 py-4 text-gray-700 hover:text-gray-900 flex items-center space-x-3 transition-all duration-200 group"
                              onClick={() => {
                                setSelectedCity(city);
                                setCityDropdown(false);
                                setCitySearch("");
                              }}
                            >
                              <MapPin size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                              <span className="font-medium">{city}</span>
                            </motion.button>
                          ))}
                          {filteredCities.length === 0 && (
                            <div className="px-5 py-8 text-center text-gray-500">
                              <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                              <p>No cities found</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    </div>
)
}

export default Navbar;

//! ==========================================


// /* eslint-disable no-unused-vars */
// import { useEffect, useState,useRef  } from "react";
// import { Menu, Search, ChevronDown, MapPin, User } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setCity, setCategory, setLanguage, setUser } from "../features/userSlice.js";
// import { getItem, setItem } from "../utils/localStorageManager.js";
// import { cities, languages, categories, logo } from "../assets/assets.js";
// import { motion } from "framer-motion";
// import { translateText } from "../utils/translateService.js";

// const Navbar = ({ isAuthenticated }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpenForLanguage, setIsOpenForLanguage] = useState(false);
//   const [cityDropdown, setCityDropdown] = useState(false);
//   const [citySearch, setCitySearch] = useState("");
//   const dispatch = useDispatch();
//   const selectedCity = getItem("city");
//   const language = getItem("language");
//   const [selectLanguage, setSelectLanguage] = useState(language || "English");
//   const { user } = useSelector((state) => state.user);
//   const dropdownRef = useRef(null);
//   const languages = ["English", "Hindi", "Gujarati"];
  
 
//   const handleLanguageChange = async (lang) => {
//     setSelectLanguage(lang);
//     setItem("language", lang);
//     dispatch(setLanguage(lang));
  
//     // Translate dynamic data from backend
//     if (user?.name) {
//       const translatedName = await translateText(user.name, lang);
//       setUser({ ...user, name: translatedName });
//     }
//   };
//   const handleLanguageDropdownClick = () => {
//     setIsOpenForLanguage(!isOpenForLanguage);
//     setCityDropdown(false);
//   };
  
//   const handleCityDropdownClick = () => {
//     setCityDropdown(!cityDropdown);
//     setIsOpenForLanguage(false);
//   };
 
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpenForLanguage(false);
//         setCityDropdown(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const filteredCities = cities.filter((city) =>
//     city.toLowerCase().includes(citySearch.toLowerCase())
//   );

 
//   return (
//     <nav ref={dropdownRef} className="bg-[#FEF6EF] p-4 shadow-lg">
//       <div className="container mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <div className="text-gray-600 text-xl font-bold flex items-center gap-2 cursor-pointer">
//           <img
//             src={logo}
//             alt="NearbyGo Logo" 
//             onClick={() => navigate("/")}
//             className="h-10 w-auto rounded-2xl ml-2"
//           />
//         </div>

//         {/* Desktop Menu */}
//         <ul className="hidden xl:flex space-x-6 text-gray-600 text-md font-medium">
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive ? "text-black font-semibold" : "hover:text-gray-800"
//               }
//             >
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/category"
//               className={({ isActive }) =>
//                 isActive ? "text-black font-semibold" : "hover:text-gray-800"
//               }
//             >
//               Category
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 isActive ? "text-black font-semibold" : "hover:text-gray-800"
//               }
//             >
//               About
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/contact"
//               className={({ isActive }) =>
//                 isActive ? "text-black font-semibold" : "hover:text-gray-800"
//               }
//             >
//               Contact Us
//             </NavLink>
//           </li>
//           {user !== null && user?.role === "seller" && (
//             <li>
//               <NavLink
//                 to="/mybusiness"
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 My Business
//               </NavLink>
//             </li>
//           )}
//         </ul>

//         {/* Language Selector */}
//         <div className="relative  ">
//           <button
//             className="flex items-center text-gray-700 font-medium px-3 py-1 border border-gray-300 rounded-sm bg-white gap-2"
//             onClick={handleLanguageDropdownClick}
//           >
//             {language} <ChevronDown size={18} className="ml-2" />
//           </button>
//           {isOpenForLanguage && (
//             <div className="absolute bg-white shadow-md rounded-sm mt-2 w-32 p-2 z-10">
//               <ul>
//                 {languages.map((lang, index) => (
//                   <li
//                     key={index}
//                     className="p-2 flex  items-center gap-2 hover:bg-[#FCE2CE] cursor-pointer text-gray-700"
//                     onClick={() => {
//                       handleLanguageChange(lang);
//                       dispatch(setLanguage(lang));
//                       setIsOpenForLanguage(false);
//                     }}
//                   >
//                     {lang}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* City Dropdown */}

//         <div className="relative hidden  md:flex">
//           <button
//             className="flex md:w-54 items-center text-gray-700 font-medium px-3 py-1 border border-gray-300 rounded-sm bg-white gap-2"
//             onClick={handleCityDropdownClick}
//           >
//             <MapPin size={18} className="text-gray-600" />
//             {selectedCity}
//             <ChevronDown size={18} className="absolute right-3" />
//           </button>
//           {cityDropdown && (
//             <div className="absolute  mt-10 bg-white shadow-md rounded-sm  w-full p-2 z-10">
//               <input
//                 type="text"
//                 placeholder="Search City"
//                 className="w-full p-1 mb-2 border rounded text-gray-700"
//                 value={citySearch}
//                 onChange={(e) => setCitySearch(e.target.value)}
//                 autoFocus
//               />
//               <ul>
//                 {filteredCities.map((city, index) => (
//                   <li
//                     key={index}
//                     className="p-2 flex  items-center gap-2 hover:bg-[#FCE2CE] cursor-pointer text-gray-700"
//                     onClick={() => {
//                       dispatch(setCity(city));
//                       setCityDropdown(false);
//                       setCitySearch("");
//                     }}
//                   >
//                     <MapPin size={16} className="text-black" /> {city}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

       

       

//         {/* Profile or Login Button */}
//         <div className="lg:flex">
//           {isAuthenticated ? (
//             <User
//               onClick={() => navigate("/profile")}
//               className="text-gray-600 cursor-pointer mr-2"
//               size={32}
//             />
//           ) : (
//             <NavLink to="/login">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="text-gray-600    bg-gray-300 font-bold px-4 mr-1 py-2 rounded-md transition-all"
//               >
//                 Login
//               </motion.button>
//             </NavLink>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="xl:hidden text-black"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <Menu size={32} />
//         </button>
//       </div>

      

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="xl:hidden bg-[#FAF6F3] text-center text-gray-600 p-6 space-y-6 rounded-lg shadow-lg mt-2">
//           <ul className="space-y-4 text-lg font-medium">
//             <li>
//               <NavLink
//                 to="/"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/category"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 Category
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/about"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 About
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/contact"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 Contact Us
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/myBusiness"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? "text-black font-semibold" : "hover:text-gray-800"
//                 }
//               >
//                 My Business
//               </NavLink>
//             </li>
//           </ul>

        
         

         

//           {/* Mobile City Dropdown */}
//           <button
//             className="md:hidden flex items-center text-gray-700 font-medium p-2 border border-gray-300 rounded-lg bg-white gap-2 w-full"
//             onClick={() => setCityDropdown(!cityDropdown)}
//           >
//             <MapPin size={18} /> {selectedCity}{" "}
//             <ChevronDown size={18} className="ml-auto" />
//           </button>

//           {cityDropdown && (
//             <div className="bg-white rounded-sm mt-1 w-full p-2 z-10">
//               {/* Search Bar inside the dropdown */}
//               <input
//                 type="text"
//                 placeholder="Search City"
//                 className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
//                 value={citySearch}
//                 onChange={(e) => setCitySearch(e.target.value)}
//                 autoFocus
//               />

//               <ul className="mt-2 max-h-40 overflow-y-auto">
//                 {filteredCities.map((city, index) => (
//                   <li
//                     key={index}
//                     className="p-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer text-gray-700"
//                     onClick={() => {
//                       dispatch(setCity(city));
//                       setCityDropdown(false);
//                       setCitySearch("");
//                       // setIsOpen(false);
//                     }}
//                   >
//                     <MapPin size={16} className="text-black" /> {city}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
