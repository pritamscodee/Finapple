import { create } from "zustand";

type LoadingStore = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const UseLoadingstore = create<LoadingStore>((set) => ({
  loading: false,
  startLoading: () =>
    set({
      loading: true,
    }),
  stopLoading: () =>
    set({
      loading: false,
    }),
}));
