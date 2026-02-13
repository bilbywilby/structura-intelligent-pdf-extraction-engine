import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { useExtractionStore } from '@/store/extraction-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Copy, Terminal, LayoutList, Braces, BrainCircuit, Loader2 } from 'lucide-react';
import { PdfPreview } from './pdf-preview';
import { IntelligenceView } from './intelligence-view';
import { toast } from 'sonner';
export function ExtractionResults() {
  const file = useExtractionStore(s => s.file);
  const pages = useExtractionStore(s => s.pages);
  const currentPage = useExtractionStore(s => s.currentPage);
  const totalPages = useExtractionStore(s => s.totalPages);
  const setCurrentPage = useExtractionStore(s => s.setCurrentPage);
  const isOcrActive = useExtractionStore(s => s.isOcrActive);
  const currentPageData = pages.find(p => p.pageNumber === currentPage);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied to clipboard');
  };
  const fullJsonOutput = JSON.stringify({
    metadata: { fileName: file?.name, processedAt: new Date().toISOString() },
    pages: pages.map(p => ({ number: p.pageNumber, lines: p.lines }))
  }, null, 2);
  if (!file) return null;
  return (
    <div className="relative h-[750px] w-full border rounded-3xl overflow-hidden bg-card shadow-2xl">
      {isOcrActive && (
        <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <div className="text-center">
            <h4 className="text-lg font-bold">Scanning Document</h4>
            <p className="text-muted-foreground">Performing OCR on image-heavy pages...</p>
          </div>
        </div>
      )}
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-muted rounded">
                Page {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <PdfPreview file={file} pageNumber={currentPage} className="max-w-full shadow-2xl" />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <Tabs defaultValue="intelligence" className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 pt-4 border-b">
                <TabsList className="bg-transparent h-auto p-0 gap-6">
                  <TabsTrigger value="intelligence" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Intelligence
                  </TabsTrigger>
                  <TabsTrigger value="normalized" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <LayoutList className="w-4 h-4" /> Normalized
                  </TabsTrigger>
                  <TabsTrigger value="json" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <Braces className="w-4 h-4" /> JSON
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="intelligence" className="flex-1 m-0 p-0 overflow-hidden">
                <IntelligenceView />
              </TabsContent>
              <TabsContent value="normalized" className="flex-1 m-0 p-0 overflow-hidden">
                <ScrollArea className="h-full p-6">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {currentPageData?.lines.map((line, idx) => (
                      <p key={idx} className="text-sm leading-relaxed text-foreground font-medium">{line}</p>
                    )) ?? <div className="text-center py-20 text-muted-foreground"><Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>No text found.</p></div>}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="json" className="flex-1 m-0 p-0 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <div className="relative h-full">
                  <Button variant="secondary" size="sm" className="absolute top-4 right-8 z-20 rounded-full" onClick={() => copyToClipboard(fullJsonOutput)}>
                    <Copy className="w-3.5 h-3.5 mr-2" /> Copy Full JSON
                  </Button>
                  <ScrollArea className="h-full p-6">
                    <pre className="text-[13px] font-mono leading-relaxed text-blue-600 dark:text-blue-400">{fullJsonOutput}</pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}