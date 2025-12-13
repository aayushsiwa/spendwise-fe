import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';

import { SummaryQueryParams, TSummaryContext } from './Summary';

export const useSummaryProvider = (
  params: SummaryQueryParams
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
