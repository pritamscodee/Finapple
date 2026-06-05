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

export type AnalysisResult = {
  fileId: number;
  fileName: string;
  fileType: string;
  documentType: string;
  summary: string;
  entities: string[];
  dates: string[];
  amounts: string[];
  keyTerms: string[];
  riskFlags: string[];
  confidence: number;
  analyzedAt: string;
};

type FileStore = {
  files: FileItem[];
  loading: boolean;
  GetFiles: () => Promise<void>;
  DeleteFile: (publicId: string) => Promise<void>;
  AnalyzeFile: (fileId: number) => Promise<AnalysisResult>;
};

export const usefileStore = create<FileStore>((set, get) => ({
  files: [],
  loading: false,

  GetFiles: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/vault/get");
      set({ files: Array.isArray(res.data) ? res.data : [] });
    } finally {
      set({ loading: false });
    }
  },

  DeleteFile: async (publicId: string) => {
    await api.delete(`/vault/del/${publicId}`);
    set({ files: get().files.filter((f) => f.publicId !== publicId) });
  },

  AnalyzeFile: async (fileId: number) => {
    const res = await api.get(`/analysis/${fileId}`);
    return res.data as AnalysisResult;
  },
}));
