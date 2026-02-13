import { createWorker } from 'tesseract.js';
import type { RawTextItem } from '@/types/pdf.types';
export async function performOcr(canvas: HTMLCanvasElement): Promise<{ lines: string[], rawItems: RawTextItem[] }> {
  const worker = await createWorker('eng');
  try {
    const { data } = await worker.recognize(canvas);
    // Convert tesseract results to our RawTextItem format
    const rawItems: RawTextItem[] = data.words.map(word => ({
      str: word.text,
      x: word.bbox.x0,
      y: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0,
      transform: [1, 0, 0, 1, word.bbox.x0, word.bbox.y0]
    }));
    const lines = data.lines.map(line => line.text.trim()).filter(t => t.length > 0);
    return { lines, rawItems };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR processing failed.');
  } finally {
    await worker.terminate();
  }
}