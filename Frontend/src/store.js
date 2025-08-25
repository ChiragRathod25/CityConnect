import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice.js";
import businessReducer from "./features/businessSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    business: businessReducer,
  },
});

export default store;
