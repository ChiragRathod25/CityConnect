import { motion } from "framer-motion";
import { Star } from "lucide-react"; // Assuming you have an icon library like Lucide for stars
import { toast } from "react-toastify";
import axiosClient from "../../utils/axiosClient";
import { translateText } from "../../utils/translateService";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
const BusinessDescription = ({ business }) => {
  const { language } = useSelector((state) => state.user);
  const [translatedBusiness, setTranslatedBusiness] = useState(business);

  useEffect(() => {
    const translateBusinessDetails = async () => {
      const translatedName = await translateText(business.businessName, language);
      const translatedDescription = await translateText(business.description, language);
      const translatedCity = await translateText(business.city, language);
      const translatedCategory = await translateText(business.categoryOfBusiness, language);
      const translatedFacility = await translateText(business.facility, language);

      setTranslatedBusiness({
        ...business,
        businessName: translatedName,
        description: translatedDescription,
        city: translatedCity,
        categoryOfBusiness: translatedCategory,
        // facility: translatedFacility,
      });
    };

    translateBusinessDetails();
  }, [business, language]);

  const handleBookService = async (req, res) => {
    try {
      const { data } = await axiosClient.post("/service/create", {
        businessId: business._id,
      });
      console.log(data);
      if (data.success) {
        toast.success("Booking Done !");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={translatedBusiness.image || "../../assets/userlogo.jpg"}
        alt={translatedBusiness.businessName}
        className="md:w-64 md:h-64 w-48 h-48 mx-auto rounded-2xl mt-3 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{translatedBusiness.businessName}</h2>
        <p className="text-gray-700 mb-4">{translatedBusiness.description}</p>
  
        <div className="flex items-center mb-4">
          <span className="text-gray-700 font-semibold mr-2">Rating:</span>
          <div className="flex">{renderStars(translatedBusiness.rating)}</div>
        </div>
  
        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <strong>City:</strong> {translatedBusiness.city}
          </p>
          <p className="text-gray-700">
            <strong>Category:</strong> {translatedBusiness.categoryOfBusiness}
          </p>
          {/* <p className="text-gray-700"><strong>Address:</strong> {business.city}</p> */}
          <p className="text-gray-700">
            <strong>Facility:</strong> {translatedBusiness.facility}
          </p>
          {business.facility === "service" && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookService}
                className="text-white mt-2  bg-green-500 font-bold  px-4 mr-1 py-2 rounded-md transition-all"
              >
                Book a Service
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessDescription;
