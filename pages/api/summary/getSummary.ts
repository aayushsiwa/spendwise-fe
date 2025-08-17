import { QueryObserverResult, useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/constants/QueryKeys';
import { PrivateAxios } from '@/pages/api/index';
import { SummaryMonth } from '@/types/Summary';

type GetSummaryAPIResponse = { summary: SummaryMonth };

export const getSummaryAPI = async (month: string): Promise<SummaryMonth> => {
  const res = await PrivateAxios.get<GetSummaryAPIResponse>(
    `/api/summary/month/${month}`
  );

  const summary = { ...res.data.summary };

  return summary;
};

export const useGetSummaryAPI = (
  month: string
): QueryObserverResult<SummaryMonth> => {
  return useQuery({
    queryKey: [QueryKeys.SUMMARY, month],
    queryFn: () => getSummaryAPI(month),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};
