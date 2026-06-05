import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/api/api";

export type User = {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  createdAt?: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (name: string, email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email, password) => {
        try {
          const res = await api.post("/auth/login", { email, password });
          const token = res.data.token;
          set({ user: res.data.user, isAuthenticated: true, token });
          return res.data.message as string;
        } catch (error: any) {
          const msg =
            error?.response?.data?.message ||
            (Array.isArray(error?.response?.data?.message)
              ? error.response.data.message.join(", ")
              : "Login failed");
          set({ isAuthenticated: false, user: null, token: null });
          return msg;
        }
      },

      register: async (name, email, password) => {
        try {
          const res = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          return res.data.message as string;
        } catch (error: any) {
          return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Registration failed"
          );
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          await api.post(
            "/auth/logout",
            {},
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
          );
        } catch (_) {}
        set({ user: null, isAuthenticated: false, token: null });
      },

      restoreSession: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: res.data, isAuthenticated: true });
        } catch (_) {
          set({ user: null, isAuthenticated: false, token: null });
        }
      },
    }),
    {
      name: "finapple-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
