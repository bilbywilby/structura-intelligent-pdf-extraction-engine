import React from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Copy, RefreshCw } from 'lucide-react';
import { PdfPreview } from './pdf-preview';
import { toast } from 'sonner';
export function ExtractionResults() {
  const file = useExtractionStore((s) => s.file);
  const pages = useExtractionStore((s) => s.pages);
  const currentPage = useExtractionStore((s) => s.currentPage);
  const totalPages = useExtractionStore((s) => s.totalPages);
  const setCurrentPage = useExtractionStore((s) => s.setCurrentPage);
  const reset = useExtractionStore((s) => s.reset);
  const currentPageData = pages.find(p => p.pageNumber === currentPage);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  const jsonOutput = JSON.stringify({
    fileName: file?.name,
    totalPages,
    pages: pages.map(p => ({
      page: p.pageNumber,
      content: p.lines
    }))
  }, null, 2);
  if (!file) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left: PDF Visual Preview */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Visual Preview
            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
              Page {currentPage} of {totalPages}
            </span>
          </h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <PdfPreview 
          file={file} 
          pageNumber={currentPage} 
          className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900" 
        />
      </div>
      {/* Right: Extracted Content */}
      <Card className="flex flex-col border-none shadow-none lg:border-l lg:rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Extraction Output</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New File
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Tabs defaultValue="lines" className="h-full flex flex-col">
            <div className="px-6 border-b">
              <TabsList className="w-full justify-start h-12 bg-transparent gap-6">
                <TabsTrigger value="lines" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Normalized Text</TabsTrigger>
                <TabsTrigger value="json" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">JSON Output</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="lines" className="flex-1 p-6 m-0 h-[calc(100vh-24rem)]">
              <div className="relative h-full">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 z-10"
                  onClick={() => copyToClipboard(currentPageData?.lines.join('\n') || '')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <ScrollArea className="h-full w-full rounded-md border bg-muted/20 p-4">
                  <div className="space-y-2 font-mono text-sm">
                    {currentPageData?.lines.map((line, i) => (
                      <p key={i} className="text-foreground border-b border-muted-foreground/10 pb-1 last:border-0">
                        {line}
                      </p>
                    )) || <p className="text-muted-foreground italic">No text extracted from this page.</p>}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="json" className="flex-1 p-6 m-0 h-[calc(100vh-24rem)]">
              <div className="relative h-full">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 z-10"
                  onClick={() => copyToClipboard(jsonOutput)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <ScrollArea className="h-full w-full rounded-md border bg-muted/20 p-4">
                  <pre className="text-xs text-foreground font-mono leading-relaxed">
                    {jsonOutput}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}