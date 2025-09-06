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
// import ProfilePageUI from "./Pages/Profile";
import UserProfileDashboard from "./Pages/UserProfile/UserProfile";
import BusinessmanProfileDashboard from "./Pages/BusinessmanProfile/BusinessmanProfile";
import ProfilePage from "./Pages/Profile/Profile";

const Layout = () => {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/start" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideNavbarFooter && (
        <div className="md:mb-20 mb-16">
          <Navbar />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPageUI />} />
        <Route path="/category" element={<CategoryPageUi />} />
        <Route path="/start" element={<CityConnectLanding />} />
        <Route path="/abc" element={<ModernSellerForm />} />
        <Route path="/signup" element={<SignUpPageUI />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />

        <Route path="/user-profile" element={<UserProfileDashboard />} />
        <Route path="/user-profile/:itemId" element={<ProfilePage />} />

        <Route path="/businessman-profile" element={<BusinessmanProfileDashboard />} />
        <Route path="/businessman-profile/:itemId" element={<ProfilePage />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default Layout;
