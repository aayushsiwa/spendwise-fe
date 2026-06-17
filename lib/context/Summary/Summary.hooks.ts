import { useGetSummaryAPI } from '@/api/summary/getSummary';
import { BaseQueryParams } from '@/types/queryParams';

import { TSummaryContext } from './Summary';

export const useSummaryProvider = (
  params: BaseQueryParams
): Omit<TSummaryContext, 'setQueryParams'> => {
  const { data, isLoading, isError, isSuccess } = useGetSummaryAPI(params);

  return {
    summary: data,
    queryParams: params,
    isLoading,
    isError,
    isSuccess,
  };
};
