import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage directly — no store import (avoids circular dep)
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("finapple-auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (_) {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear persisted auth and redirect to login
      localStorage.removeItem("finapple-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
