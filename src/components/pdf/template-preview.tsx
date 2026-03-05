import React from 'react';
import { useExtractionStore } from '@/store/extraction-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, ShieldCheck, Receipt, BrainCircuit } from 'lucide-react';
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
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getDocIcon()}
            <h3 className="text-lg font-bold capitalize">{docType.replace('_', ' ')}</h3>
          </div>
          <Badge variant="outline" className="bg-background">
            <BrainCircuit className="w-3 h-3 mr-1" />
            {Math.round(confidence * 100)}% Match
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Review and refine the extracted template fields below.
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {field.key}
                  </Label>
                  <Input
                    id={field.key}
                    value={field.value}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="bg-background border-muted-foreground/20 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-10" />
              <p>No template fields mapped for this document type.</p>
            </div>
          )}
          <Card className="border-dashed border-2 bg-transparent">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Validation Notice</CardTitle>
              <CardDescription className="text-xs">
                Structura uses heuristic mapping. Always verify financial totals and IDs before exporting.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}