import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExtractionStore } from '@/store/extraction-store';
import { usePdfExtraction } from '@/hooks/use-pdf-extraction';
import { ExtractionStatus } from '@/types/pdf.types';
export function PdfUploader() {
  const status = useExtractionStore(s => s.status);
  const error = useExtractionStore(s => s.error);
  const { startExtraction } = usePdfExtraction();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      startExtraction(acceptedFiles[0]);
    }
  }, [startExtraction]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    disabled: status !== ExtractionStatus.IDLE && status !== ExtractionStatus.ERROR
  });
  const isLoading = status === ExtractionStatus.VALIDATING || status === ExtractionStatus.EXTRACTING;
  return (
    <div className="w-full max-w-xl">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-500 p-8 md:p-12 text-center overflow-hidden",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/30",
          isLoading && "cursor-not-allowed border-primary/20 bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <motion.div
            animate={isDragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
              isDragActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : status === ExtractionStatus.SUCCESS ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <FileText className="w-10 h-10" />
            )}
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? "Processing Document..." : isDragActive ? "Drop to Extract" : "Ready to Start?"}
            </h3>
            <p className="text-muted-foreground max-w-[320px] mx-auto text-base">
              {isLoading 
                ? "Analyzing binary structures and mapping text fragments."
                : "Drop your PDF file here, or click to explore local files."}
            </p>
          </div>
          {!isLoading && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 bg-muted/50 px-4 py-1.5 rounded-full border border-border/50">
              <Upload className="w-3 h-3" />
              PDF Only • Max 25MB
            </div>
          )}
        </div>
        {/* Loading Progress Bar (Indeterminate for now) */}
        {isLoading && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-0 left-0 h-1.5 bg-primary"
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-5 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-start gap-4"
          >
            <div className="p-2 rounded-xl bg-destructive/10">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-destructive">Extraction Error</p>
              <p className="text-sm text-destructive/80 leading-relaxed font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}