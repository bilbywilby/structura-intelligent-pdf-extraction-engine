import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface PdfPreviewProps {
  file: File;
  pageNumber: number;
  className?: string;
}
export function PdfPreview({ file, pageNumber, className }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    let renderTask: any = null;
    const renderPage = async () => {
      if (!file || !canvasRef.current) return;
      try {
        setLoading(true);
        setError(null);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(pageNumber);
        if (!isMounted) return;
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.height = viewport.height * dpr;
        canvas.width = viewport.width * dpr;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;
        context.scale(dpr, dpr);
        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });
        await renderTask.promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('PDF Rendering error:', err);
        if (isMounted) {
          setError('Failed to render PDF page');
          setLoading(false);
        }
      }
    };
    renderPage();
    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [file, pageNumber]);
  return (
    <div className={cn("relative flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden border shadow-sm", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="p-8 text-center text-muted-foreground">
          <p>{error}</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={cn("max-w-full h-auto", loading ? "opacity-0" : "opacity-100 transition-opacity duration-300")} 
      />
    </div>
  );
}