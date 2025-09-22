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
        path: "/signup",

        element: <SignUpPageUI />,
      },
      {
        path: "/login",
        element: <LoginPageUI />,
      },
      {
        path: "/category",
        element: <CategoryPageUi />,
      },
      {
        path: "/category/:slug",
        element: <SubcategoryPage />,
      },
      {
        path: "/start",
        element: <CityConnectLanding />,
      },
      {
        path: "/abc",
        element: <ModernSellerForm />,
      },
      {
        path: "/reset-password",
        element: <PasswordResetPage />,
      },
      {
        path: "/user-profile",
        element: <UserProfileUI />,
      },
      {
        path: "/user-profile/:itemId",
        element: <ProfilePage />,
      },
      {
        path: "/businessman-profile",
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
        path: "/email",
        element: <EmailEditPage />,
      },
      {
        path: "/admin",
        element: <AdminProfilePageUI />,
      },
      {
        path: "/profile/edit-profile",
        element: <EditUserProfileInfo />,
      },
      {
        path: "/contactus",
        element: <ContactUsPageUI />,
      },
      {
        // path: "/admin/manage-category",
        path: '/neel',
        element: <ManageCategoryUI />,
      },
      {
        // path: "/admin/manage-user",
        path: '/user',
        element: <ManageUserUI />,
      },
      {
        // path: "/add-businesscard",
        path: '/add',
        element: <AddBusinessCard />,
      },
      {
        // path: "/add-productcard",
        path: '/product',
        element: <AddProductCard />,
      },
       {
        // path: "/add-productcard",
        path: '/service',
        element: <ServiceProviderCardUI />,
      },
      {
        path: "*",
        element: <NotFoundPageUI />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
