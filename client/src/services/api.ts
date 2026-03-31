import axios from "axios";

// Create an instance with your backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/reyu-diamond",
});

// Add a request interceptor to attach your Auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or wherever you store your JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;