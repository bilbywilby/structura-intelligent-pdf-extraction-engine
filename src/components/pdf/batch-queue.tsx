import React, { useMemo } from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { ExtractionStatus } from '@/types/pdf.types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function BatchQueue() {
  const queue = useExtractionStore(s => s.queue);
  const processingIndex = useExtractionStore(s => s.processingIndex);
  const status = useExtractionStore(s => s.status);
  const batchResults = useExtractionStore(s => s.batchResults);
  const reset = useExtractionStore(s => s.reset);
  if (queue.length === 0) return null;
  const progress = useMemo(() => {
    const completed = Object.values(batchResults).length;
    return (completed / queue.length) * 100;
  }, [batchResults, queue.length]);
  const isFinished = status === ExtractionStatus.SUCCESS && Object.values(batchResults).length === queue.length;
  return (
    <div className="w-full bg-card border rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Queue Management</h4>
            <div className="flex items-center gap-3">
                <span className="text-2xl font-black tabular-nums">
                    {Object.values(batchResults).length} / {queue.length}
                </span>
                <span className="text-sm font-bold text-muted-foreground">Files Processed</span>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="ghost" size="sm" onClick={reset} className="text-destructive hover:bg-destructive/5 rounded-full">
                <Trash2 className="w-4 h-4 mr-2" /> Abort Batch
             </Button>
        </div>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-8">
        <motion.div 
            className="absolute inset-y-0 left-0 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {queue.map((file, idx) => {
          const result = batchResults[file.name];
          const isDone = !!result && result.status === 'complete';
          const isError = !!result && result.status === 'error';
          const isProcessing = idx === processingIndex && status === ExtractionStatus.EXTRACTING && !isDone && !isError;
          const isWaiting = !isDone && !isError && !isProcessing;
          return (
            <motion.div
              key={file.name + idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                isProcessing ? "border-primary/40 bg-primary/5 shadow-sm" : "bg-background/50 border-border/50",
                isDone && "border-green-500/20 bg-green-500/5"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                    "p-2 rounded-xl shrink-0",
                    isDone ? "bg-green-500/10 text-green-500" : 
                    isProcessing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                    <p className="text-sm font-bold truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-0.5">
                        {isProcessing ? 'Processing...' : isDone ? 'Complete' : isError ? 'Failed' : 'Queued'}
                    </p>
                </div>
              </div>
              <div className="flex items-center ml-2">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : isError ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}