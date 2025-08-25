import { useEffect, useState } from "react";
import BusinessDescription from "./BusinessDescription";
import ProductList from "./ProductList";
import ReviewSection from "./ReviewSection";
import axiosClient from "../../utils/axiosClient";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { translateText } from "../../utils/translateService";
import { useSelector } from "react-redux";

const BusinessPage = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [business, setBusiness] = useState(null);
  const { id } = useParams();
  console.log(business);
  const { language } = useSelector((state) => state.user);
  useEffect(() => {
    if (business) {
      const translateBusinessDetails = async () => {
        const translatedName = await translateText(business.businessName, language);
        const translatedDescription = await translateText(business.description, language);
        const translatedCity = await translateText(business.city, language);
        const translatedCategory = await translateText(business.categoryOfBusiness, language);
        const translatedFacility = await translateText(business.facility, language);

        setBusiness({
          ...business,
          businessName: translatedName,
          description: translatedDescription,
          city: translatedCity,
          categoryOfBusiness: translatedCategory,
          // facility: translatedFacility,
        });
      };

      translateBusinessDetails();
    }
  }, [language]);
  useEffect(() => {
    fetchSellerDetail();
    fetchReviews(); // Fetch reviews when component mounts
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axiosClient.get(`/review/get/${id}`); // Adjust endpoint as per your backend
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Failed to load reviews");
    }
  };

  const fetchSellerDetail = async () => {
    try {
      const { data } = await axiosClient(`/business/${id}`);
      console.log(data);
      if (data.success) {
        setBusiness(data.business);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Please try again later");
    }
  };

  const [products, setProducts] = useState([
    {
      id: 1,
      image: "../../assets/userlogo.jpg",
      title: "Laptop",
      price: "$1000",
    },
    {
      id: 2,
      image: "../../assets/nearbygo_logo.webp",
      title: "Smartphone",
      price: "$500",
    },
    {
      id: 3,
      image: "../../assets/nearbygo_logo.webp",
      title: "Tablet",
      price: "$700",
    },
  ]);
  const [reviews, setReviews] = useState([]);

  const handleAddReview = async (newReview) => {
    try {
      const { data } = await axiosClient.post(
        `/review/${business._id}/add`,
        newReview
      );
      if (data.success) {
        setReviews([...reviews, data.review]); // Add the saved review from backend
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (business && business.facility !== "product") {
      setActiveTab("description"); // Automatically switch to description
    }
  }, [business]);

  return (
    <div className="w-full min-h-screen">
      {/* Hamburger Menu Button for Mobile */}
      <button
        className={`md:hidden fixed ${
          isSidebarOpen ? "left-30" : "top-20"
        } z-50 p-2  text-black rounded font-bold text-2xl`}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className="flex w-full min-h-screen bg-gray-200 rounded-lg shadow-lg">
        {/* Sidebar */}
        <div
          className={`md:w-1/4 bg-gray-300 p-6 rounded-l-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0 pt-14" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative h-screen z-40`}
        >
          <ul className="space-y-4">
            {business !== null && business.facility === "product" && (
              <li
                className={`cursor-pointer px-4 py-2 rounded ${
                  activeTab === "product"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400"
                }`}
                onClick={() => {
                  setActiveTab("product");
                  setIsSidebarOpen(false); // Close sidebar on mobile after selecting a tab
                }}
              >
                Product
              </li>
            )}
            <li
              className={`cursor-pointer px-4 py-2 rounded ${
                activeTab === "description"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400"
              }`}
              onClick={() => {
                setActiveTab("description");
                setIsSidebarOpen(false); // Close sidebar on mobile after selecting a tab
              }}
            >
              Description
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded ${
                activeTab === "review"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400"
              }`}
              onClick={() => {
                setActiveTab("review");
                setIsSidebarOpen(false); // Close sidebar on mobile after selecting a tab
              }}
            >
              Review
            </li>
          </ul>
        </div>

        {/* Content Section */}
        <div
          className={`w-full md:w-3/4 max-h-screen overflow-y-auto p-8 ${
            isSidebarOpen && "pt-10"
          }`}
        >
          {activeTab === "product" &&
          business !== null &&
          business.facility === "product" ? (
            <ProductList products={products} />
          ) : activeTab === "description" ? (
            <BusinessDescription business={business} />
          ) : activeTab === "review" ? (
            <ReviewSection
              reviews={business.reviews}
              onAddReview={handleAddReview}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
