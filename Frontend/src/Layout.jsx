import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import SignUpPageUI from "./Pages/Signup";
import LoginPageUI from "./Pages/Login";
import PasswordResetPage from "./Pages/ResetPassWord/ResetPassword";
import Navbar from "./components/navbar";

const Layout = () => {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideNavbarFooter && (
        <div className="mb-20">
          <Navbar />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPageUI />} />
        <Route path="/signup" element={<SignUpPageUI />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default Layout;
