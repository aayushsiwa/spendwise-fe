import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { TRecord } from '@/types/Records';
import { QueryHookOptions } from '@/types/api';

export type Pagination = {
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
};

type GetRecordsAPIResponse = Pagination & {
  records: TRecord[];
};

type GetRecordsResponse = AxiosResponse<GetRecordsAPIResponse>;

type GetRecordsRequest = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  category?: string;
  type?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
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
      ...res.data,
    },
  };
};

export const useGetRecordsAPI = (
  { page = 1, limit = 10, ...filters }: GetRecordsRequest,
  options?: QueryHookOptions<GetRecordsResponse>
): QueryObserverResult<GetRecordsResponse> => {
  return useQuery({
    queryKey: [
      QueryKeys.RECORDS,
      page,
      limit,
      filters.from,
      filters.to,
      filters.category,
      filters.type,
      filters.search,
      filters.minAmount,
      filters.maxAmount,
    ],
    queryFn: () => getRecordsAPI({ page, limit, ...filters }),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    ...options,
  });
};
