import axios from "axios";

// Base URL for the future Node.js + Express backend.
// When the backend is ready, set VITE_API_URL in .env or keep the default.
const API_BASE_URL = import.meta.env?.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  paramsSerializer: { indexes: null },
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if present (set by authService after login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("velocity_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("velocity_token");
      localStorage.removeItem("velocity_user");
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
