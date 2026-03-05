import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/health', (c) => c.json({ success: true, data: 'OK' }));
  // OCR Fallback Endpoint (Simulated for high-complexity docs)
  app.post('/api/ocr-fallback', async (c) => {
    try {
      // In a real implementation, we would use Tesseract.js in the worker
      // or a Cloudflare AI binding if available.
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      if (!file) return bad(c, 'No file provided');
      // Simulation of server-side parsing
      const mockResult = {
        fileName: file.name,
        processedAt: new Date().toISOString(),
        docType: 'invoice',
        confidence: 0.92,
        structured: {
          "Identifier": { key: "Identifier", value: "INV-998822", confidence: 0.95, type: "id" },
          "Total Amount": { key: "Total Amount", value: "$1,250.00", confidence: 0.9, type: "amount" }
        }
      };
      return ok(c, mockResult);
    } catch (e) {
      return bad(c, e instanceof Error ? e.message : 'Internal Server Error');
    }
  });
}