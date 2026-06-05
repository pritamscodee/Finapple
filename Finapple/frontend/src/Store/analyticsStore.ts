import { create } from "zustand";
import { api } from "@/api/api";

export type MonthlyStats = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  categoryBreakdown: { name: string; value: number }[];
  dailyTrend: { date: string; income: number; expense: number }[];
  transactionCount: number;
};

export type TrendPoint = {
  month: string;
  income: number;
  expense: number;
  savings: number;
};

type AnalyticsStore = {
  monthlyStats: MonthlyStats | null;
  trend: TrendPoint[];
  loading: boolean;
  fetchMonthlyStats: (month?: string) => Promise<void>;
  fetchTrend: () => Promise<void>;
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  monthlyStats: null,
  trend: [],
  loading: false,

  fetchMonthlyStats: async (month?: string) => {
    set({ loading: true });
    try {
      const params = month ? `?month=${month}` : "";
      const res = await api.get(`/wallet/stats/monthly${params}`);
      set({ monthlyStats: res.data });
    } catch (_) {
    } finally {
      set({ loading: false });
    }
  },

  fetchTrend: async () => {
    try {
      const res = await api.get("/wallet/stats/trend");
      set({ trend: res.data });
    } catch (_) {}
  },
}));
