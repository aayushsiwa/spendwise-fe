import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Category } from '@/types/Categories';

type UpdateCategoryResponse = AxiosResponse<Category>;

export const updateCategoryAPI = async (
  ID: string,
  data: Partial<Omit<Category, 'ID'>>
): Promise<UpdateCategoryResponse> => {
  const res = await PrivateAxios.patch<Category>(`/api/categories/${ID}`, data);
  return res;
};

export const useUpdateCategoryAPI = () => {
  return useMutation({
    mutationFn: ({
      ID,
      data,
    }: {
      ID: string;
      data: Partial<Omit<Category, 'ID'>>;
    }) => updateCategoryAPI(ID, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
    },
  });
};
