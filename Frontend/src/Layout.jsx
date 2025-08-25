import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Category from "./Pages/Category/Category";
import About from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import Footer from "./components/Footer";
import Contact from "./Pages/Contact/Contact";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProfile } from "./features/userSlice";
import ProfilePage from "./Pages/SellerProfile/Profile";
import AddSeller from "./Pages/AddSeller/AddSeller";
import Navbar from "./components/navbar";
import BusinessPage from "./Pages/Business/BusinessPage";
import Mybusiness from "./Pages/SellerDashboard/Mybusiness";
// import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import CategoryPage from "./components/CategoryPage";
import { Divide } from "lucide-react";
import ExamplePage, { ExamplePage2 } from "./components/SnackMovingStyling";
import PasswordResetPage from "./Pages/ResetPassWord/ResetPassword";

const Layout = () => {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/reset-password";
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);
  return (
    <>
      {!hideNavbarFooter && <div className="mb-20">
          <Navbar isAuthenticated={isAuthenticated} />
        </div>}

      <Routes>
      {/* <Route element={<PrivateRoute adminOnly={true} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route> */}
        <Route path="/category" element={<Category />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/becomeaseller" element={<AddSeller />}/> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/business/:id" element={<BusinessPage/>}/>
        <Route path="/myBusiness" element={<Mybusiness />} />
         <Route path="/admin/*" element={<AdminDashboard />} />
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<ExamplePage2 />} />
            <Route path="/signup" element={<ExamplePage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
          </>
        )}
        {isAuthenticated ? (
          <Route path="/becomeaseller" element={<AddSeller />} />
        ) : (
          <Route path="/becomeaseller" element={<Login />} />
        )}

        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default Layout;
