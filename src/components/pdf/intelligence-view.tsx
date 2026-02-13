import React from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar, Banknote, Fingerprint, Copy, Search, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
export function IntelligenceView() {
  const structuredData = useExtractionStore(s => s.structuredData);
  const fields = Object.values(structuredData);
  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success('Copied to clipboard');
  };
  const getIcon = (type: string) => {
    switch (type) {
      case 'date': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'amount': return <Banknote className="w-4 h-4 text-green-500" />;
      case 'id': return <Fingerprint className="w-4 h-4 text-orange-500" />;
      default: return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };
  if (fields.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <Search className="w-12 h-12 mb-4 opacity-10" />
        <p className="max-w-[240px]">No specific business fields were automatically identified.</p>
      </div>
    );
  }
  return (
    <ScrollArea className="h-full">
      <div className="p-6 grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Identified Entities</h3>
        </div>
        {fields.map((field) => (
          <Card key={field.key} className="group relative overflow-hidden border-border/50 hover:border-primary/20 transition-colors">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                {getIcon(field.type)}
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">{field.key}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyValue(field.value)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-lg font-bold truncate mb-3">{field.value}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Confidence Score</span>
                  <span>{Math.round(field.confidence * 100)}%</span>
                </div>
                <Progress value={field.confidence * 100} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}