import { useCallback } from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { validatePdfFile } from '@/utils/file-validation';
import { processDocument } from '@/services/pdf-service';
import { ExtractionStatus } from '@/types/pdf.types';
import { extractStructuredData } from '@/services/extraction-engine';
import { classifyDocument } from '@/services/classifier';
import { performOcr } from '@/services/ocr-service';
import * as pdfjsLib from 'pdfjs-dist';
const CONCURRENCY_LIMIT = 3;
export function usePdfExtraction() {
  const setFile = useExtractionStore(s => s.setFile);
  const setQueue = useExtractionStore(s => s.setQueue);
  const setProcessingIndex = useExtractionStore(s => s.setProcessingIndex);
  const setStatus = useExtractionStore(s => s.setStatus);
  const setError = useExtractionStore(s => s.setError);
  const setResults = useExtractionStore(s => s.setResults);
  const setOcrActive = useExtractionStore(s => s.setOcrActive);
  const addBatchResult = useExtractionStore(s => s.addBatchResult);
  const processFile = async (file: File) => {
    try {
      const validation = validatePdfFile(file);
      if (!validation.success) throw new Error(validation.error);
      // Large file or complex logic could trigger backend OCR here
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
      addBatchResult(file.name, {
        fileName: file.name,
        pages: result.pages,
        structuredData: structured,
        docType: classification.type,
        confidence: classification.confidence,
        status: 'complete'
      });
      return { result, structured, classification };
    } catch (err) {
      addBatchResult(file.name, {
        fileName: file.name,
        pages: [],
        structuredData: {},
        docType: 'generic',
        confidence: 0,
        status: 'error'
      });
      throw err;
    }
  };
  const startExtraction = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setQueue(files);
    setStatus(ExtractionStatus.EXTRACTING);
    setError(null);
    const queue = [...files];
    const active = new Set();
    let completedCount = 0;
    const runNext = async (): Promise<void> => {
      if (queue.length === 0) return;
      const file = queue.shift()!;
      active.add(file);
      try {
        setProcessingIndex(files.indexOf(file));
        setFile(file);
        const { result, structured, classification } = await processFile(file);
        // If it's the first file, set as active view immediately
        if (completedCount === 0) {
          setResults(result.pages, result.totalPages, structured, classification.type, classification.confidence);
        }
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      } finally {
        active.delete(file);
        completedCount++;
        await runNext();
      }
    };
    const initialWorkers = Array.from({ length: Math.min(files.length, CONCURRENCY_LIMIT) }, () => runNext());
    await Promise.all(initialWorkers);
    setStatus(ExtractionStatus.SUCCESS);
  }, [setFile, setQueue, setProcessingIndex, setStatus, setError, setResults, setOcrActive, addBatchResult]);
  return { startExtraction };
}