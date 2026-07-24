import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';

type UpdateBudgetRequest = {
  ID: string;
  amount: number;
};

type UpdateBudgetResponse = AxiosResponse<{ message: string; ID: string }>;

export const updateBudgetAPI = async ({
  ID,
  amount,
}: UpdateBudgetRequest): Promise<UpdateBudgetResponse> => {
  const res = await PrivateAxios.patch<{ message: string; ID: string }>(
    `/api/budgets/${ID}`,
    { amount }
  );
  return res;
};

export const useUpdateBudgetAPI = () => {
  return useMutation({
    mutationFn: updateBudgetAPI,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BUDGETS, QueryKeys.BUDGET_PROGRESS],
      });
    },
  });
};
