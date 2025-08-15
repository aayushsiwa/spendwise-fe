import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { PrivateAxios } from '@/pages/api/index';
import { Category } from '@/types/Categories';
import { QueryHookOptions } from '@/types/api';

type GetCategoriesAPIResponse = {
  categories: Category[];
};
type GetCategoriesResponse = AxiosResponse<GetCategoriesAPIResponse>;

export const getCategoriesAPI = async (): Promise<GetCategoriesResponse> => {
  const res =
    await PrivateAxios.get<GetCategoriesAPIResponse>(`/api/categories`);

  return res;
};

export const useGetCategoriesAPI = (
  options?: QueryHookOptions<GetCategoriesResponse>
): QueryObserverResult<GetCategoriesResponse> => {
  return useQuery({
    queryKey: [QueryKeys.CATEGORIES],
    queryFn: getCategoriesAPI,
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    ...options,
  });
};
