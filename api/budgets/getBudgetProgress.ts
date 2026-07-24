import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { BudgetProgress } from '@/types/Budget';
import { QueryHookOptions } from '@/types/api';

type GetBudgetProgressResponse = AxiosResponse<{ progress: BudgetProgress[] }>;

type GetBudgetProgressRequest = {
  month?: number;
  year?: number;
};

export const getBudgetProgressAPI = async (
  params?: GetBudgetProgressRequest
): Promise<GetBudgetProgressResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.year) queryParams.append('year', params.year.toString());
  const qs = queryParams.toString();
  const res = await PrivateAxios.get<{ progress: BudgetProgress[] }>(
    `/api/budgets/progress${qs ? '?' + qs : ''}`
  );
  return res;
};

export const useGetBudgetProgressAPI = (
  params?: GetBudgetProgressRequest,
  options?: QueryHookOptions<GetBudgetProgressResponse>
): QueryObserverResult<GetBudgetProgressResponse> => {
  return useQuery({
    queryKey: [QueryKeys.BUDGET_PROGRESS, params?.month, params?.year],
    queryFn: () => getBudgetProgressAPI(params),
    ...options,
  });
};
