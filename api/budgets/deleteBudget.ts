import { useMutation } from '@tanstack/react-query';

import { PrivateAxios, queryClient } from '@/api/index';
import { invalidateOnChange } from '@/constants/QueryInvalidation';
import { QueryKeys } from '@/constants/QueryKeys';

export const deleteBudgetAPI = async (ID: string): Promise<void> => {
  await PrivateAxios.delete(`/api/budgets/${ID}`);
};

export const useDeleteBudgetAPI = () => {
  return useMutation({
    mutationFn: deleteBudgetAPI,
    onSettled: () => {
      invalidateOnChange(queryClient, QueryKeys.BUDGETS);
    },
  });
};
