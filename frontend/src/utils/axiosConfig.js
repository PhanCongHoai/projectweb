import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5005",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
