import { useCallback } from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { validatePdfFile } from '@/utils/file-validation';
import { processDocument } from '@/services/pdf-service';
import { ExtractionStatus } from '@/types/pdf.types';
export function usePdfExtraction() {
  const setFile = useExtractionStore(s => s.setFile);
  const setStatus = useExtractionStore(s => s.setStatus);
  const setError = useExtractionStore(s => s.setError);
  const setResults = useExtractionStore(s => s.setResults);
  const startExtraction = useCallback(async (file: File) => {
    // 1. Reset and Set File
    setFile(file);
    setStatus(ExtractionStatus.VALIDATING);
    setError(null);
    // 2. Validate
    const validation = validatePdfFile(file);
    if (!validation.success) {
      setStatus(ExtractionStatus.ERROR);
      setError(validation.error || 'Invalid file format');
      return;
    }
    // 3. Extract
    try {
      setStatus(ExtractionStatus.EXTRACTING);
      const result = await processDocument(file);
      setResults(result.pages, result.totalPages);
      setStatus(ExtractionStatus.SUCCESS);
    } catch (err) {
      console.error('Extraction hook error:', err);
      setStatus(ExtractionStatus.ERROR);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during extraction.');
    }
  }, [setFile, setStatus, setError, setResults]);
  return { startExtraction };
}