export interface TRecord {
  ID: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: RecordTypes;
  note: string;
  balance: number;
}

export interface Record {
  ID: string;
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

export type RecordsQueryParams = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  category?: string;
  type?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
};
