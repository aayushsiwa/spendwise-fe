import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Budget } from '@/types/Budget';
import { QueryHookOptions } from '@/types/api';

type GetBudgetsResponse = AxiosResponse<{ budgets: Budget[] }>;

type GetBudgetsRequest = {
  month?: number;
  year?: number;
};

export const getBudgetsAPI = async (
  params?: GetBudgetsRequest
): Promise<GetBudgetsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.year) queryParams.append('year', params.year.toString());
  const qs = queryParams.toString();
  const res = await PrivateAxios.get<{ budgets: Budget[] }>(
    `/api/budgets${qs ? '?' + qs : ''}`
  );
  return res;
};

export const useGetBudgetsAPI = (
  params?: GetBudgetsRequest,
  options?: QueryHookOptions<GetBudgetsResponse>
): QueryObserverResult<GetBudgetsResponse> => {
  return useQuery({
    queryKey: [QueryKeys.BUDGETS, params?.month, params?.year],
    queryFn: () => getBudgetsAPI(params),
    ...options,
  });
};
