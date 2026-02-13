import React from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Receipt, BrainCircuit, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
export function TemplatePreview() {
  const structuredData = useExtractionStore(s => s.structuredData);
  const docType = useExtractionStore(s => s.docType);
  const confidence = useExtractionStore(s => s.classificationConfidence);
  const updateField = useExtractionStore(s => s.updateField);
  const fields = Object.values(structuredData);
  const getDocIcon = () => {
    switch (docType) {
      case 'insurance_policy': return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'invoice': return <Receipt className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };
  const handleSave = () => {
    toast.success('Template changes saved locally');
  };
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getDocIcon()}
            <h3 className="text-lg font-bold capitalize">{docType.replace('_', ' ')} Template</h3>
            <Badge variant="outline" className="bg-background ml-2">
              <BrainCircuit className="w-3 h-3 mr-1" />
              {Math.round(confidence * 100)}% Match
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Verify and adjust the mapped business entities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Reset not implemented')}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={field.key} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                      {field.key}
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      Conf: {Math.round(field.confidence * 100)}%
                    </span>
                  </div>
                  <Input
                    id={field.key}
                    value={field.value}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="h-10 bg-background border-muted-foreground/20 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <FileText className="w-16 h-16 mb-4 opacity-5" />
              <h4 className="text-lg font-semibold">No Templates Mapped</h4>
              <p className="max-w-xs text-sm">We couldn't identify a standard template for this document. You can still view raw text in the Normalized tab.</p>
            </div>
          )}
          <Card className="border-amber-200/50 bg-amber-50/30 dark:bg-amber-900/10 border-dashed">
            <CardHeader className="p-4 flex-row items-start gap-3 space-y-0">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <CardTitle className="text-sm font-bold text-amber-800 dark:text-amber-200">Validation Notice</CardTitle>
                <CardDescription className="text-xs text-amber-700/80 dark:text-amber-300/60 leading-relaxed">
                  Extracted values are generated via pattern-matching. Please double-check critical fields like Policy Numbers and Billing Totals.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}