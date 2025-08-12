export interface Record {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
  notes: string;
}

export type RecordQuery = {
  data: { records: Record[] };
};
