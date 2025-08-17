import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { PrivateAxios } from '@/pages/api/index';
import { SummaryMonth } from '@/types/Summary';
import { QueryHookOptions } from '@/types/api';

type GetSummariesAPIResponse = {
  summary: {
    [key: string]: SummaryMonth;
  };
};

type GetSummariesResponse = AxiosResponse<GetSummariesAPIResponse>;

export const getSummariesAPI = async (): Promise<GetSummariesResponse> => {
  const res = await PrivateAxios.get<GetSummariesAPIResponse>(`/api/summary`);

  return res;
};

export const useGetSummariesAPI = (
  options?: QueryHookOptions<GetSummariesResponse>
): QueryObserverResult<GetSummariesResponse> => {
  return useQuery({
    queryKey: [QueryKeys.SUMMARIES],
    queryFn: getSummariesAPI,
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    ...options,
  });
};
