import { create } from 'zustand';
import { loadPdf, extractPageText, getPdfPageCount } from '@/lib/pdf/pdf-worker';
import { normalizeLayout } from '@/lib/pdf/layout-engine';
export type ExtractionStatus = 'idle' | 'loading' | 'success' | 'error';
export interface PageData {
  pageNumber: number;
  lines: string[];
  rawItems: any[];
}
interface ExtractionState {
  file: File | null;
  status: ExtractionStatus;
  error: string | null;
  pages: PageData[];
  totalPages: number;
  currentPage: number;
  // Actions
  setFile: (file: File) => void;
  setCurrentPage: (page: number) => void;
  processFile: () => Promise<void>;
  reset: () => void;
}
export const useExtractionStore = create<ExtractionState>((set, get) => ({
  file: null,
  status: 'idle',
  error: null,
  pages: [],
  totalPages: 0,
  currentPage: 1,
  setFile: (file: File) => set({ file, status: 'idle', error: null, pages: [], totalPages: 0, currentPage: 1 }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  processFile: async () => {
    const { file } = get();
    if (!file) return;
    set({ status: 'loading', error: null });
    try {
      const pdf = await loadPdf(file);
      const total = await getPdfPageCount(pdf);
      set({ totalPages: total });
      const extractedPages: PageData[] = [];
      // Process pages
      for (let i = 1; i <= total; i++) {
        const rawItems = await extractPageText(pdf, i);
        const normalized = normalizeLayout(rawItems);
        extractedPages.push({
          pageNumber: i,
          lines: normalized.lines,
          rawItems: rawItems,
        });
      }
      set({ 
        pages: extractedPages, 
        status: 'success' 
      });
    } catch (err) {
      console.error('PDF Processing Error:', err);
      set({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Failed to process PDF' 
      });
    }
  },
  reset: () => set({ 
    file: null, 
    status: 'idle', 
    error: null, 
    pages: [], 
    totalPages: 0, 
    currentPage: 1 
  }),
}));