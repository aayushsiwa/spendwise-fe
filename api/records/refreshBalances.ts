import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';

type RefreshBalancesResponse = AxiosResponse<{ status: string }>;

export const refreshBalancesAPI =
  async (): Promise<RefreshBalancesResponse> => {
    const res = await PrivateAxios.post<{ status: string }>(`/api/refresh`);
    return res;
  };

export const useRefreshBalancesAPI = () => {
  return useMutation({
    mutationFn: refreshBalancesAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGET_PROGRESS] });
    },
  });
};
