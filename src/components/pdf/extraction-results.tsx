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
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Terminal,
  LayoutList,
  Braces,
  BrainCircuit,
  Loader2,
  FileEdit,
  Download,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PdfPreview } from './pdf-preview';
import { TemplatePreview } from './template-preview';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { downloadAsCsv, downloadAsJson } from '@/utils/sharing';
export function ExtractionResults() {
  const file = useExtractionStore(s => s.file);
  const pages = useExtractionStore(s => s.pages);
  const currentPage = useExtractionStore(s => s.currentPage);
  const totalPages = useExtractionStore(s => s.totalPages);
  const setCurrentPage = useExtractionStore(s => s.setCurrentPage);
  const isOcrActive = useExtractionStore(s => s.isOcrActive);
  const structuredData = useExtractionStore(s => s.structuredData);
  const batchResults = useExtractionStore(s => s.batchResults);
  const setActiveFile = useExtractionStore(s => s.setActiveFile);
  const currentPageData = pages.find(p => p.pageNumber === currentPage);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied to clipboard');
  };
  if (!file) return null;
  return (
    <div className="relative h-[800px] w-full border rounded-3xl overflow-hidden bg-card shadow-2xl flex flex-col">
      {isOcrActive && (
        <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <div className="text-center">
            <h4 className="text-lg font-bold">Intelligent OCR Active</h4>
            <p className="text-muted-foreground text-sm">Deep-scanning visual layers for hidden text...</p>
          </div>
        </div>
      )}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={45} minSize={30} className="bg-slate-50 dark:bg-slate-900/50">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-muted rounded">
                Page {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
              <PdfPreview file={file} pageNumber={currentPage} className="max-w-full shadow-2xl" />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={40}>
          <div className="flex flex-col h-full bg-background">
            <Tabs defaultValue="template" className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 pt-4 border-b">
                <TabsList className="bg-transparent h-auto p-0 gap-6">
                  <TabsTrigger value="template" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <FileEdit className="w-4 h-4" /> Template
                  </TabsTrigger>
                  <TabsTrigger value="batch" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Batch
                  </TabsTrigger>
                  <TabsTrigger value="normalized" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 pt-0 px-0 flex items-center gap-2">
                    <LayoutList className="w-4 h-4" /> Text
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 pb-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full h-8">
                        <Download className="w-3.5 h-3.5 mr-2" /> Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => downloadAsJson(structuredData, file.name)}>
                        Download JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadAsCsv(structuredData, file.name)}>
                        Download CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <TabsContent value="template" className="flex-1 m-0 p-0 overflow-hidden">
                <TemplatePreview />
              </TabsContent>
              <TabsContent value="batch" className="flex-1 m-0 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Batch Overview</h4>
                    {Object.values(batchResults).map((res) => (
                      <div
                        key={res.fileName}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer hover:border-primary/30",
                          file.name === res.fileName ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-muted/10"
                        )}
                        onClick={() => setActiveFile(res.fileName)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-xl", res.status === 'complete' ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[200px]">{res.fileName}</p>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 capitalize">
                                 {res.docType.replace('_', ' ')}
                               </Badge>
                               <span className="text-[10px] text-muted-foreground">
                                 {res.pages.length} Pages
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {res.status === 'complete' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                          <Button variant="ghost" size="sm" className="h-8">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="normalized" className="flex-1 m-0 p-0 overflow-hidden">
                <ScrollArea className="h-full p-6">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="font-mono text-xs">RAW_LAYOUT_STREAM</Badge>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentPageData?.lines.join('\n') || '')}>
                            <Copy className="w-3 h-3 mr-2" /> Copy Page
                        </Button>
                    </div>
                    {currentPageData?.lines.map((line, idx) => (
                      <p key={idx} className="text-sm leading-relaxed text-foreground/80 hover:text-foreground transition-colors cursor-default select-all font-medium border-l-2 border-transparent hover:border-primary/20 pl-4">
                        {line}
                      </p>
                    )) ?? <div className="text-center py-20 text-muted-foreground"><Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>Empty page layer.</p></div>}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}