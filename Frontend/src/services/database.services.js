import axiosInstace from "../utils/axios.js";
import { handleApiRequest } from "../utils/apiHelper.js";
import toast from "react-hot-toast";

export class DatabaseService {
  async createTempContactSession({ userId, newContact, type }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/create-temp-contact-session", {
            userId,
            newContact,
            type,
          }),
        "Create Temp Contact Session"
      ),
      {
        loading: "Creating session...",
        success: "Session created successfully!",
        error: "Failed to create session. Please try again.",
      }
    );
  }

  async InitialUserRegister({ username, email, password, phoneNumber, role }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/initialRegister", {
            username,
            email,
            password,
            phoneNumber,
            role,
          }),
        "Initial User Register"
      ),
      {
        loading: "Registering...",
        success: "Registration Successful! Please verify your email/phone.",
        error: "Registration Failed. Please try again.",
      }
    );
  }

  async sendEmailVerificationOTP({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/send-email-verification-otp", {
            sessionId,
          }),
        "Send Email Verification OTP"
      ),
      {
        loading: "Sending OTP...",
        success: "OTP sent to your email!",
        error: "Failed to send OTP. Please try again.",
      }
    );
  }

  async verifyEmail({ sessionId, otp }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/verify-email", {
            otp,
            sessionId,
          }),
        "Verify Email"
      ),
      {
        loading: "Verifying OTP...",
        success: "Email verified successfully!",
        error: "OTP verification failed. Please try again.",
      }
    );
  }

  async sendPhoneVerificationOTP({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/send-phone-verification-otp", {
            sessionId,
          }),
        "Send Phone Verification OTP"
      ),
      {
        loading: "Sending OTP...",
        success: "OTP sent to your phone!",
        error: "Failed to send OTP. Please try again.",
      }
    );
  }

  async verifyPhone({ sessionId, otp }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/verify-phone", {
            sessionId,
            otp,
          }),
        "Verify Phone"
      ),
      {
        loading: "Verifying OTP...",
        success: "Phone number verified successfully!",
        error: "OTP verification failed. Please try again.",
      }
    );
  }

  async completeUserRegistration({ sessionId }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/complete-registration", {
            sessionId,
          }),
        "Complete User Registration"
      ),
      {
        loading: "Completing registration...",
        success: "Registration completed successfully! You can now log in.",
        error: "Failed to complete registration. Please try again.",
      }
    );
  }

  async getCurrentuser() {
    return handleApiRequest(
      () => axiosInstace.get("/api/v1/user/getCurrentUser"),
      "Get Current User"
    );
  }

  async refreshAccessToken() {
    return handleApiRequest(
      () => axiosInstace.get("/api/v1/user/refresh-token"),
      "Refresh Access Token"
    );
  }

  async login({ email, password }) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post("/api/v1/user/login", {
            email,
            password,
          }),
        "User Login"
      ),
      {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Login failed. Please check your credentials and try again.",
      }
    );
  }

  async logout() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.post("/api/v1/user/logout"),
        "User Logout"
      ),
      {
        loading: "Logging out...",
        success: "Logout successful!",
        error: "Logout failed. Please try again.",
      }
    );
  }

  async updateUserProfile(profileData) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.put("/api/v1/user/update-user-profile", profileData),
        "Update User Profile"
      ),
      {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile. Please try again.",
      }
    );
  }

  async updateUserAvatar(avatarFile) {
    const formData = new FormData();
    formData.append("avatar", avatarFile); // 'avatar' MUST match multer field name

    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.put("/api/v1/user/update-avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
        "Update User Avatar"
      ),
      {
        loading: "Updating avatar...",
        success: "Avatar updated successfully!",
        error: "Failed to update avatar. Please try again.",
      }
    );
  }

  //business registration services can be added here
  async registerBusinessBasicInfo(businessData) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.post("/api/v1/business/register", businessData),
        "Register Business Basic Info"
      ),
      {
        loading: "Registering business...",
        success: "Business registered successfully!",
        error: "Failed to register business. Please try again.",
      }
    );
  }

  async registerBusinessContactInfo(businessId, contactData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post(
            `/api/v1/business-contact/${businessId}`,
            contactData
          ),
        "Register Business Contact Info"
      ),
      {
        loading: "Updating business contact info...",
        success: "Business contact info updated successfully!",
        error: "Failed to update business contact info. Please try again.",
      }
    );
  }

  async registerBusinessLocationInfo(businessId, locationData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post(
            `/api/v1/business-location/${businessId}`,
            locationData
          ),
        "Register Business Location Info"
      ),
      {
        loading: "Updating business location info...",
        success: "Business location info updated successfully!",
        error: "Failed to update business location info. Please try again.",
      }
    );
  }

  async registerBusinessHoursInfo(businessId, hoursData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.post(`/api/v1/business-hours/${businessId}`, hoursData),
        "Register Business Hours Info"
      ),
      {
        loading: "Updating business hours info...",
        success: "Business hours info updated successfully!",
        error: "Failed to update business hours info. Please try again.",
      }
    );
  }

  async getBusinessByCategory(category) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business/category/${category}`),
        "Get Businesses by Category"
      ),
      {
        loading: "Fetching businesses...",
        success: "Businesses fetched successfully!",
        error: "Failed to fetch businesses. Please try again.",
      }
    );
  }

  async getAllBusinesses() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business/user/me`),
        "Get All Businesses by User ID"
      ),
      {
        loading: "Fetching your businesses...",
        success: "Businesses fetched successfully!",
        error: "Failed to fetch businesses. Please try again.",
      }
    );
  }

  async getBusinessProfileById(businessId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business/${businessId}`),
        "Get Business Profile by ID"
      ),
      {
        loading: "Fetching business profile...",
        success: "Business profile fetched successfully!",
        error: "Failed to fetch business profile. Please try again.",
      }
    );
  }

  async updateBusinessProfile(businessId, businessData) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.put(`/api/v1/business/${businessId}`, businessData),
        "Update Business Profile by ID"
      ),
      {
        loading: "Updating business profile...",
        success: "Business profile updated successfully!",
        error: "Failed to update business profile. Please try again.",
      }
    );
  }

  // business contact
  async updateBusinessContact(businessId, contactData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.put(
            `/api/v1/business-contact/${businessId}`,
            contactData
          ),
        "Update Business Contact by Business ID"
      ),
      {
        loading: "Updating business contact...",
        success: "Business contact updated successfully!",
        error: "Failed to update business contact. Please try again.",
      }
    );
  }

  //business product methods
  async addBusinessProduct(businessId, productData) {
    const formData = new FormData();

    // append non-file fields
    for (const [key, value] of Object.entries(productData)) {
      if (key === "images") continue; // handle separately below

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // handle tags, etc.
      } else {
        formData.append(key, value);
      }
    }

    // append actual files
    if (Array.isArray(productData.images)) {
      productData.images.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append("images", file); // 'images' must match multer field
        }
      });
    }

    console.log("FormData images:", formData.getAll("images"));

    return toast.promise(
      handleApiRequest(() =>
        axiosInstace.post(`/api/v1/business-product/${businessId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ),
      {
        loading: "Adding product...",
        success: "Product added successfully!",
        error: "Failed to add product. Please try again.",
      }
    );
  }

  async getBusinessProduct(productId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-product/product/${productId}`),
        "Get Business Product by Business ID and Product ID"
      ),
      {
        loading: "Fetching product details...",
        success: "Product details fetched successfully!",
        error: "Failed to fetch product details. Please try again.",
      }
    );
  }

  async updateBusinessProduct(productId, productData) {
    const formData = new FormData();

    // append non-file fields
    for (const [key, value] of Object.entries(productData)) {
      if (key === "images") continue; // handle separately below
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // handle tags, etc.
      } else {
        formData.append(key, value);
      }
    }

    // append actual files
    if (Array.isArray(productData.images)) {
      productData.images.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append("images", file); // 'images' must match multer field
        }
      });
    }
    console.log("FormData images:", formData.getAll("images"));

    return toast.promise(
      handleApiRequest(() =>
        axiosInstace.put(
          `/api/v1/business-product/product/${productId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
      ),
      {
        loading: "Updating product...",
        success: "Product updated successfully!",
        error: "Failed to update product. Please try again.",
      }
    );
  }

  async getProductsByBusinessId(businessId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-product/${businessId}`),
        "Get Products by Business ID"
      ),
      {
        loading: "Fetching products...",
        success: "Products fetched successfully!",
        error: "Failed to fetch products. Please try again.",
      }
    );
  }

  async getAllProducts() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-product/products/all`),
        "Get All Products"
      ),
      {
        loading: "Fetching all products...",
        success: "All products fetched successfully!",
        error: "Failed to fetch products. Please try again.",
      }
    );
  }

  //  business services methods
  async addBusinessService(businessId, serviceData) {
    const formData = new FormData();

    // append non-file fields
    for (const [key, value] of Object.entries(serviceData)) {
      if (key === "images") continue; // handle separately below

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // handle tags, etc.
      } else {
        formData.append(key, value);
      }
    }

    // append actual files
    if (Array.isArray(serviceData.images)) {
      serviceData.images.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append("images", file); // 'images' must match multer field
        }
      });
    }

    console.log("FormData images:", formData.getAll("images"));

    return toast.promise(
      handleApiRequest(() =>
        axiosInstace.post(`/api/v1/business-service/${businessId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ),
      {
        loading: "Adding service...",
        success: "Service added successfully!",
        error: "Failed to add service. Please try again.",
      }
    );
  }

  async getBusinessService(serviceId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-service/service/${serviceId}`),
        "Get Business Service by Service ID"
      ),
      {
        loading: "Fetching service details...",
        success: "Service details fetched successfully!",
        error: "Failed to fetch service details. Please try again.",
      }
    );
  }

  async updateBusinessService(serviceId, serviceData) {
    const formData = new FormData();
    // append non-file fields
    for (const [key, value] of Object.entries(serviceData)) {
      if (key === "images") continue; // handle separately below

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // handle tags, etc.
      } else {
        formData.append(key, value);
      }
    }

    // append actual files
    if (Array.isArray(serviceData.images)) {
      serviceData.images.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append("images", file); // 'images' must match multer field
        }
      });
    }

    console.log("FormData images:", formData.getAll("images"));

    return toast.promise(
      handleApiRequest(() =>
        axiosInstace.put(
          `/api/v1/business-service/service/${serviceId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
      ),
      {
        loading: "Updating service...",
        success: "Service updated successfully!",
        error: "Failed to update service. Please try again.",
      }
    );
  }

  async getAllServicesByBusinessId(businessId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-service/${businessId}`),
        "Get All Services by Business ID"
      ),
      {
        loading: "Fetching services...",
        success: "Services fetched successfully!",
        error: "Failed to fetch services. Please try again.",
      }
    );
  }

  async getAllServices() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-service/services/all`),
        "Get All Services"
      ),
      {
        loading: "Fetching all services...",
        success: "All services fetched successfully!",
        error: "Failed to fetch services. Please try again.",
      }
    );
  }

  //business hours
  async getBusinessHours(businessId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-hours/${businessId}`),
        "Get Business Hours by Business ID"
      ),
      {
        loading: "Fetching business hours...",
        success: "Business hours fetched successfully!",
        error: "Failed to fetch business hours. Please try again.",
      }
    );
  }

  async updateBusinessHoursById(businessId, hourId, hoursData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.put(
            `/api/v1/business-hours/${businessId}/${hourId}`,
            hoursData
          ),
        "Update Business Hours by ID"
      ),
      {
        loading: "Updating business hours...",
        success: "Business hours updated successfully!",
        error: "Failed to update business hours. Please try again.",
      }
    );
  }

  //location services
  async getBusinessLocation(businessId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get(`/api/v1/business-location/${businessId}`),
        "Get Business Location by Business ID"
      ),
      {
        loading: "Fetching business location...",
        success: "Business location fetched successfully!",
        error: "Failed to fetch business location. Please try again.",
      }
    );
  }

  async updateBusinessLocationById(locationId, locationData) {
    return toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.put(
            `/api/v1/business-location/update/${locationId}`,
            locationData
          ),
        "Update Business Location by ID"
      ),
      {
        loading: "Updating business location...",
        success: "Business location updated successfully!",
        error: "Failed to update business location. Please try again.",
      }
    );
  }

  //cart
  async addProductToCart(productId, quantity) {
    return handleApiRequest(
      () =>
        axiosInstace.post("/api/v1/order-cart/add", {
          productId,
          quantity,
        }),
      "Add Item to Cart"
    );
  }

  async getUserCart() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.get("/api/v1/order-cart/"),
        "Get User Cart"
      ),
      {
        loading: "Fetching cart...",
        success: "Cart fetched successfully!",
        error: "Failed to fetch cart. Please try again.",
      }
    );
  }

  async updateCartItem(productId, quantity) {
    return  toast.promise(
      handleApiRequest(
        () =>
          axiosInstace.put(`/api/v1/order-cart/update/${productId}`, {
            quantity,
          }),
        "Update Item in Cart"
      ),
      {
        loading: "Updating cart item...",
        success: "Cart item updated successfully!",
        error: "Failed to update cart item. Please try again.",
      }
    );
  }

  async removeItemFromCart(productId) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.delete(`/api/v1/order-cart/remove/${productId}`),
        "Remove Item from Cart"
      ),
      {
        loading: "Removing cart item...",
        success: "Cart item removed successfully!",
        error: "Failed to remove cart item. Please try again.",
      }
    );
  }

  async clearCart() {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.delete(`/api/v1/order-cart/clear`),
        "Clear Cart"
      ),
      {
        loading: "Clearing cart...",
        success: "Cart cleared successfully!",
        error: "Failed to clear cart. Please try again.",
      }
    );
  }

  //order
  async createOrder(orderData) {
    return toast.promise(
      handleApiRequest(
        () => axiosInstace.post("/api/v1/order-history/", orderData),
        "Create Order"
      ),
      {
        loading: "Creating order...",
        success: "Order created successfully!",
        error: "Failed to create order. Please try again.",
      }
    );
  }

}
const databaseService = new DatabaseService();
export default databaseService;
