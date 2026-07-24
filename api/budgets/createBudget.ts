import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';

type CreateBudgetRequest = {
  categoryID: string;
  month: number;
  year: number;
  amount: number;
};

type CreateBudgetResponse = AxiosResponse<{ message: string; ID: string }>;

export const createBudgetAPI = async (
  data: CreateBudgetRequest
): Promise<CreateBudgetResponse> => {
  const res = await PrivateAxios.post<{ message: string; ID: string }>(
    '/api/budgets',
    data
  );
  return res;
};

export const useCreateBudgetAPI = () => {
  return useMutation({
    mutationFn: createBudgetAPI,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BUDGETS, QueryKeys.BUDGET_PROGRESS],
      });
    },
  });
};
