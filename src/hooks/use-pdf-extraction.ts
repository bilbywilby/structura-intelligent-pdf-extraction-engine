import { useCallback } from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { validatePdfFile } from '@/utils/file-validation';
import { processDocument } from '@/services/pdf-service';
import { ExtractionStatus } from '@/types/pdf.types';
import { extractStructuredData } from '@/services/extraction-engine';
import { performOcr } from '@/services/ocr-service';
import * as pdfjsLib from 'pdfjs-dist';
export function usePdfExtraction() {
  const setFile = useExtractionStore(s => s.setFile);
  const setStatus = useExtractionStore(s => s.setStatus);
  const setError = useExtractionStore(s => s.setError);
  const setResults = useExtractionStore(s => s.setResults);
  const setOcrActive = useExtractionStore(s => s.setOcrActive);
  const startExtraction = useCallback(async (file: File) => {
    setFile(file);
    setStatus(ExtractionStatus.VALIDATING);
    setError(null);
    const validation = validatePdfFile(file);
    if (!validation.success) {
      setStatus(ExtractionStatus.ERROR);
      setError(validation.error || 'Invalid file format');
      return;
    }
    try {
      setStatus(ExtractionStatus.EXTRACTING);
      let result = await processDocument(file);
      const totalTextCount = result.pages.reduce((acc, p) => acc + p.lines.length, 0);
      // Trigger OCR Fallback if document appears to be scanned (no selectable text)
      if (totalTextCount === 0) {
        setOcrActive(true);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 0; i < result.pages.length; i++) {
          const pageNum = i + 1;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const ocrResult = await performOcr(canvas);
            result.pages[i].lines = ocrResult.lines;
          }
        }
        setOcrActive(false);
      }
      // Intelligent Mapping
      const allLines = result.pages.flatMap(p => p.lines);
      const structured = extractStructuredData(allLines);
      setResults(result.pages, result.totalPages, structured);
      setStatus(ExtractionStatus.SUCCESS);
    } catch (err) {
      console.error('Extraction hook error:', err);
      setStatus(ExtractionStatus.ERROR);
      setOcrActive(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during extraction.');
    }
  }, [setFile, setStatus, setError, setResults, setOcrActive]);
  return { startExtraction };
}