import type { RawTextItem } from '@/types/pdf.types';
export function normalizeLayout(items: RawTextItem[]): { lines: string[] } {
  if (items.length === 0) return { lines: [] };
  // 1. Sort primarily by Y (top to bottom), then by X (left to right)
  // PDF coordinates: Y increases upwards. We want top-down, so we sort Y descending.
  const sortedItems = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 5) { // Tolerance for items on the same line
      return a.x - b.x;
    }
    return b.y - a.y;
  });
  const lines: string[] = [];
  let currentLine: RawTextItem[] = [];
  let currentY = sortedItems[0]?.y ?? 0;
  // 2. Group into lines based on Y-coordinate proximity
  for (const item of sortedItems) {
    if (Math.abs(item.y - currentY) > 5) {
      // New line detected
      lines.push(currentLine.map(i => i.str).join(' ').trim());
      currentLine = [item];
      currentY = item.y;
    } else {
      currentLine.push(item);
    }
  }
  // Push the last line
  if (currentLine.length > 0) {
    lines.push(currentLine.map(i => i.str).join(' ').trim());
  }
  return { lines: lines.filter(l => l.length > 0) };
}