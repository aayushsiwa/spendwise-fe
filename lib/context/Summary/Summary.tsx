import { FC, createContext, useContext, useState } from 'react';

import { SummaryMonth } from '@/types/Summary';

import { useSummaryProvider } from './Summary.hooks';

export type TSummaryContext = {
  summary?: SummaryMonth;
  queryParams: SummaryQueryParams;
  setQueryParams: (params: SummaryQueryParams) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

type SummaryByMonthQueryParams = {
  month: string;
};

type SummaryByDateRangeQueryParams = {
  from: string;
  to: string;
};

export type SummaryQueryParams =
  | SummaryByMonthQueryParams
  | SummaryByDateRangeQueryParams;

export const SummaryContext = createContext<TSummaryContext>(
  {} as unknown as TSummaryContext
);

export const SummaryProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<SummaryQueryParams>({
    month: new Date().toISOString().slice(0, 7),
  });

  const { summary, isLoading, isError, isSuccess } =
    useSummaryProvider(queryParams);

  return (
    <SummaryContext.Provider
      value={{
        summary,
        queryParams,
        setQueryParams,
        isLoading,
        isError,
        isSuccess,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummaryContext = (): TSummaryContext =>
  useContext(SummaryContext);
