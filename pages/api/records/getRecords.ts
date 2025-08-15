import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { PrivateAxios } from '@/pages/api/index';
import { Record } from '@/types/Records';
import { QueryHookOptions } from '@/types/api';

export type Pagination = {
  has_next: boolean;
  has_prev: boolean;
  limit: number;
  page: number;
  total_count: number;
  total_pages: number;
};

type GetRecordsAPIResponse = {
  records: Record[];
  pagination: Pagination;
};
type GetRecordsResponse = AxiosResponse<GetRecordsAPIResponse>;

type GetRecordsRequest = {
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

export const getRecordsAPI = async (
  params: GetRecordsRequest
): Promise<GetRecordsResponse> => {
  // Build query parameters
  const queryParams = new URLSearchParams();

  // Add filter params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const res = await PrivateAxios.get<GetRecordsAPIResponse>(
    `/api/records?${queryParams.toString()}`
  );

  return {
    ...res,
    data: {
      records: res.data.records ?? [],
      pagination: res.data.pagination ?? {
        has_next: false,
        has_prev: false,
        limit: 10,
        page: 1,
        total_count: 0,
        total_pages: 0,
      },
    },
  };
};

export const useGetRecordsAPI = (
  { page = 1, limit = 10, ...filters }: GetRecordsRequest,
  options?: QueryHookOptions<GetRecordsResponse>
): QueryObserverResult<GetRecordsResponse> => {
  return useQuery({
    queryKey: [QueryKeys.RECORDS, { page, limit, ...filters }],
    queryFn: () => getRecordsAPI({ page, limit, ...filters }),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    ...options,
  });
};
