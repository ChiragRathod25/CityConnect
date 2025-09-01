import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import SignUpPageUI from "./Pages/Signup";
import LoginPageUI from "./Pages/Login";
import PasswordResetPage from "./Pages/ResetPassWord/ResetPassword";
import Navbar from "./components/navbar";
import ModernSellerForm from "./components/BusinessForm";
import UserProfileDashboard from "./components/UserProfile";
import CategoryPageUi from "./Pages/Category";
import CityConnectLanding from "./components/LandingPage";

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
        <Route path="/user" element={<UserProfileDashboard />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default Layout;
