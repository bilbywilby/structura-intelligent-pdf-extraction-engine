import { create } from 'zustand';
import { ExtractionStatus, type PageData } from '@/types/pdf.types';
import type { StructuredField } from '@/services/extraction-engine';
interface ExtractionState {
  file: File | null;
  status: ExtractionStatus;
  error: string | null;
  pages: PageData[];
  totalPages: number;
  currentPage: number;
  isOcrActive: boolean;
  structuredData: Record<string, StructuredField>;
  // Actions
  setFile: (file: File | null) => void;
  setStatus: (status: ExtractionStatus) => void;
  setError: (error: string | null) => void;
  setOcrActive: (active: boolean) => void;
  setResults: (pages: PageData[], total: number, structured?: Record<string, StructuredField>) => void;
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
  isOcrActive: false,
  structuredData: {},
  setFile: (file) => set({ file }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setOcrActive: (isOcrActive) => set({ isOcrActive }),
  setResults: (pages, total, structured = {}) => set({ 
    pages, 
    totalPages: total, 
    structuredData: structured 
  }),
  setCurrentPage: (page) => set({ currentPage: page }),
  reset: () => set({
    file: null,
    status: ExtractionStatus.IDLE,
    error: null,
    pages: [],
    totalPages: 0,
    currentPage: 1,
    isOcrActive: false,
    structuredData: {}
  }),
}));