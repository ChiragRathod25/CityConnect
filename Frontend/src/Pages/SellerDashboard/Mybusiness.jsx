import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import axiosClient from "../../utils/axiosClient";
import Business from "../../../../Backend/models/Business";
import BusinessProfile from "../../components/BusinessProfile";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";
import ReviewList from "../../components/ReviewList";
import ServiceList from "../../components/ServiceList";

const SellerDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop",
      price: 1200,
      description: "High-performance laptop",
      image: "/images/laptop.jpg",
      reviews: [{ user: "John", rating: 4.5, comment: "Great product!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
      description: "Latest smartphone",
      image: "/images/phone.jpg",
      reviews: [{ user: "Sarah", rating: 4, comment: "Good quality!" }],
    },
  ]);

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

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: URL.createObjectURL(file) });
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

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, { ...newProduct, id: Date.now(), reviews: [] }]);
    setNewProduct({ name: "", price: "", description: "", image: null });
  };

  const handleGenerateAIImage = async () => {
    if (!newProduct.name) {
      alert("Please enter a product name first.");
      return;
    }
    setLoading(true);
    try {
      const uniquePrompt = `${newProduct.name} ${Math.random()
        .toString(36)
        .substring(7)}`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: ` Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: uniquePrompt }),
      });
      const blob = await response.blob();
      setNewProduct({ ...newProduct, image: URL.createObjectURL(blob) });
    } catch (error) {
      console.error("Image generation failed", error);
    } finally {
      setLoading(false);
    }
  };

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

  const openCamera = () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setNewProduct({ ...newProduct, image: imageSrc });
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
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
      const { data } = await axiosClient.get("/business/seller");
      console.log("Fetched Business Data:", data);

      if (data.success && data.business) {
        setBusiness(data.business);
      } else {
        toast.error(data.message || "Business details not found.");
      }
    } catch (e) {
      console.error("Error fetching business details:", e);
      toast.error("Failed to load business details.");
    }
  };
  const menuItems =
    business?.facility === "product"
      ? [
        { name: "🏪 My Shop", key: "profile" },
        { name: "➕ Add New Product", key: "addProduct" },
        { name: "📦 View All Products", key: "viewProducts" },
        { name: "⭐ Reviews & Ratings", key: "reviews" },
      ]
      : [
        { name: "🏪 My Shop", key: "profile" },
        { name: "👤 Services", key: "services" },
        { name: "⭐ Reviews & Ratings", key: "reviews" },
      ];

  //   business?.services.forEach((service, index) => {
  //   console.log(Service ${index + 1} Owner Name:, service.owner?.username);
  // });

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
      const { data } = await axiosClient.put(
        `/business/${business._id}`,
        editedBusiness
      );
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
  const style1 =
    "left-[165px]  text-white text-2xl md:top-[88px] md:left-[215px]";
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
            className={`min-h-screen max-h-full z-50 inset-y-0 left-0 md:p-3 md:text-xl md:w-64 w-48 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
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

      <div className="w-full max-h-screen mx-auto mt-10 overflow-y-auto  lg:mx-0 md:mt-5  lg:mt-0 p-6">
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
          <ProductForm
            editingProduct={editingProduct}
            newProduct={newProduct}
            handleInputChange={handleInputChange}
            handleAddProduct={handleAddProduct}
            handleUpdateProduct={handleUpdateProduct}
            openImageModal={openImageModal}
            showImageModal={showImageModal}
            handleFileChange={handleFileChange}
            handleGenerateAIImage={handleGenerateAIImage}
            openCamera={openCamera}
            isCameraOpen={isCameraOpen}
            webcamRef={webcamRef}
            capturePhoto={capturePhoto}
            capturedImage={capturedImage}
            closeCamera={closeCamera}
            closeImageModal={closeImageModal}
            loading={loading}
          />
        )}

        {/* View Products Section */}
        {selectedSection === "viewProducts" && (
          <ProductList
          business={business}
            setEditingProduct={setEditingProduct}
            setSelectedSection={setSelectedSection}
            setProducts={setProducts}
          />
        )}

        {/* Reviews Section */}
        {selectedSection === "reviews" && <ReviewList business={business} />}

        {selectedSection === "services" && <ServiceList business={business} userRole={"seller"} />}
      </div>
    </div>
  );
}
export default SellerDashboard;