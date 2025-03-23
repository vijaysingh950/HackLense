export interface Rubric {
  title: string;
  description: string;
  parameters: {
    name: string;
    weightage: number;
  }[];
  keywords: {
    type: string;
    weightage: number;
  }[];
  createdBy: string;
  createdAt: Date;
}
