import React from 'react';
import { Sparkles, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { useExtractionStore } from '@/store/extraction-store';
import { PdfUploader } from '@/components/pdf/pdf-uploader';
import { ExtractionResults } from '@/components/pdf/extraction-results';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const status = useExtractionStore((s) => s.status);
  const error = useExtractionStore((s) => s.error);
  const reset = useExtractionStore((s) => s.reset);
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
              <Sparkles className="w-3.6 h-3.6" />
              Intelligent PDF Processor
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-4">
              Structura <span className="text-primary">Extraction</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform unstructured PDF documents into clean, structured data in seconds. 
              Everything happens in your browser—secure and private.
            </p>
          </header>
          {/* Conditional View States */}
          <div className="w-full">
            {status === 'idle' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PdfUploader />
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold mb-2">Binary Parsing</h4>
                    <p className="text-sm text-muted-foreground">Directly extract text and geometry from PDF structures.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold mb-2">Layout Analysis</h4>
                    <p className="text-sm text-muted-foreground">Sophisticated grouping algorithms restore natural reading order.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
                      <Loader2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold mb-2">Local Processing</h4>
                    <p className="text-sm text-muted-foreground">Your files never leave your device. Fully private by design.</p>
                  </div>
                </div>
              </div>
            )}
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Loader2 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Processing PDF...</h3>
                  <p className="text-muted-foreground">Parsing binary data and analyzing layout structures</p>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div className="max-w-md mx-auto p-8 text-center bg-destructive/5 border border-destructive/20 rounded-2xl">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-destructive">Extraction Failed</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button variant="outline" onClick={reset}>Try Another File</Button>
              </div>
            )}
            {status === 'success' && (
              <div className="animate-in fade-in duration-700">
                <ExtractionResults />
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}