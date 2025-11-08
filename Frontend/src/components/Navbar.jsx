import { useEffect, useState, useRef } from "react";
import { Menu, Search, ChevronDown, MapPin, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import databaseService from "@/services/database.services";
import { logout } from "@/slices/userSlice/authSlices";
import { useDispatch } from "react-redux";
import { GoogleTranslate } from ".";

const mockLogo = "/logoFinal.png";

const mockCities = [
  "Anand",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Mahesana",
  "Ghandhinagar",
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForLanguage, setIsOpenForLanguage] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Anand");
  const [selectLanguage, setSelectLanguage] = useState("English");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.userData);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleLogout = async () => {
    try {
      const response = await databaseService.logout().catch((error) => {
        console.error("Logout error:", error);
      });
      if (response?.success) {
        //clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Category", path: "/category" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contactus" },
    // ...(user?.role === "seller"
    //   ? [{ name: "My Business", path: "/mybusiness" }]
    //   : []),
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-5000 transition-all duration-500 ${
        isScrolled ? "px-4 pt-4" : "px-0 pt-0"
      }`}
    >
      <motion.nav
        ref={dropdownRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`bg-white border border-gray-200 shadow-xl transition-all duration-500 ${
          isScrolled
            ? "rounded-2xl mx-auto max-w-7xl shadow-2xl"
            : "rounded-none shadow-lg"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavLink to="/">
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
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <NavLink to={item.path} key={item.name}>
                  <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                  className="relative px-4 py-2 text-gray-800 font-semibold rounded-lg hover:text-black hover:shadow-lg transition-all duration-200 group overflow-hidden hover:shadow-gray-300 hover:bg-[#e9ecef]"
                  style={{ caretColor: "transparent" }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-slate-800 via-gray-900 to-black opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
                    initial={{ scale: 0, borderRadius: "50%" }}
                    whileHover={{ scale: 1, borderRadius: "8px" }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>
                </motion.a>
                   </NavLink>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
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
                          <Search
                            size={16}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Search your city..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-white shadow-sm cursor-text text-gray-900 placeholder-gray-500 font-medium"
                            style={{ caretColor: "#1f2937" }}
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
                              x: 8,
                            }}
                            className="w-full text-left px-5 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 flex items-center space-x-3 group"
                            onClick={() => {
                              setSelectedCity(city);
                              setCityDropdown(false);
                              setCitySearch("");
                            }}
                          >
                            <MapPin
                              size={14}
                              className="text-gray-400 group-hover:text-gray-600 transition-colors"
                            />
                            <span className="font-medium">{city}</span>
                          </motion.button>
                        ))}
                        {filteredCities.length === 0 && (
                          <div className="px-5 py-8 text-center text-gray-500">
                            <MapPin
                              size={24}
                              className="mx-auto mb-2 opacity-50"
                            />
                            <p>No cities found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-gray-50 rounded-xl p-1">
                <GoogleTranslate />
              </div>

              {/* Profile Icon (only show if logged in) */}
              <div className="flex items-center">
                {isLoggedIn && (
                  <NavLink
                    to={
                      user.role == "seller"
                        ? "/businessman-profile"
                        : "user-profile"
                    }
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center border border-gray-200 sm:space-x-2 px-4 py-2 bg-gray-50 backdrop-blur-sm text-gray-900 rounded-xl hover:bg-gray-100  font-medium"
                    >
                      <User size={18} />
                      <span className="hidden sm:inline">Profile</span>
                    </motion.button>
                  </NavLink>
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
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
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
                <div className="py-8 space-y-6 bg-white backdrop-blur-xl rounded-2xl mt-2 sm:mt-4 mb-6 border border-gray-200 overflow-hidden">
                  {/* Mobile Dropdowns Section - First Priority */}
                  <div className="px-6 space-y-4">
                    {/* Mobile City Selector */}
                    <div className="sm:hidden w-full">
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
                                <Search
                                  size={16}
                                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                  type="text"
                                  placeholder="Search your city..."
                                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-white shadow-sm cursor-text text-gray-900 placeholder-gray-500 font-medium"
                                  style={{ caretColor: "#1f2937" }}
                                  value={citySearch}
                                  onChange={(e) =>
                                    setCitySearch(e.target.value)
                                  }
                                  autoFocus
                                />{" "}
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
                                    x: 8,
                                  }}
                                  className="w-full text-left px-5 py-4 text-gray-700 hover:text-gray-900 flex items-center space-x-3 transition-all duration-200 group"
                                  onClick={() => {
                                    setSelectedCity(city);
                                    setCityDropdown(false);
                                    setCitySearch("");
                                  }}
                                >
                                  <MapPin
                                    size={16}
                                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                                  />
                                  <span className="font-medium">{city}</span>
                                </motion.button>
                              ))}
                              {filteredCities.length === 0 && (
                                <div className="px-5 py-8 text-center text-gray-500">
                                  <MapPin
                                    size={24}
                                    className="mx-auto mb-2 opacity-50"
                                  />
                                  <p>No cities found</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

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
                        className="block px-5 py-4 text-gray-800 text-center font-semibold hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 bg-gray-100 border border-transparent hover:border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;