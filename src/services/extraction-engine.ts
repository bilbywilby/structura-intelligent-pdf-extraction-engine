import type { DocumentType } from './classifier';
export interface StructuredField {
  key: string;
  value: string;
  confidence: number;
  type: 'date' | 'amount' | 'id' | 'generic' | 'name';
}
const PATTERNS = {
  DATE: /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(?:\d{4}[/-]\d{1,2}[/-]\d{1,2})|(?:[A-Z][a-z]+ \d{1,2},? \d{4})\b/g,
  AMOUNT: /(?:USD|EUR|GBP|\$|€|£)\s?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})|(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s?(?:USD|EUR|GBP|\$|€|£)/gi,
  INVOICE_ID: /\b(?:INV|INVOICE|ORDER|REF|ID)[:#\s-]*([A-Z0-9-]{4,20})\b/gi,
  POLICY_ID: /\b(?:POL|POLICY|PLAN)[:#\s-]*([A-Z0-9-]{6,25})\b/gi,
  NAME: /\b(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s?([A-Z][a-z]+ [A-Z][a-z]+)\b/g,
};
export function extractStructuredData(lines: string[], docType: DocumentType = 'generic'): Record<string, StructuredField> {
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
    if (docType === 'insurance_policy' && dates.length > 1) {
       fields['Effective Date'] = {
        key: 'Effective Date',
        value: dates[1],
        confidence: 0.85,
        type: 'date'
      };
    }
  }
  // 2. Extract Amounts
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
    const label = docType === 'insurance_policy' ? 'Premium Amount' : 'Total Amount';
    fields[label] = {
      key: label,
      value: amountStr,
      confidence: 0.85,
      type: 'amount'
    };
  }
  // 3. Extract IDs based on type
  if (docType === 'insurance_policy') {
    let polMatch = PATTERNS.POLICY_ID.exec(fullText);
    if (polMatch && polMatch[1]) {
      fields['Policy Number'] = {
        key: 'Policy Number',
        value: polMatch[1],
        confidence: 0.9,
        type: 'id'
      };
    }
  } else {
    let invMatch = PATTERNS.INVOICE_ID.exec(fullText);
    if (invMatch && invMatch[1]) {
      fields['Identifier'] = {
        key: 'Identifier',
        value: invMatch[1],
        confidence: 0.9,
        type: 'id'
      };
    }
  }
  // 4. Extract Names for Insurance
  if (docType === 'insurance_policy') {
    const names = fullText.match(PATTERNS.NAME);
    if (names && names.length > 0) {
      fields['Insured Name'] = {
        key: 'Insured Name',
        value: names[0],
        confidence: 0.75,
        type: 'name'
      };
    }
  }
  return fields;
}