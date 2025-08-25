import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: url,
  withCredentials: true,
});

export default axiosClient;
