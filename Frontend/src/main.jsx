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
import AllBusinesses from "./components/businessmanProfile/AllBusinesses";
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
import ProductForm from "./components/FormPage/AddProductCard";
import ServiceProviderCardUI from "./Pages/ServiceProvider";
import Install from "./Pages/InstallApp.jsx";
import { SideDrawer } from "./components";
import ProductCardUI from "./Pages/Product";
import EditOperatingHours from "./components/businessmanProfile/EditOperatingHours";
import CartPageUI from "./Pages/CartForProduct";
import PaymentPage from "./Pages/Checkout/PaymentPage";
import PaymentSuccess from "./Pages/Checkout/PaymentSuccess";
import PaymentFailed from "./Pages/Checkout/PaymentFailed";
import AiImageGeneratorUI from "./Pages/ImageGenerator";
import ServiceForm from "./components/FormPage/AddServiceCard";
import ManageBusinessmanUI from "./Pages/ManageBusinessman";
import AdminVerificationPanel from "./components/AdminSellerDetailViewForm";
import ContactEditPage from "./components/businessmanProfile/Email";
import { AuthLayout } from "./components";
import ContactUsForAdmin from "./Pages/AdminContactUs";
import FeedbackComponent from "./components/Feedback";
import AboutPageUi from "./Pages/About";
import OrderHistoryForProductUI from "./Pages/HistoryForProduct";
import ProductDetailView from "./Pages/Product/ProductDetailView";
import AllProductsByBusiness from "./Pages/Product/AllProductsByBusiness";
import DeliveryAddressForm from "./Pages/CartForProduct/DeliveryAddressForm";
import AllServicesByBusiness from "./Pages/ServiceProvider/AllServicesByBusiness";
import AllServices from "./Pages/ServiceProvider/AllServices";
import OrderPageForBusinessmanUI from "./Pages/OrderForBusinessman";
import BusinessProfilePageUI from "./Pages/BusinessProfile";

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
        path: "/about",
        element: <AboutPageUi />,
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
      
      {
        path: "/business/:businessId",
        element: <BusinessProfilePageUI />,
      },
      
      //on the businessman side
      {
        path: "/register-business",
        element: <ModernSellerForm />,
      },

      {
        path: "/dashboard/businesses", //list all the businesses of the user
        element: (
          <>
            <AllBusinesses />
          </>
        ),
      },
      {
        path: "/dashboard/business/:businessId",
        element: <BusinessmanProfileDashboard />,
      },
      {
        path: "/dashboard/business/:businessId/:itemId",
        element: <ProfilePage />,
      },
      {
        path: "/dashboard/business/:businessId/profile-info/edit-profile",
        element: <EditBusinessmanProfileNavigation />,
      },

      //product related routes
      {
        path: "/dashboard/business/:businessId/product/add",
        element: <ProductForm />,
      },
      {
        path: "/dashboard/business/:businessId/product/:productId/edit",
        element: <ProductForm editMode={true} />,
      },
      // {
      //   path: "/dashboard/business/:businessId/products", // get all the products of business
      //   element: <AllProductsByBusiness />,
      // },
      // {
      //   path: "/products", // get all the products
      //   element: <ProductCardUI />,
      // },
      {
        path: "/product/:productId",
        element: <ProductDetailView />,
      },

      //service related routes
      {
        path: "/dashboard/business/:businessId/service/add",
        element: <ServiceForm />,
      },
      {
        path: "/dashboard/business/:businessId/service/:serviceId/edit",
        element: <ServiceForm editMode={true} />,
      },
      // {
      //   path: "/dashboard/business/:businessId/services",
      //   element: <AllServicesByBusiness />,
      // },
      {
        path: "/services", //display all services
        element: <AllServices />,
      },
      {
        path: "/service/:serviceId", //display service detail view
        element: <ServiceProviderCardUI />,
      },

      // {
      //   path: "/edit-operating-hours", //of business , TODO: needs improvement
      //   element: <EditOperatingHours />,
      // },
      {
        path: "/dashboard/business/:businessId/orders",
        element: <OrderPageForBusinessmanUI />,
      },
      {
        path: "/history", //user orders
        element: <OrderHistoryForProductUI />,
      },

      //user checkout flow
      {
        path: "/cart",
        element: <CartPageUI />,
      },
      {
        path: "/delivery-address-form",
        element: <DeliveryAddressForm />,
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

      ///admin side
      {
        path: "/admin",   //deprecated
        element: <AdminProfilePageUI />,
      },
      {
        path: "/admin/manage-category", //deprecated
        element: <ManageCategoryUI />,
      },
      {
        path: "/admin/manage-users", //deprecated
        element: <ManageUserUI />,
      },
      {
        path: "/admin/manage-businessmen", //deprecated
        element: <ManageBusinessmanUI />,
      },
      {
        path: "/admin/businessman-verification",//deprecated
        element: <AdminVerificationPanel />,
      },
      {
        path: "/admin/contactus",//deprecated
        element: <ContactUsForAdmin />,
      },

      {
        path: "/add",//deprecated
        element: <AddBusinessCard />,
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
        path: "/start", //deprecated
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
