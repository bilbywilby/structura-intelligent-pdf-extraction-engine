import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExtractionStore } from '@/store/extraction-store';
export function PdfUploader() {
  const setFile = useExtractionStore((s) => s.setFile);
  const processFile = useExtractionStore((s) => s.processFile);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      processFile();
    }
  }, [setFile, processFile]);
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 text-center",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={isDragActive ? { y: -10 } : { y: 0 }}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-primary"
            )}
          >
            {isDragActive ? <Upload className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {isDragActive ? "Drop your PDF here" : "Upload your document"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
              Drag and drop your PDF file here, or click to browse from your computer.
            </p>
          </div>
          <div className="text-2xs font-medium uppercase tracking-wider text-muted-foreground/60 pt-4">
            Supports PDF files up to 20MB
          </div>
        </div>
      </div>
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm text-destructive font-medium">
              {fileRejections[0].errors[0].message === 'File is not a PDF' 
                ? "Invalid file type. Please upload a PDF document." 
                : fileRejections[0].errors[0].message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}