export interface Event {
  title: string;
  description: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  parameters: {
    name: string;
    priority: number;
  }[];
  keywords: {
    name: string;
    priority: number;
  }[];
  submissions: number;
  createdBy?: string;
  createdAt: Date;
}
