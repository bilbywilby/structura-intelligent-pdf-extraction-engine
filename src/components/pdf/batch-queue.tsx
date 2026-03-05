import React from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { ExtractionStatus } from '@/types/pdf.types';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
export function BatchQueue() {
  const queue = useExtractionStore(s => s.queue);
  const processingIndex = useExtractionStore(s => s.processingIndex);
  const status = useExtractionStore(s => s.status);
  if (queue.length <= 1) return null;
  const progress = ((processingIndex + 1) / queue.length) * 100;
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-card border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Batch Processing</h4>
        <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded">
          {processingIndex + 1} / {queue.length}
        </span>
      </div>
      <Progress value={progress} className="h-2 mb-6" />
      <div className="space-y-3">
        {queue.map((file, idx) => {
          const isDone = idx < processingIndex || (idx === processingIndex && status === ExtractionStatus.SUCCESS);
          const isProcessing = idx === processingIndex && status === ExtractionStatus.EXTRACTING;
          const isWaiting = idx > processingIndex;
          return (
            <motion.div 
              key={file.name + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 rounded-xl border bg-background/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium truncate max-w-[240px]">{file.name}</span>
              </div>
              <div className="flex items-center">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <Clock className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}