import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Home from "./Pages/Home";

import SignUpPageUI from "./Pages/Signup";
import LoginPageUI from "./Pages/Login";
import PasswordResetPage from "./Pages/ResetPassWord/ResetPassword";

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
import NotFoundPageUI from "./Pages/NotFound/Index";
import ContactUsPageUI from "./Pages/ContactUs";
import ManageCategoryUI from "./Pages/ManageCategory";
import ManageUserUI from "./Pages/ManageUser";
import AddBusinessCard from "./components/FormPage/AddBusinessCard";
import AddProductCard from "./components/FormPage/AddProductCard";
import ServiceProviderCardUI from "./Pages/ServiceProvider";
import Install from "./Pages/InstallApp.jsx";
import { SideDrawer } from "./components";
import ProductCardUI from "./Pages/ProductCard";
import EditOperatingHours from "./components/businessmanProfile/EditOperatingHours";
import CartPageUI from "./Pages/CartForProduct";
import PaymentPage from "./Pages/Checkout/PaymentPage";
import PaymentSuccess from "./Pages/Checkout/PaymentSuccess";
import PaymentFailed from "./Pages/Checkout/PaymentFailed";
import AiImageGeneratorUI from "./Pages/ImageGenerator";
import AddServiceProviderForm from "./components/FormPage/AddServiceCard";
import ManageBusinessmanUI from "./Pages/ManageBusinessman";
import AdminVerificationPanel from "./components/AdminSellerDetailViewForm";
import ContactEditPage from "./components/businessmanProfile/Email";
import { AuthLayout } from "./components";
import ContactUsForAdmin from "./Pages/AdminContactUs";
import FeedbackComponent from "./components/Feedback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/install",
        element: <Install />,
      },
      {
        path: "/signup",

        element: <SignUpPageUI />,
      },
      {
        path: "/login",
        element: <LoginPageUI />,
      },
      {
        path: "/reset-password",
        element: <PasswordResetPage />,
      },
      {
        path: "/user-profile",
        element: (
          <AuthLayout>
            <UserProfileUI />
          </AuthLayout>
        ),
      },
      {
        path: "/user-profile/:itemId",
        element: <ProfilePage />,
      },

      
      //on the user side
      {
        path: "/category",
        element: <CategoryPageUi />,
      },
      {
        path: "/category/:slug",
        element: <SubcategoryPage />,
      },

      //on the businessman side
      {
        path: "/register-business",
        element: <ModernSellerForm />,
      },
      
      {
        path: "/businesses", //list all the businesses of the user
        element:
        (
          <>
          </>
        )
      },
      {
        path: "/business-profile",
        element: <BusinessmanProfileDashboard />,
      },
      {
        path: "/businessman-profile/:itemId",
        element: <ProfilePage />,
      },
      {
        path: "/businessman-profile/profile-info/edit-profile",
        element: <EditBusinessmanProfileNavigation />,
      },
      
      {
        // path: "/add-productcard", //used to add product of business
        path: "/:businessId/product/add",
        element: <AddProductCard />,
      },
      {
        // path: "/add-productcard",  //used to add service of business
        path: "/:businessId/service/add",
        element: <AddServiceProviderForm />,
      },
      {
        path: "/:businessId/service", //get information about the service of the business
        element: <ServiceProviderCardUI />,
      },
      {
        path: "/card", //get information about the products of the business
        element: <ProductCardUI />,
      },
      {
        path: "/edit-operating-hours", //of business , TODO: needs improvement
        element: <EditOperatingHours />,
      },
      {
        path: "/cart",
        element: <CartPageUI />,
      },

      ///admin side
      {
        path: "/admin",
        element: <AdminProfilePageUI />,
      },

      {
        path: "/admin/manage-category",
        element: <ManageCategoryUI />,
      },
      {
        path: "/admin/manage-users",
        element: <ManageUserUI />,
      },
      {
        path: "/admin/manage-businessmen",
        element: <ManageBusinessmanUI />,
      },
      {
        path: "/admin/businessman-verification",
        element: <AdminVerificationPanel />,
      },
      {
        path: "/admin/contactus",
        element: <ContactUsForAdmin />,
      },

      {
        path: "/add",
        element: <AddBusinessCard />,
      },
      



      {
        path: "/payment",
        element: <PaymentPage />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment-failed",
        element: <PaymentFailed />,
      },

      //not used routes, or least important
      {
        path: "/feedback",
        element: <FeedbackComponent />,
      },
      {
        path: "/ai",
        element: <AiImageGeneratorUI />,
      },
      {
        path: "/contactus",
        element: <ContactUsPageUI />,
      },
      {
        path: "/start",
        element: <CityConnectLanding />,
      },
      {
        path: "*",
        element: <NotFoundPageUI />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);
