import { z } from 'zod';
export interface StructuredField {
  key: string;
  value: string;
  confidence: number;
  type: 'date' | 'amount' | 'id' | 'generic';
}
const PATTERNS = {
  DATE: /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(?:\d{4}[/-]\d{1,2}[/-]\d{1,2})|(?:[A-Z][a-z]+ \d{1,2},? \d{4})\b/g,
  AMOUNT: /(?:USD|EUR|GBP|\$|€|£)\s?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})|(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s?(?:USD|EUR|GBP|\$|€|£)/gi,
  INVOICE_ID: /\b(?:INV|INVOICE|ORDER|REF|ID)[:#\s-]*([A-Z0-9-]{4,20})\b/gi,
};
export function extractStructuredData(lines: string[]): Record<string, StructuredField> {
  const fields: Record<string, StructuredField> = {};
  const fullText = lines.join(' ');
  // 1. Extract Dates
  const dates = fullText.match(PATTERNS.DATE);
  if (dates && dates.length > 0) {
    fields['Document Date'] = {
      key: 'Document Date',
      value: dates[0],
      confidence: 0.95,
      type: 'date'
    };
  }
  // 2. Extract Amounts (Look for the largest amount which is usually the total)
  let maxAmount = -1;
  let amountStr = '';
  let match;
  while ((match = PATTERNS.AMOUNT.exec(fullText)) !== null) {
    const val = parseFloat((match[1] || match[2]).replace(/,/g, ''));
    if (val > maxAmount) {
      maxAmount = val;
      amountStr = match[0];
    }
  }
  if (amountStr) {
    fields['Total Amount'] = {
      key: 'Total Amount',
      value: amountStr,
      confidence: 0.85,
      type: 'amount'
    };
  }
  // 3. Extract IDs
  let idMatch;
  while ((idMatch = PATTERNS.INVOICE_ID.exec(fullText)) !== null) {
    const val = idMatch[1];
    if (val) {
      fields['Identifier'] = {
        key: 'Identifier',
        value: val,
        confidence: 0.9,
        type: 'id'
      };
      break; 
    }
  }
  return fields;
}