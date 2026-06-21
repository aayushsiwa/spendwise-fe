import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';

type DeleteCategoryResponse = AxiosResponse<void>;

export const deleteCategoryAPI = async (
  id: number
): Promise<DeleteCategoryResponse> => {
  const res = await PrivateAxios.delete(`/api/categories/${id}`);
  return res;
};

export const useDeleteCategoryAPI = () => {
  return useMutation({
    mutationFn: deleteCategoryAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
    },
  });
};
