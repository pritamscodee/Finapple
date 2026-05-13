import { create } from "zustand";
import { api } from "../api/api";

export type FileItem = {
  id: number;
  height: string | null;
  width: string | null;
  publicId: string | null;
  resource_type: string | null;
  url: string | null;
  page: number | null;
};

type FileStore = {
  files: FileItem[];
  GetFiles: () => Promise<number>;
};

export const usefileStore = create<FileStore>((set) => ({
  files: [],

  GetFiles: async () => {
    const res = await api.get("/vault/get");

    console.log("GetFiles response:", res.data);
    const data = Array.isArray(res.data) ? res.data : [];
    set({ files: data });
    return res.status;
  },
}));
