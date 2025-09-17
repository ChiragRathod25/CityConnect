import { configureStore } from '@reduxjs/toolkit';
import authReducers from '../slices/userSlice/authSlices.js';


const store = configureStore({
  reducer: {
    auth: authReducers,   
  },
});

export default store;
