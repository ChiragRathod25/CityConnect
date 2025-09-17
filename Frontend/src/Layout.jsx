<<<<<<< HEAD
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import SignUpPageUI from "./Pages/Signup";
import LoginPageUI from "./Pages/Login";
import PasswordResetPage from "./Pages/ResetPassWord/ResetPassword";
import Navbar from "./components/Navbar";
import ModernSellerForm from "./components/BusinessForm";
import CategoryPageUi from "./Pages/Category";
import CityConnectLanding from "./components/LandingPage";
import BusinessmanProfileDashboard from "./Pages/BusinessmanProfile/BusinessmanProfile";
import ProfilePage from "./Pages/Profile/Profile";
import EditUserProfileInfo from "./components/userProfile/EditProfileInfo";
import EditBusinessmanProfileNavigation from "./components/businessmanProfile/EditBusinessmanProfileInfo";
import EmailEditPage from "./components/businessmanProfile/Email";
import AdminProfilePageUI from "./Pages/AdminProfile";
import UserProfileUI from "./Pages/UserProfile/Index";
import SubcategoryPage from "./Pages/Category/SubCategory";
=======
import { useState, useEffect } from "react";
import { TopBar, SideDrawer, BottomTabBar } from "./components/index.js";
import FooterComponent from "./components/Footer";
import HeaderComponent from "./components/Navbar";
>>>>>>> 8039540e590814ba45f49519a48a18642db3978e

function Layout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if running as PWA
    const checkPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsPWA(checkPWA);

    // Detect if mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileCheck =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
    setIsMobile(mobileCheck);
  }, []);

  const isMobilePWA = isPWA && isMobile;

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      {!isMobilePWA && (
        <header className="bg-[#C30E59] text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg">
          <div className="container flex justify-center items-center px-4">
            <HeaderComponent />
          </div>
        </header>
      )}

      {/* MOBILE PWA TOPBAR */}
      {isMobilePWA && (
        <div className="sm:hidden z-200 sticky top-0">
          <TopBar
            onMenuClick={() => setIsDrawerOpen(true)}
            notificationsCount={3}
          />
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>
      )}

<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPageUI />} />

        <Route path="/category" element={<CategoryPageUi />} />
        <Route path="/category/:slug" element={<SubcategoryPage onProviderClick={(provider) => console.log(provider)} />} />

        <Route path="/start" element={<CityConnectLanding />} />
        <Route path="/abc" element={<ModernSellerForm />} />
        <Route path="/signup" element={<SignUpPageUI />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
=======
      {/* MAIN */}
      <div className="min-h-screen flex-grow">{children}</div>
>>>>>>> 8039540e590814ba45f49519a48a18642db3978e

      {/* FOOTER */}
      {isMobilePWA ? (
        <div className="sm:hidden z-200 mt-10">1
          <BottomTabBar />
        </div>
      ) : (
        <FooterComponent />
      )}
    </div>
  );
}

export default Layout;
