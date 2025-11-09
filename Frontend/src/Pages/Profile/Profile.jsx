import ContactEditPage from "@/components/businessmanProfile/Email";
import BusinessmanProfileInfo from "@/components/businessmanProfile/ProfileInfo";
import { Button } from "@/components/ui/Button";
import MoveBackButton from "@/components/ui/MoveBackButton";
import EditUserProfileInfo from "@/components/userProfile/EditProfileInfo";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NotFoundPageUI from "../NotFound/Index";
import OrderHistoryForProductUI from "../HistoryForProduct";
import ProductForm from "@/components/FormPage/AddProductCard";
import ServiceForm from "@/components/FormPage/AddServiceCard";
import AllBusinesses from "@/components/businessmanProfile/AllBusinesses";
import AllProductsByBusiness from "../Product/AllProductsByBusiness";
import AllServicesByBusiness from "../ServiceProvider/AllServicesByBusiness";
import AiImageGeneratorUI from "../ImageGenerator";
import AllServices from "../ServiceProvider/AllServices";
import ModernSellerForm from "@/components/BusinessForm";
import BusinessmanLogoUpload from "@/components/businessmanProfile/UploadLogo";
import MultipleImagesUpload from "@/components/businessmanProfile/UploadImages";

const ProfilePage = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/");
  const profileType = pathSegments[1]; // This will be 'user-profile' or 'business-profile'
  const basePath = `/${profileType}`;
  const userComponents = {
    "profile-info": EditUserProfileInfo,
    "change-email": ContactEditPage,
    "change-phone": ContactEditPage,
    // 'password-update': SecuritySettings,
    // 'status': AccountStatus,
    'orders-history': OrderHistoryForProductUI,
    "allServices" : AllServices,
    "register-business": ModernSellerForm,
    // 'notifications': Notifications,
    // 'services': BrowseServices,
    // 'support': HelpSupport,
    // 'about': PlatformInfo
  };

  const businessComponents = {
    "profile-info": BusinessmanProfileInfo,
    "change-email": ContactEditPage,
    "change-phone": ContactEditPage,
    "add-product" : ProductForm,
    "add-service" : ServiceForm,
    "viewAllBusinesses": AllBusinesses,
    "aiImageGenerator" : AiImageGeneratorUI,
    'upload-logo': BusinessmanLogoUpload,
    'upload-images': MultipleImagesUpload,
    // 'orders': OrderHistory,
    // 'notifications': Notifications,
    // 'seller-dashboard': SellerDashboard,
    'products': AllProductsByBusiness,
    'services': AllServicesByBusiness,
    // 'sales': SalesHistory,
    // 'reviews': ReviewsRatings,
    // 'customers': CustomerManagement,
    // 'analytics': PerformanceAnalytics,
    // 'promotions': PromotionsDeals,
    // 'support': HelpSupport,
    // 'about': PlatformInfo
  };

  const componentMap =
    profileType === "user-profile" ? userComponents : businessComponents;

  const ComponentToRender = componentMap[itemId] || (() => <NotFoundPageUI />);

  const {businessId }= useParams();
  const handleBackToProfile = () => {
    profileType === "user-profile"
      ? navigate("/user-profile")
      : navigate(`/dashboard/business/${businessId}`);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 ">
      <div className="relative z-10">
        <div className="relative top-2 md:top-4 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={handleBackToProfile} />
            </div>
          </div>
        </div>

        <ComponentToRender basePath={basePath} type={itemId} />
      </div>
    </div>
  );
};

export default ProfilePage;
