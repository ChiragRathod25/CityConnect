import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import axiosClient from "../utils/axiosClient";
import { getItem } from "../utils/localStorageManager";

const BusinessList = ({ category }) => {
  const [businesses, setBusinesses] = useState([]);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const city = getItem("city");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await axiosClient.get(`/api/city/${city}/${category}`);

        if (!data?.success) {
          console.warn("No businesses found.");
          setBusinesses([]);
        } else {
          console.log("Businesses fetched successfully:", data?.message?.businesses);
          setBusinesses(data?.message?.businesses);
        }
      } catch (error) {
        console.log("Error fetching businesses:", error);
        setBusinesses([]);
      }
    };

    fetchBusinesses();
  }, [category, city]);

  useEffect(() => {
    if (businesses.length > 0 && !isLocationFetched) {
      getUserLocationAndCalculateDistances();
      setIsLocationFetched(true);
    }
  }, [businesses]); // ✅ Runs only after businesses are fetched

  const getUserLocationAndCalculateDistances = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        try {
          console.log(businesses);

          const response = await axiosClient.post("/location", {
            userLatitude,
            userLongitude,
            businessLocations: businesses
              .filter(business => business.businessLocation?.latitude && business.businessLocation?.longitude)
              .map(business => ({
                id: business._id,
                latitude: business.businessLocation.latitude,
                longitude: business.businessLocation.longitude,
              })),
          });

          let updatedBusinesses = businesses.map(business => {
            const distanceInfo = response.data.find(item => item.id === business._id);
            return { ...business, distance: distanceInfo ? distanceInfo.distance : "N/A" };
          });

          const sortedBusinesses = [...updatedBusinesses].sort((a, b) => {
            const getNumericDistance = (distance) => {
              if (distance === "N/A") return Infinity; // Move "N/A" to the bottom
              return parseFloat(distance); // Extract numeric value from "14.9 km"
            };

            return getNumericDistance(a.distance) - getNumericDistance(b.distance);
          });
          console.log(sortedBusinesses);
          

          setBusinesses(sortedBusinesses);

        } catch (error) {
          console.error("Error calculating distances:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 capitalize">
        {category} Businesses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businesses.length > 0 ? (
          <Card businessList={businesses} />
        ) : (
          <p className="text-center text-gray-500">
            No businesses found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

// ✅ Props Validation
BusinessList.propTypes = {
  category: PropTypes.string.isRequired, // Must be a string and is required
};

export default BusinessList;
