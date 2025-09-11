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

        <Route path="/user-profile" element={<UserProfileUI />} />
        <Route path="/user-profile/:itemId" element={<ProfilePage />} />

        <Route path="/businessman-profile" element={<BusinessmanProfileDashboard />} />
        <Route path="/businessman-profile/:itemId" element={<ProfilePage />} />
        <Route path="/businessman-profile/profile-info/edit-profile" element={<EditBusinessmanProfileNavigation />} />
        <Route path="/email" element={<EmailEditPage />} />
        <Route path="/admin" element={<AdminProfilePageUI />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default Layout;
