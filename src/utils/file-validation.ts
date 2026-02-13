import { z } from 'zod';
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];
export const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size must be less than 25MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Only .pdf files are accepted.'
  );
export interface ValidationResult {
  success: boolean;
  error?: string;
}
export function validatePdfFile(file: File): ValidationResult {
  const result = pdfFileSchema.safeParse(file);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Invalid file validation.',
    };
  }
  return { success: true };
}