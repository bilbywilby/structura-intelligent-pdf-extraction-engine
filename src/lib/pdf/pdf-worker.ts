import * as pdfjsLib from 'pdfjs-dist';
// Use a reliable CDN for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
export async function loadPdf(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  return await loadingTask.promise;
}
export async function getPdfPageCount(pdf: pdfjsLib.PDFDocumentProxy): Promise<number> {
  return pdf.numPages;
}
export interface RawTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
}
export async function extractPageText(pdf: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<RawTextItem[]> {
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();
  return textContent.items.map((item: any) => {
    // PDF.js transform matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    // index 4 is x, index 5 is y
    const transform = item.transform;
    return {
      str: item.str,
      x: transform[4],
      y: transform[5],
      width: item.width,
      height: item.height,
      fontName: item.fontName,
    };
  });
}