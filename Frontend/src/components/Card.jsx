import { motion } from "framer-motion";
import { Star, MapPin, ShoppingBag, Clock, Heart } from "lucide-react";

const Card = ({ businessList = [] }) => {
  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return businessList.map((business, index) => (
    <motion.div
      key={business._id || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer border border-gray-100 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={business.image}
          alt={business.businessName}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Heart size={16} className="text-red-500" />
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {business.businessName}
        </h3>

        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <ShoppingBag size={14} className="mr-2 text-blue-500" />
          {business.categoryOfBusiness}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(business.rating || 5)}
            <span className="text-sm text-gray-600 ml-2">({business.reviews || 150})</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            {business.distance || "1.2 km"}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <Clock size={14} className="mr-1 text-green-500" />
            Open Now
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  ));
};

export default Card;





//!===================================== 

// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const Card = ({ businessList = [] }) => {
//   const navigate = useNavigate();
//   console.log(businessList);

//   const renderStars = (count) => {
//     return Array(count)
//       .fill()
//       .map((_, i) => <span key={i}>⭐</span>);
//   };

//   return businessList.map((business, index) => (
//     <motion.div
//       key={index}
//       onClick={() => {
//         navigate(`/business/${business._id}`);
//         scrollTo(0, 0);
//       }}
//       className="relative p-5 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
//       whileHover={{
//         scale: 1.05,
//         boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
//       }}
//       transition={{ duration: 0.3 }}
//     >
//       <img
//         src={business.image}
//         alt={business.image}
//         className="w-full h-40 object-cover rounded-xl"
//       />
//       <h2 className="mt-4 text-lg text-black text-center font-bold">
//         {business.businessName}
//       </h2>
//       <p className="text-sm text-center md:text-lg text-black mt-2">
//         {business.categoryOfBusiness}
//       </p>

//       <motion.div
//         className="flex items-center justify-center gap-1"
//         whileHover={{ scale: 1.05 }}
//         transition={{ duration: 0.2 }}
//       >
//         {renderStars(5)}
//       </motion.div>

//       <div className="flex items-center justify-between mt-3">
//         <span className="text- font-medium">
//           {business.city} | {business?.distance || "2.4 km"}
//         </span>
//       </div>
//     </motion.div>
//   ));
// };

// export default Card;
