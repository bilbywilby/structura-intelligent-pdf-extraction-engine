export enum ExtractionStatus {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  EXTRACTING = 'EXTRACTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
export interface RawTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  transform: number[];
}
export interface PageData {
  pageNumber: number;
  lines: string[];
  rawItems: RawTextItem[];
}
export interface ExtractionResult {
  fileName: string;
  fileSize: number;
  totalPages: number;
  pages: PageData[];
  extractedAt: string;
}
export interface ExtractionError {
  message: string;
  code?: string;
}