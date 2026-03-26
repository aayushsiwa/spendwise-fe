import { FC, createContext, useContext, useMemo, useState } from 'react';

import { usePeriodContext } from '@/lib/context/Period/Period';
import { SummaryMonth } from '@/types/Summary';
import { BaseQueryParams, TimeFrame } from '@/types/queryParams';
import { DateUtil } from '@/utils/DateUtils';

import { useSummaryProvider } from './Summary.hooks';

export type TSummaryContext = {
  summary?: SummaryMonth;
  queryParams: BaseQueryParams;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export const SummaryContext = createContext<TSummaryContext>(
  {} as unknown as TSummaryContext
);

export const SummaryProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { range } = usePeriodContext();

  const queryParams = useMemo<BaseQueryParams>(() => {
    return {
      from: DateUtil.formattedDate(range.from),
      to: DateUtil.formattedDate(range.to),
    };
  }, [range.from, range.to]);

  const { summary, isLoading, isError, isSuccess } =
    useSummaryProvider(queryParams);

  return (
    <SummaryContext.Provider
      value={{
        summary,
        queryParams,
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
