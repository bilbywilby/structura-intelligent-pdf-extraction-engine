import { createWorker, type RecognizeResult } from 'tesseract.js';
import type { RawTextItem } from '@/types/pdf.types';
export async function performOcr(canvas: HTMLCanvasElement): Promise<{ lines: string[], rawItems: RawTextItem[] }> {
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(canvas) as RecognizeResult;
    const { data } = result;
    // Safety check for Tesseract data structure
    const words = (data as any).words || [];
    const linesArray = (data as any).lines || [];
    const rawItems: RawTextItem[] = words.map((word: any) => ({
      str: word.text,
      x: word.bbox.x0,
      y: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0,
      transform: [1, 0, 0, 1, word.bbox.x0, word.bbox.y0]
    }));
    const lines = linesArray.map((line: any) => line.text.trim()).filter((t: string) => t.length > 0);
    return { lines, rawItems };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR processing failed.');
  } finally {
    await worker.terminate();
  }
}