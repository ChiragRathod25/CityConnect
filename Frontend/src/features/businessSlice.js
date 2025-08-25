import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

const initialState = {
  isLoading: false,
  seller: [],
};

export const fetchAllSeller = createAsyncThunk(
  "business",
  async ({city, category}) => {
    try {
      const { data } = await axiosClient.get(
        `/api/city/${city}/${category}`
      );
      return data;
    } catch (e) {
      console.log(e);
      Promise.reject(e);
    }
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSeller.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllSeller.rejected, (state, action) => {
      state.isLoading = false;
      state.seller = [];
    });
    builder.addCase(fetchAllSeller.fulfilled, (state, action) => {
      state.isLoading = false;
      state.seller = action.payload?.success
        ? action.payload?.message?.businesses
        : [];
    });
  },
});

export default businessSlice.reducer;
