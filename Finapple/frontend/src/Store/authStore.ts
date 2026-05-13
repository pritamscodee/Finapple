import { create } from "zustand";
import { api } from "../api/api";

type User = {
  id: string;
  name?: string;
  email: string;
  password?: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  message: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (name: string, email: string, password: string) => Promise<string>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  message: null,

  login: async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const token = res.data.token;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        user: res.data.user,
        isAuthenticated: true,
        token,
        message: res.data.message,
      });

      return res.data.message;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Login failed";

      set({
        message: msg,
        isAuthenticated: false,
        user: null,
        token: null,
      });

      return msg;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });

      set({
        message: res.data.message,
      });

      return res.data.message;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Registration failed";

      set({
        message: msg,
      });

      return msg;
    }
  },
}));
