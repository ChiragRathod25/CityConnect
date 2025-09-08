import BusinessmanProfileInfo from "@/components/businessmanProfile/ProfileInfo";import { Button } from "@/components/ui/Button";
import MoveBackButton from "@/components/ui/MoveBackButton";
import EditUserProfileInfo from "@/components/userProfile/EditProfileInfo";
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
      <div className="min-h-screen p-6">
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
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0">
          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="relative top-2 md:top-4 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={handleBackToProfile} />
            </div>
          </div>
        </div>
        
        <ComponentToRender basePath={basePath} />
      </div>
    </div>
  );
};

export default ProfilePage;