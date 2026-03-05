import { useCallback } from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { validatePdfFile } from '@/utils/file-validation';
import { processDocument } from '@/services/pdf-service';
import { ExtractionStatus } from '@/types/pdf.types';
import { extractStructuredData } from '@/services/extraction-engine';
import { classifyDocument } from '@/services/classifier';
import { performOcr } from '@/services/ocr-service';
import * as pdfjsLib from 'pdfjs-dist';
export function usePdfExtraction() {
  const setFile = useExtractionStore(s => s.setFile);
  const setQueue = useExtractionStore(s => s.setQueue);
  const setProcessingIndex = useExtractionStore(s => s.setProcessingIndex);
  const setStatus = useExtractionStore(s => s.setStatus);
  const setError = useExtractionStore(s => s.setError);
  const setResults = useExtractionStore(s => s.setResults);
  const setOcrActive = useExtractionStore(s => s.setOcrActive);
  const startExtraction = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setQueue(files);
    setStatus(ExtractionStatus.EXTRACTING);
    setError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFile(file);
      setProcessingIndex(i);
      const validation = validatePdfFile(file);
      if (!validation.success) {
        setError(`File ${file.name}: ${validation.error}`);
        continue; 
      }
      try {
        let result = await processDocument(file);
        const totalTextCount = result.pages.reduce((acc, p) => acc + p.lines.length, 0);
        if (totalTextCount === 0) {
          setOcrActive(true);
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          for (let j = 0; j < result.pages.length; j++) {
            const page = await pdf.getPage(j + 1);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              await page.render({ canvasContext: context, viewport }).promise;
              const ocrResult = await performOcr(canvas);
              result.pages[j].lines = ocrResult.lines;
            }
          }
          setOcrActive(false);
        }
        const allLines = result.pages.flatMap(p => p.lines);
        const classification = classifyDocument(allLines.join(' '));
        const structured = extractStructuredData(allLines, classification.type);
        // In this phase, we set the result of the "currently viewed" file.
        // In a true batch, you might store an array of results.
        setResults(result.pages, result.totalPages, structured, classification.type, classification.confidence);
      } catch (err) {
        console.error('Batch extraction error:', err);
        setError(`Failed to process ${file.name}`);
      }
    }
    setStatus(ExtractionStatus.SUCCESS);
  }, [setFile, setQueue, setProcessingIndex, setStatus, setError, setResults, setOcrActive]);
  return { startExtraction };
}