import React from "react";
import databaseService from "@/services/database.services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function AllBusinesses() {
  const [businesses, setBusinesses] = useState([]);

  const navigate=useNavigate();
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await databaseService.getAllBusinesses();
        console.log("Fetched businesses:", response.data);
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);


  const handleClick = (businessId) => {
    console.log("Business ID clicked:", businessId);
    // You can add more logic here, such as navigating to a business detail page
    navigate(`/dashboard/business/${businessId}`);
  };

  return (
    <div>
      <h1>All Businesses</h1>
      <ul>
          {businesses.map((business) => (
            <li key={business._id} onClick={() => handleClick(business._id)}>
              {business.name}
            </li>
          ))}
        </ul>
    </div>
  );
}

export default AllBusinesses;
