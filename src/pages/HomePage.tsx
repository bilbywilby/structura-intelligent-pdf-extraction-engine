import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Shield, Zap, Layout, ArrowRight } from 'lucide-react';
import { useExtractionStore } from '@/store/extraction-store';
import { ExtractionStatus } from '@/types/pdf.types';
import { PdfUploader } from '@/components/pdf/pdf-uploader';
import { ExtractionResults } from '@/components/pdf/extraction-results';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const status = useExtractionStore(s => s.status);
  const reset = useExtractionStore(s => s.reset);
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <AnimatePresence mode="wait">
            {status === ExtractionStatus.IDLE || status === ExtractionStatus.VALIDATING || status === ExtractionStatus.EXTRACTING || status === ExtractionStatus.ERROR ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center"
              >
                {/* Hero Section */}
                <header className="mb-16 text-center max-w-3xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 fill-primary/20" />
                    Revolutionizing PDF Layout Analysis
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 bg-clip-text">
                    Structure the <span className="text-primary italic">Unstructured</span>
                  </h1>
                  <p className="text-muted-foreground text-xl leading-relaxed mb-10">
                    Structura transforms messy PDFs into clean, logical data streams using advanced spatial analysis. 
                    Local-first, secure, and blazing fast.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <PdfUploader />
                  </div>
                </header>
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                  <FeatureCard 
                    icon={<Layout className="w-6 h-6" />}
                    title="Layout Aware"
                    description="Our engine reconstructs visual flows, tables, and columns by analyzing spatial geometry."
                  />
                  <FeatureCard 
                    icon={<Shield className="w-6 h-6" />}
                    title="Privacy First"
                    description="Files are processed entirely in your browser. No data ever hits our servers."
                  />
                  <FeatureCard 
                    icon={<Zap className="w-6 h-6" />}
                    title="High Performance"
                    description="Powered by binary parsing and optimized workers for instant results."
                  />
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
                      <h2 className="text-2xl font-bold tracking-tight">Workspace</h2>
                      <p className="text-sm text-muted-foreground">Reviewing extraction results and layout maps</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Upload New
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
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
      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}