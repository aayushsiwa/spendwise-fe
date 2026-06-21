import { QueryObserverResult, useQuery } from '@tanstack/react-query';

import { PrivateAxios } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { SummaryMonth } from '@/types/Summary';

export type GetSummaryByFilterAPIResponse = { summary: SummaryMonth };

export type GetSummaryByFilterRequest = {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  category?: string;
  type?: string;
  description?: string;
  min_amount?: number;
  max_amount?: number;
};

export const getSummaryByFilterAPI = async (
  params: GetSummaryByFilterRequest
): Promise<SummaryMonth> => {
  const queryParams = new URLSearchParams();

  // Add filter params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const res = await PrivateAxios.get<GetSummaryByFilterAPIResponse>(
    `/api/summary/filter?${queryParams.toString()}`
  );

  const summary = { ...res.data.summary };

  return summary;
};

export const useGetSummaryByFilterAPI = (
  params: GetSummaryByFilterRequest = {}
): QueryObserverResult<SummaryMonth> => {
  return useQuery({
    queryKey: [QueryKeys.SUMMARY_FILTER, params],
    queryFn: () => getSummaryByFilterAPI(params),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};
