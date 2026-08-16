import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { invalidateOnChange } from '@/constants/QueryInvalidation';
import { QueryKeys } from '@/constants/QueryKeys';

type DeleteCategoryResponse = AxiosResponse<void>;

export const deleteCategoryAPI = async (
  ID: string
): Promise<DeleteCategoryResponse> => {
  const res = await PrivateAxios.delete(`/api/categories/${ID}`);
  return res;
};

export const useDeleteCategoryAPI = () => {
  return useMutation({
    mutationFn: deleteCategoryAPI,
    onSettled: () => {
      invalidateOnChange(queryClient, QueryKeys.CATEGORIES);
    },
  });
};
