export interface Submission {
  _id: string;
  student: string;
  title: string;
  description: string;
  fileURL: string;
  extractedContent?: string;
  event: string;
  rubric?: string;
  finalScore?: number;
  submittedAt: Date;
}
