import BusinessmanProfileInfo from "@/components/businessmanProfile/ProfileInfo";
import { Button } from "@/components/ui/Button";
import MoveBackButton from "@/components/ui/MoveBackButton";
import EditUserProfileInfo from "@/components/userProfile/EditProfileInfo";
import { ArrowLeft } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/");
  const profileType = pathSegments[1]; // This will be 'user-profile' or 'business-profile'

  const basePath = `/${profileType}`;

  const userComponents = {
    "profile-info": EditUserProfileInfo,
    // 'email-verify': EmailVerification,
    // 'phone-verify': PhoneVerification,
    // 'password-update': SecuritySettings,
    // 'status': AccountStatus,
    // 'orders': OrderHistory,
    // 'notifications': Notifications,
    // 'services': BrowseServices,
    // 'support': HelpSupport,
    // 'about': PlatformInfo
  };

  const businessComponents = {
    "profile-info": BusinessmanProfileInfo,
    // 'email-verify': EmailVerification,
    // 'phone-verify': PhoneVerification,
    // 'password-update': SecuritySettings,
    // 'status': AccountStatus,
    // 'orders': OrderHistory,
    // 'notifications': Notifications,
    // 'seller-dashboard': SellerDashboard,
    // 'products': YourProducts,
    // 'services': YourServices,
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

  const ComponentToRender =
    componentMap[itemId] ||
    (() => (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(basePath)}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    ));

  const handleBackToProfile = () => {
    profileType === "user-profile"
      ? navigate("/user-profile")
      : navigate("/businessman-profile");
  };

  return (
    <>
      <div className="relative top-2 md:top-4 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <MoveBackButton onClick={handleBackToProfile} />
          </div>
        </div>
      </div>
     {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
        <ComponentToRender basePath={basePath} />
      {/* </div> */}
    </>
  );
};

export default ProfilePage;
