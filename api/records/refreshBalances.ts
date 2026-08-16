import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { invalidateOnChange } from '@/constants/QueryInvalidation';
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
      invalidateOnChange(queryClient, QueryKeys.RECORDS);
    },
  });
};
