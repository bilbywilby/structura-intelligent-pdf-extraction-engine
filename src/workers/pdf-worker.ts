import * as pdfjsLib from 'pdfjs-dist';
import type { RawTextItem } from '@/types/pdf.types';
// Use CDN worker to avoid bundling issues in Vite
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
export async function loadPdfDocument(arrayBuffer: ArrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    return await loadingTask.promise;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error('Failed to parse PDF document structure.');
  }
}
export async function getPageTextItems(pdf: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<RawTextItem[]> {
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();
  return textContent.items.map((item: any) => ({
    str: item.str,
    x: item.transform[4],
    y: item.transform[5],
    width: item.width,
    height: item.height,
    transform: item.transform,
  }));
}