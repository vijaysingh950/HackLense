export interface Event {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  rubric: string;
  participants: number[];
  submissions: number[];
  createdBy: string;
  createdAt: Date;
}
