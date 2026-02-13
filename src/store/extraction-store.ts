import { create } from 'zustand';
import { ExtractionStatus, type PageData } from '@/types/pdf.types';
import type { StructuredField } from '@/services/extraction-engine';
import type { DocumentType } from '@/services/classifier';
interface BatchResult {
  fileName: string;
  pages: PageData[];
  structuredData: Record<string, StructuredField>;
  docType: DocumentType;
  confidence: number;
  status: 'complete' | 'error' | 'processing';
}
interface ExtractionState {
  file: File | null;
  queue: File[];
  processingIndex: number;
  status: ExtractionStatus;
  error: string | null;
  pages: PageData[];
  totalPages: number;
  currentPage: number;
  isOcrActive: boolean;
  structuredData: Record<string, StructuredField>;
  docType: DocumentType;
  classificationConfidence: number;
  batchResults: Record<string, BatchResult>;
  // Actions
  setFile: (file: File | null) => void;
  setQueue: (files: File[]) => void;
  setProcessingIndex: (index: number) => void;
  setStatus: (status: ExtractionStatus) => void;
  setError: (error: string | null) => void;
  setOcrActive: (active: boolean) => void;
  setResults: (pages: PageData[], total: number, structured?: Record<string, StructuredField>, type?: DocumentType, confidence?: number) => void;
  setCurrentPage: (page: number) => void;
  updateField: (key: string, value: string) => void;
  addBatchResult: (fileName: string, result: BatchResult) => void;
  setActiveFile: (fileName: string) => void;
  reset: () => void;
}
export const useExtractionStore = create<ExtractionState>((set) => ({
  file: null,
  queue: [],
  processingIndex: 0,
  status: ExtractionStatus.IDLE,
  error: null,
  pages: [],
  totalPages: 0,
  currentPage: 1,
  isOcrActive: false,
  structuredData: {},
  docType: 'generic',
  classificationConfidence: 0,
  batchResults: {},
  setFile: (file) => set({ file }),
  setQueue: (queue) => set({ queue }),
  setProcessingIndex: (processingIndex) => set({ processingIndex }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setOcrActive: (isOcrActive) => set({ isOcrActive }),
  setResults: (pages, total, structured = {}, type = 'generic', confidence = 0) => set({
    pages,
    totalPages: total,
    structuredData: structured,
    docType: type,
    classificationConfidence: confidence
  }),
  setCurrentPage: (page) => set({ currentPage: page }),
  updateField: (key, value) => set((state) => ({
    structuredData: {
      ...state.structuredData,
      [key]: { ...state.structuredData[key], value, key }
    }
  })),
  addBatchResult: (fileName, result) => set((state) => ({
    batchResults: { ...state.batchResults, [fileName]: result }
  })),
  setActiveFile: (fileName) => set((state) => {
    const res = state.batchResults[fileName];
    if (!res) return state;
    return {
      file: state.queue.find(f => f.name === fileName) || state.file,
      pages: res.pages,
      totalPages: res.pages.length,
      structuredData: res.structuredData,
      docType: res.docType,
      classificationConfidence: res.confidence,
      currentPage: 1
    };
  }),
  reset: () => set({
    file: null,
    queue: [],
    processingIndex: 0,
    status: ExtractionStatus.IDLE,
    error: null,
    pages: [],
    totalPages: 0,
    currentPage: 1,
    isOcrActive: false,
    structuredData: {},
    docType: 'generic',
    classificationConfidence: 0,
    batchResults: {}
  }),
}));