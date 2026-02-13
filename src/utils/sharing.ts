import type { StructuredField } from '@/services/extraction-engine';
export function downloadAsJson(data: Record<string, StructuredField>, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.replace('.pdf', '')}_extracted.json`;
  a.click();
  URL.revokeObjectURL(url);
}
export function downloadAsCsv(data: Record<string, StructuredField>, fileName: string) {
  const fields = Object.values(data);
  const header = 'Key,Value,Confidence,Type\n';
  const rows = fields.map(f => 
    `"${f.key}","${f.value.replace(/"/g, '""')}","${f.confidence}","${f.type}"`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.replace('.pdf', '')}_extracted.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
export function generateShareLink(data: Record<string, StructuredField>): string {
  try {
    const encoded = btoa(JSON.stringify(data));
    const url = new URL(window.location.href);
    url.searchParams.set('share', encoded);
    return url.toString();
  } catch (e) {
    console.error('Failed to generate share link', e);
    return window.location.href;
  }
}