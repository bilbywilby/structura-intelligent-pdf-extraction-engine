import { loadPdfDocument, getPageTextItems } from '@/workers/pdf-worker';
import { normalizeLayout } from './layout-engine';
import type { ExtractionResult, PageData } from '@/types/pdf.types';
export async function processDocument(file: File): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await loadPdfDocument(arrayBuffer);
  const totalPages = pdf.numPages;
  const pages: PageData[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const rawItems = await getPageTextItems(pdf, i);
    const { lines } = normalizeLayout(rawItems);
    pages.push({
      pageNumber: i,
      lines,
      rawItems,
    });
  }
  return {
    fileName: file.name,
    fileSize: file.size,
    totalPages,
    pages,
    extractedAt: new Date().toISOString(),
  };
}