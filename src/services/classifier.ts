export type DocumentType = 'invoice' | 'insurance_policy' | 'generic';
export interface ClassificationResult {
  type: DocumentType;
  confidence: number;
}
const KEYWORDS = {
  insurance_policy: [
    'policy', 'premium', 'coverage', 'insured', 'beneficiary', 'deductible', 
    'underwriting', 'endorsement', 'liability', 'effective date', 'expiration date'
  ],
  invoice: [
    'invoice', 'bill to', 'ship to', 'tax id', 'purchase order', 'due date',
    'quantity', 'unit price', 'subtotal', 'vat', 'gst', 'remittance'
  ]
};
export function classifyDocument(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  let insuranceScore = 0;
  let invoiceScore = 0;
  KEYWORDS.insurance_policy.forEach(word => {
    if (lowerText.includes(word)) insuranceScore++;
  });
  KEYWORDS.invoice.forEach(word => {
    if (lowerText.includes(word)) invoiceScore++;
  });
  const totalPossibleInsurance = KEYWORDS.insurance_policy.length;
  const totalPossibleInvoice = KEYWORDS.invoice.length;
  const insuranceNorm = insuranceScore / totalPossibleInsurance;
  const invoiceNorm = invoiceScore / totalPossibleInvoice;
  if (insuranceNorm > invoiceNorm && insuranceNorm > 0.1) {
    return { type: 'insurance_policy', confidence: Math.min(0.99, 0.5 + insuranceNorm) };
  }
  if (invoiceNorm > insuranceNorm && invoiceNorm > 0.1) {
    return { type: 'invoice', confidence: Math.min(0.99, 0.5 + invoiceNorm) };
  }
  return { type: 'generic', confidence: 1.0 };
}