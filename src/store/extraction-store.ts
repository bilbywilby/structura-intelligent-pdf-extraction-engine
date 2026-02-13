import { create } from 'zustand';
import { ExtractionStatus, type PageData } from '@/types/pdf.types';
interface ExtractionState {
  file: File | null;
  status: ExtractionStatus;
  error: string | null;
  pages: PageData[];
  totalPages: number;
  currentPage: number;
  // Actions
  setFile: (file: File | null) => void;
  setStatus: (status: ExtractionStatus) => void;
  setError: (error: string | null) => void;
  setResults: (pages: PageData[], total: number) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
}
export const useExtractionStore = create<ExtractionState>((set) => ({
  file: null,
  status: ExtractionStatus.IDLE,
  error: null,
  pages: [],
  totalPages: 0,
  currentPage: 1,
  setFile: (file) => set({ file }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setResults: (pages, total) => set({ pages, totalPages: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  reset: () => set({
    file: null,
    status: ExtractionStatus.IDLE,
    error: null,
    pages: [],
    totalPages: 0,
    currentPage: 1
  }),
}));