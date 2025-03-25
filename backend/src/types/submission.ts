export interface Submission {
  event: string; // _id
  fileType: string;
  fileLanguage: string;
  student: string;
  _id: string;
  fileURL: string;
  extractedContent?: string;
  finalScore?: number;
  submittedAt?: Date;
}
