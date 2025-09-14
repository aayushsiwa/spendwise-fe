export interface Record {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: RecordTypes;
  note: string;
}

export type RecordQuery = {
  data: { records: Record[] };
};

export type RecordTypes = 'income' | 'expense' | 'transfer';

export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}
