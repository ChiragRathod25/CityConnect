import { useState, useRef, useEffect } from "react";
import {useSelector } from "react-redux";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import axiosClient from "../../utils/axiosClient";
import Business from "../../../../Backend/models/Business";
import BusinessProfile from "../../components/BusinessProfile";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";
import ReviewList from "../../components/ReviewList";
import ServiceList from "../../components/ServiceList";
import { KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";

const SellerDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
    const [products, setProducts] = useState([]);

 
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const API_URL =
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";


  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewProduct({ ...newProduct, image: file });
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };


  // const handleAddProduct = (e) => {
  //   e.preventDefault();
  //   if (!newProduct.name || !newProduct.price) return;
  //   setProducts([...products, { ...newProduct, id: Date.now(), reviews: [] }]);
  //   setNewProduct({ name: "", price: "", description: "", image: null });
  // };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      )
    );
    setEditingProduct(null);
    setSelectedSection("viewProducts");
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };


  const { user } = useSelector((state) => state.user);
  const [business, setBusiness] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState({
    businessName: "",
    categoryOfBusiness: "",
    description: "",
    city: "",
  });

  useEffect(() => {
    if (user?._id) {
      fetchBusinessDetails();
    }
  }, [user?._id]);

  const fetchBusinessDetails = async () => {
    try {
      const { data } = await axiosClient.get(`/business/seller`);
      console.log("Fetched Business Data:", data);
    
      if (data.success && data.business) {
        setBusiness(data.business);
      } else {
        toast.error(data.message || "Business details not found.");
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
      toast.error("Failed to load business details.");
    }
  };
  const menuItems = business?.facility === "product"
    ? [
      { name: "My Shop", key: "profile" },
      { name: "Add New Product", key: "addProduct" },
      { name: "View All Products", key: "viewProducts" },
      { name: "Reviews & Ratings", key: "reviews" }
    ]
    : [{ name: "My Shop", key: "profile" },
       {name:" Services", key:"services"},
       { name: "Reviews & Ratings", key: "reviews" },
    ];


  const handleBusinessEdit = () => {
    if (business) {
      setEditedBusiness({
        businessName: business.businessName || "",
        categoryOfBusiness: business.categoryOfBusiness || "",
        description: business.description || "",
        city: business.city || "",
      });
      setIsEditing(true);
    }
  };

  const handleBusinessChange = (e) => {
    setEditedBusiness({ ...editedBusiness, [e.target.name]: e.target.value });
  };
  const handleSaveBusinessChanges = async () => {
    try {
      const { data } = await axiosClient.put(`/business/${business._id}`, editedBusiness);
      if (data.success) {
        toast.success("Business details updated successfully!");
        setBusiness(data.updatedBusiness);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating business details:", error);
      toast.error("Failed to update business details.");
    }
  };
  const style1 = "left-[165px]  text-white text-2xl md:top-[88px] md:left-[215px]";
  const style2 = " text-black text-2xl p-[6px]";
  const btnStyle = isOpen ? style1 : style2;


  return (
    <div className="flex">
      <div className="w-0 lg:w-64 z-50">
        <div>
          {/* Hamburger Button for Mobile */}
          <button
            onClick={toggleSidebar}
            className={`lg:hidden absolute  md:left-5  top-20 z-50  rounded-full ${btnStyle}`}
          >
            ☰
          </button>

          {/* Sidebar */}
          <div
            className={`min-h-screen max-h-full z-50 inset-y-0 left-0 md:p-3 md:text-xl md:w-64 w-48 bg-gray-800 text-white transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
          >
            <div className="p-4 pt-12 md:pt-0">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <ul className="mt-7 ">
                {menuItems.map((item) => (
                  <li
                    key={item.key}
                    className="cursor-pointer hover:text-blue-400 mt-3 text-xl"
                    onClick={() => {
                      setSelectedSection(item.key);
                      setEditingProduct(null);
                      closeSidebar();
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-h-screen mx-auto mt-10  lg:mx-0 md:mt-5  lg:mt-0 p-6">
        {/* Profile */}
       {selectedSection === "profile" && (
      <BusinessProfile
  business={business}
  user={user}
  handleBusinessEdit={handleBusinessEdit}
  handleSaveBusinessChanges={handleSaveBusinessChanges}
/>

)}


        {/* Add or Update Product Form */}
        {selectedSection === "addProduct" && (
          <ProductForm />

        )}

        {/* View Products Section */}
        {selectedSection === "viewProducts" && (
          <ProductList business={business}/>
        )}
        
        {/* Reviews Section */}
        {selectedSection === "reviews" && (
          <ReviewList products={products} />

        )}


        {selectedSection === "services" && (
         <ServiceList business={business} />
        )}
      </div>
      </div>

  );
};

export default SellerDashboard;