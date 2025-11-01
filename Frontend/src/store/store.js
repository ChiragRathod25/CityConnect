import { configureStore } from '@reduxjs/toolkit';
import authReducers from '../slices/userSlice/authSlices.js';
import businessReducers from '../slices/userSlice/businessSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducers,
    business: businessReducers,
  },
});

export default store;
