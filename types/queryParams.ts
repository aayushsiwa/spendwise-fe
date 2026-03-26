export type PaginationQueryParams = {
  page?: number;
  limit?: number;
};

export enum TimeFrame {
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}

export type TimeFrameQueryParams = {
  timeframe?: TimeFrame;
  year?: number;
  quarter?: number;
  month?: number;
};

export enum RecordType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
}

export type BaseQueryParams = TimeFrameQueryParams &
  PaginationQueryParams & {
    from?: string;
    to?: string;
    category?: string;
    type?: RecordType;
    minAmount?: number;
    maxAmount?: number;
    groupBy?: string;
    search?: string;
  };
