import axios from 'axios';
import config from '../config/config.js';
import databaseService from "../services/database.services.js";

const axiosInstance = axios.create({
  baseURL: config.apiURL,
  withCredentials: true,
});

console.info('Axios instance created with base URL:', config.apiURL);
let isRefreshing = false; // Track ongoing refresh requests
let failedQueue = []; // Store failed requests during refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Token expired, refreshing...');
        const { accessToken } = await databaseService.refreshAccessToken().then(response=>response.data);

        isRefreshing = false;
        processQueue(null, accessToken); // Resolve all waiting requests

        console.log('Token refreshed, retrying request...');
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest); // Retry failed request
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null); // Reject all queued requests
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;