import { create } from "zustand";
import { api } from "../api/api";
import { useBudgetStore } from "./budgetStore";

export type Transaction = {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out";
  amount: string;
  balanceAfter: string;
  description: string | null;
  category: string | null;
  recipientEmail: string | null;
  createdAt: string;
};

type WalletStore = {
  balance: string | null;
  transactions: Transaction[];
  loading: boolean;
  txLoading: boolean;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  deposit: (amount: number, description?: string) => Promise<string>;
  withdraw: (amount: number, description?: string, category?: string) => Promise<string>;
  transfer: (recipientEmail: string, amount: number, description?: string) => Promise<string>;
};

/** Returns current month string like "2025-05" */
function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balance: null,
  transactions: [],
  loading: false,
  txLoading: false,

  fetchBalance: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/wallet/balance");
      set({ balance: res.data.balance });
    } finally {
      set({ loading: false });
    }
  },

  fetchTransactions: async () => {
    set({ txLoading: true });
    try {
      const res = await api.get("/wallet/transactions");
      set({ transactions: Array.isArray(res.data) ? res.data : [] });
    } finally {
      set({ txLoading: false });
    }
  },

  deposit: async (amount, description) => {
    const res = await api.post("/wallet/deposit", { amount, description });
    set({ balance: res.data.balance });
    await get().fetchTransactions();
    // Deposits don't affect expense budgets — no refresh needed
    return res.data.message;
  },

  withdraw: async (amount, description, category) => {
    const res = await api.post("/wallet/withdraw", { amount, description, category });
    set({ balance: res.data.balance });
    await get().fetchTransactions();
    // Refresh budgets so spending progress updates immediately
    await useBudgetStore.getState().fetchBudgets(currentMonth());
    return res.data.message;
  },

  transfer: async (recipientEmail, amount, description) => {
    const res = await api.post("/wallet/transfer", { recipientEmail, amount, description });
    set({ balance: res.data.balance });
    await get().fetchTransactions();
    // Transfers count as spending — refresh budgets
    await useBudgetStore.getState().fetchBudgets(currentMonth());
    return res.data.message;
  },
}));
