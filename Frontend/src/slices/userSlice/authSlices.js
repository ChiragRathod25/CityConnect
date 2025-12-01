import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      (state.status = false), (state.userData = null);
      // Local Storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Session Storage
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      // Cookies
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    },
    updateUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});
export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
