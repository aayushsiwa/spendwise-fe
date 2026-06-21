import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Category } from '@/types/Categories';

type UpdateCategoryResponse = AxiosResponse<Category>;

export const updateCategoryAPI = async (
  id: number,
  data: Partial<Omit<Category, 'id'>>
): Promise<UpdateCategoryResponse> => {
  const res = await PrivateAxios.patch<Category>(
    `/api/categories/${id}`,
    data
  );
  return res;
};

export const useUpdateCategoryAPI = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Category, 'id'>> }) =>
      updateCategoryAPI(id, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
    },
  });
};
