import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Category } from '@/types/Categories';

type CreateCategoryAPIResponse = Category[];
type CreateCategoryResponse = AxiosResponse<CreateCategoryAPIResponse>;

export const createCategoryAPI = async (
  category: Omit<Category, 'id'>
): Promise<CreateCategoryResponse> => {
  const res = await PrivateAxios.post<CreateCategoryAPIResponse>(
    `/api/categories`,
    [category]
  );
  return res;
};

export const useCreateCategoryAPI = () => {
  return useMutation({
    mutationFn: createCategoryAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
    },
  });
};
