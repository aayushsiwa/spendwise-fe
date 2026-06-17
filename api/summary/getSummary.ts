import { QueryObserverResult, useQuery } from '@tanstack/react-query';

import { PrivateAxios } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { SummaryMonth } from '@/types/Summary';
import { BaseQueryParams } from '@/types/queryParams';

type GetSummaryAPIResponse = { summary: SummaryMonth };

type GetSummaryAPIRequest = BaseQueryParams;

export const getSummaryAPI = async (
  params: GetSummaryAPIRequest
): Promise<SummaryMonth> => {
  const queryParams = new URLSearchParams();

  // Add filter params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const res = await PrivateAxios.get<GetSummaryAPIResponse>(
    `/api/summary?${queryParams.toString()}`
  );

  const summary = { ...res.data.summary };

  return summary;
};

export const useGetSummaryAPI = (
  params: GetSummaryAPIRequest
): QueryObserverResult<SummaryMonth> => {
  return useQuery({
    queryKey: [QueryKeys.SUMMARY, params],
    queryFn: () => getSummaryAPI(params),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};
