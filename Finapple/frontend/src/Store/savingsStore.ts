import { create } from "zustand";
import { api } from "@/api/api";

export type SavingsGoal = {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  remaining: number;
  percentComplete: number;
  deadline?: string;
  isCompleted: boolean;
  createdAt: string;
};

type SavingsStore = {
  goals: SavingsGoal[];
  loading: boolean;
  fetchGoals: () => Promise<void>;
  createGoal: (
    name: string,
    targetAmount: number,
    deadline?: string,
  ) => Promise<string>;
  addToGoal: (id: number, amount: number) => Promise<string>;
  deleteGoal: (id: number) => Promise<void>;
};

export const useSavingsStore = create<SavingsStore>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/savings");
      set({ goals: res.data });
    } catch (_) {
    } finally {
      set({ loading: false });
    }
  },

  createGoal: async (name, targetAmount, deadline) => {
    try {
      const res = await api.post("/savings", { name, targetAmount, deadline });
      await get().fetchGoals();
      return res.data.message as string;
    } catch (err: any) {
      return err?.response?.data?.message || "Failed to create goal";
    }
  },

  addToGoal: async (id, amount) => {
    try {
      const res = await api.post(`/savings/${id}/add`, { amount });
      await get().fetchGoals();
      return res.data.message as string;
    } catch (err: any) {
      return err?.response?.data?.message || "Failed to add amount";
    }
  },

  deleteGoal: async (id) => {
    try {
      await api.delete(`/savings/${id}`);
      set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
    } catch (_) {}
  },
}));
