import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, Tag } from "lucide-react";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { cities,categories } from "../../../assets/assets";
import { translateText } from "../../../utils/translateService";
import { useSelector } from "react-redux";
const DeletedBusinesses = () => {
  const [cityDropdown, setCityDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [businesses, setBusinesses] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const dropdownRef = useRef(null);
  const handleSellerClick = (seller) => {
    setSelectedSeller(seller);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCityDropdown(false);
        setCategoryDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { language } = useSelector((state) => state.user);
  
  const fetchAllBusinesses = async () => {
    try {
      const { data } = await axiosClient.get("/admin/api/alldeletedbusinesses");
      console.log(data);
  
      if (data?.success) {
        const businessesWithTranslatedCities = await Promise.all(
          data.message.businesses.map(async (business) => ({
            ...business,
            city: await translateText(business.city, language),
          }))
        );
        setBusinesses(businessesWithTranslatedCities);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    fetchAllBusinesses();
  }, [language]);


  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredSellers = businesses.filter((business) => {
    const cityMatch = selectedCity === "" || business.city === selectedCity;
    const categoryMatch = selectedCategory === "All" || 
                          business.categoryOfBusiness.toLowerCase() === selectedCategory.toLowerCase();
    return cityMatch && categoryMatch;
  });
  

  const handleCityDropdownClick = () => {
    setCityDropdown(!cityDropdown);
    setCategoryDropdown(false);
  };
  const handleCategoryDropdownClick = () => {
    setCategoryDropdown(!categoryDropdown);
    setCityDropdown(false);
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedSellers = filteredSellers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


 

  return (
    <div  className="min-h-[800px] overflow-y-auto bg-gray-100 p-6  flex flex-col gap-6">
      {/* Filter Section */}
      <div ref={dropdownRef} className="flex flex-col md:flex-row mx-auto lg:mx-0 mt-10 md:mt-0 gap-4 mb-2">
        {/* City Dropdown with Search */}
        <div className="relative">
          <button
            className="flex items-center text-gray-700 font-medium px-4 py-2 border border-gray-300 rounded-lg bg-white gap-2 w-80 "
            onClick={handleCityDropdownClick}
          >
            <MapPin size={18} className="text-black " />{" "}
            {selectedCity || "Select City"}
            <ChevronDown size={18} className="absolute right-3" />
          </button>
          {cityDropdown && (
            <div className="absolute bg-white shadow-md rounded-lg  lg:w-98 mt-2 w-72 p-2 z-10 h-64 overflow-y-auto">
              <input
                type="text"
                placeholder="Search city..."
                className="w-full p-2 mb-2 border rounded text-gray-700"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                autoFocus
              />
              <ul>
                {filteredCities.map((city, index) => (
                  <li
                    key={index}
                    className="p-2 flex  items-center gap-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdown(false);
                      setCitySearch("");
                    }}
                  >
                    <MapPin size={16} className="text-blue-600" /> {city}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Category Dropdown with Search */}
        <div className="relative">
          <button
            className="flex items-center text-gray-700 font-medium px-4 py-2 border border-gray-300 rounded-lg bg-white gap-2  w-72 lg:w-80"
            onClick={handleCategoryDropdownClick}
          >
            <Tag size={18} className="text-black" />{" "}
            {selectedCategory || "Select Category"}
            <ChevronDown size={18} className="absolute right-3" />
          </button>
          {categoryDropdown && (
            <div className="absolute bg-white shadow-md rounded-lg mt-2  lg:w-98  w-72 p-2 z-10 h-64 overflow-y-auto">
              <input
                type="text"
                placeholder="Search category..."
                className="w-full p-2 mb-2 border rounded text-gray-700"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                autoFocus
              />
              <ul>
                {filteredCategories.map((category, index) => (
                  <li
                    key={index}
                    className="p-2 flex  items-center gap-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryDropdown(false);
                      setCategorySearch("");
                    }}
                  >
                    <Tag size={16} className="text-blue-600" /> {category}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Total Sellers Count */}
      <div className="bg-white shadow-lg  p-4 rounded-xl w-fit text-lg font-bold text-center">
        Total Deleted Businesses: {filteredSellers.length}
      </div>

      {/* Seller Details Table */}
      <div className=" bg-gray-100   flex flex-col gap-6">
      <div className="bg-white shadow-lg p-6  overflow-x-auto  rounded-xl w-full">
        <h2 className="text-xl font-bold mb-4">Deleted Seller Details</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Index</th>
              <th className="border p-2">Seller Name</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Shop Category</th>
              <th className="border p-2">Detail</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {displayedSellers.map((seller, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border hover:bg-gray-100"
              >
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">
                  {seller.sellerDetails?.username}
                </td>
                <td className="border p-2 text-center">{seller.city}</td>
                <td className="border p-2 text-center">
                  {seller.categoryOfBusiness}
                </td>
                <td className="border p-2 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSellerClick(seller)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Detail
                  </motion.button>
                </td>
                <td className="border p-2 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const email = seller.sellerDetails.email;
                      if (email) {
                        window.location.href = `https://mail.google.com/mail/?view=cm&to=${email}`;
                      } else {
                        toast.error("No email found!");
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Email
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredSellers.length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center mt-4 cursor-pointer"
          previousLinkClassName="bg-gray-300 px-3 py-1 rounded mr-2"
          nextLinkClassName="bg-gray-300 px-3 py-1 rounded ml-2"
          disabledClassName="opacity-50"
          activeClassName="bg-blue-500 mx-2 text-white px-3  rounded"
        />
      </div>
    </div>

      {selectedSeller && (
        <>
          <div
            className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-40"
            onClick={() => setSelectedSeller(null)}
          ></div>

          <motion.div
            className="fixed bg-white shadow-2xl p-6 rounded-lg w-[90%] sm:w-[450px] max-w-[90%] z-50 lg:right-[25%] "
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              minHeight: "150px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              Seller Details
            </h2>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "65vh", wordBreak: "break-word" }}
            >
              <p className="text-gray-700">
                <strong>Business Name:</strong> {selectedSeller.businessName}
              </p>
              <p className="text-gray-700">
                <strong>Name:</strong> {selectedSeller.sellerDetails.username}
              </p>
              <p className="text-gray-700">
                <strong>City:</strong> {selectedSeller.city}
              </p>
              <p className="text-gray-700">
                <strong>Shop Category:</strong> {selectedSeller.categoryOfBusiness}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {selectedSeller.sellerDetails.email || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Product Count:</strong> {selectedSeller.productCount}
              </p>
              <p className="text-gray-700">
                <strong>is Active :</strong> {selectedSeller.isActive=== true ? "True" : "False"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DeletedBusinesses;
