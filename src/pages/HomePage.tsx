import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Shield, Zap, Layout, ArrowRight, Share2, Database } from 'lucide-react';
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
                <header className="mb-16 text-center max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20 shadow-sm"
                  >
                    <Database className="w-4 h-4 fill-primary/20" />
                    v4.0 Final: Enterprise Batch Pipeline
                  </motion.div>
                  <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight text-foreground mb-8 leading-[0.9]">
                    PDFs to <span className="text-primary italic">Precision</span> Data
                  </h1>
                  <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto">
                    A high-performance extraction engine that structures unstructured documents into validated JSON in seconds.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 mb-16">
                    <PdfUploader />
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                  <FeatureCard 
                    icon={<Layout className="w-6 h-6" />} 
                    title="Parallel Processing" 
                    description="Upload dozens of documents at once. We process batches with a concurrency of 3 for maximum efficiency." 
                  />
                  <FeatureCard 
                    icon={<Shield className="w-6 h-6" />} 
                    title="Intelligent Templates" 
                    description="Automatic classification for Invoices and Insurance Policies with context-aware field mapping." 
                  />
                  <FeatureCard 
                    icon={<Zap className="w-6 h-6" />} 
                    title="Client-Side Privacy" 
                    description="Your sensitive documents never leave your browser unless you explicitly choose cloud-offload." 
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full space-y-8"
              >
                <div className="flex items-center justify-between pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Extraction Engine</h2>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-mono text-[10px] px-2 py-0">
                          PIPELINE_ACTIVE
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Monitoring batch lifecycle and entity mapping</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-full h-10 px-5 border border-transparent hover:border-border">
                      <Share2 className="mr-2 w-4 h-4" /> Share Workspace
                    </Button>
                    <Button variant="default" size="sm" onClick={reset} className="rounded-full h-10 px-6 shadow-glow">
                      New Batch
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                   <BatchQueue />
                   <ExtractionResults />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-soft hover:shadow-glow-lg hover:border-primary/20 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  );
}