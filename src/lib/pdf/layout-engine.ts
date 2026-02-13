import { RawTextItem } from './pdf-worker';
export interface PageContent {
  lines: string[];
}
export function normalizeLayout(items: RawTextItem[]): PageContent {
  if (items.length === 0) return { lines: [] };
  // 1. Group items by Y coordinate with a tolerance (approx. line height)
  // PDF coordinates usually start from bottom-left
  const Y_TOLERANCE = 5; 
  const sortedItems = [...items].sort((a, b) => {
    // Primary sort: Y descending (top to bottom)
    if (Math.abs(a.y - b.y) > Y_TOLERANCE) {
      return b.y - a.y;
    }
    // Secondary sort: X ascending (left to right)
    return a.x - b.x;
  });
  const lines: string[] = [];
  let currentLineItems: RawTextItem[] = [];
  let lastY = sortedItems[0].y;
  for (const item of sortedItems) {
    if (Math.abs(item.y - lastY) > Y_TOLERANCE) {
      // New line detected
      lines.push(currentLineItems.map(i => i.str).join(' ').trim());
      currentLineItems = [item];
      lastY = item.y;
    } else {
      currentLineItems.push(item);
    }
  }
  // Push the last line
  if (currentLineItems.length > 0) {
    lines.push(currentLineItems.map(i => i.str).join(' ').trim());
  }
  return {
    lines: lines.filter(line => line.length > 0),
  };
}