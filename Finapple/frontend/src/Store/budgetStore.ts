import { create } from "zustand";
import { api } from "@/api/api";

export type Budget = {
  id: number;
  category: string;
  limitAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  month: string;
};

type BudgetStore = {
  budgets: Budget[];
  loading: boolean;
  fetchBudgets: (month?: string) => Promise<void>;
  setBudget: (
    category: string,
    limitAmount: number,
    month: string,
  ) => Promise<string>;
  deleteBudget: (id: number) => Promise<void>;
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: [],
  loading: false,

  fetchBudgets: async (month?: string) => {
    set({ loading: true });
    try {
      const params = month ? `?month=${month}` : "";
      const res = await api.get(`/budget${params}`);
      set({ budgets: res.data });
    } catch (_) {
    } finally {
      set({ loading: false });
    }
  },

  setBudget: async (category, limitAmount, month) => {
    try {
      const res = await api.post("/budget", { category, limitAmount, month });
      await get().fetchBudgets(month);
      return res.data.message as string;
    } catch (err: any) {
      return err?.response?.data?.message || "Failed to set budget";
    }
  },

  deleteBudget: async (id) => {
    try {
      await api.delete(`/budget/${id}`);
      set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) }));
    } catch (_) {}
  },
}));
