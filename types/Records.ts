export interface Record {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: RecordTypes;
  note: string;
  balance: number;
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
