import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  setItem,
} from "../utils/localStorageManager";

const initialState = {
  isLoading: false,
  language: getItem("language") || "English",
  city: getItem("city") || "Vallabh Vidyanagar",
  isAuthenticated: false,
  category: getItem("category") || "All",
  user: null,
};

import { translateText } from "../utils/translateService";

export const translateDynamicData = createAsyncThunk(
  "user/translateDynamicData",
  async ({ text, targetLanguage }) => {
    return await translateText(text, targetLanguage);
  }
);

export const signup = createAsyncThunk("user/register", async (body) => {
  try {
    const { data } = await axiosClient.post("/user/register", body);
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    Promise.reject(e);
  }
});

export const signin = createAsyncThunk("/user/login", async (body) => {
  try {
    const { data } = await axiosClient.post("/user/login", body);
    return data;
  } catch (e) {
    console.log(e);
    Promise.reject(e);
  }
});

export const fetchProfile = createAsyncThunk("/user/profile", async () => {
  try {
    const {data} = await axiosClient.get("/user/profile", {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    Promise.reject(e);
  }
});

export const updateProfile = createAsyncThunk("/user/update", async (body) => {
  try {
    const { data } = await axiosClient.put("/user/profile", body, {
      headers: {
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    Promise.reject(e);
  }
});

export const logout = createAsyncThunk("/user/logout", async () => {
  try {
    const response = await axiosClient.get("/user/logout", {
      headers: {
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    Promise.reject(e);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    setCity: (state, action) => {
      state.city = action.payload;
      setItem("city", action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      setItem("language", action.payload);
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      setItem("category", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(signin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.success;
        state.user = action.payload?.success
          ? action.payload?.message?.user
          : null;
        console.log(action.payload.message.user);
      })
      .addCase(fetchProfile.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.success;
        state.user = action.payload?.success
          ? action.payload?.message
          : null;
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.success;
        state.user = action.payload?.success
          ? action.payload?.message?.user
          : null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser, setCity, setLanguage, setCategory } = authSlice.actions;

export default authSlice.reducer;
