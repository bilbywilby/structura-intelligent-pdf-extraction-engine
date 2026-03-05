import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Shield, Zap, Layout, ArrowRight, Share2 } from 'lucide-react';
import { useExtractionStore } from '@/store/extraction-store';
import { ExtractionStatus } from '@/types/pdf.types';
import { PdfUploader } from '@/components/pdf/pdf-uploader';
import { ExtractionResults } from '@/components/pdf/extraction-results';
import { BatchQueue } from '@/components/pdf/batch-queue';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { generateShareLink } from '@/utils/sharing';
import { toast } from 'sonner';
export function HomePage() {
  const status = useExtractionStore(s => s.status);
  const reset = useExtractionStore(s => s.reset);
  const structuredData = useExtractionStore(s => s.structuredData);
  const queue = useExtractionStore(s => s.queue);
  const handleShare = () => {
    const link = generateShareLink(structuredData);
    navigator.clipboard.writeText(link);
    toast.success('Shareable workspace link copied!');
  };
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <AnimatePresence mode="wait">
            {status === ExtractionStatus.IDLE || status === ExtractionStatus.ERROR ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center"
              >
                <header className="mb-16 text-center max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 fill-primary/20" />
                    v3.0: Intelligent Batch Templates
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6">
                    Structure the <span className="text-primary italic">Unstructured</span>
                  </h1>
                  <p className="text-muted-foreground text-xl leading-relaxed mb-10">
                    Structura transforms messy PDFs into clean, logical data streams.
                    Batch process documents with smart templates.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <PdfUploader />
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                  <FeatureCard icon={<Layout className="w-6 h-6" />} title="Smart Templates" description="Automatic identification of Invoices vs. Insurance policies." />
                  <FeatureCard icon={<Shield className="w-6 h-6" />} title="Batch Processing" description="Upload multiple files and watch them process in sequence." />
                  <FeatureCard icon={<Zap className="w-6 h-6" />} title="Privacy First" description="Browser-only OCR and extraction. Your data stays yours." />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Workspace</h2>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-tighter">
                          Live Template Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Editing and refining extracted entities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-full">
                      <Share2 className="mr-2 w-4 h-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={reset} className="rounded-full">
                      New Batch
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <BatchQueue />
                <ExtractionResults />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-card border border-border/50 shadow-soft hover:shadow-glow hover:border-primary/20 transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}