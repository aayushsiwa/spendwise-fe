export type PaginationQueryParams = { page?: number; limit?: number };

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

export type BaseQueryParams = TimeFrameQueryParams &
  PaginationQueryParams & {
    from?: string;
    to?: string;
    category?: string;
    type?: 'income' | 'expense' | 'transfer';
    minAmount?: number;
    maxAmount?: number;
    groupBy?: string;
    search?: string;
  };
