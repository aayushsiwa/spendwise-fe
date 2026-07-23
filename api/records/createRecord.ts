import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Record } from '@/types/Records';

type CreateRecordAPIResponse = {
  message: string;
  ID: string;
};
export type CreateRecordResponse = AxiosResponse<CreateRecordAPIResponse>;

export type CreateRecordRequest = {
  record: Omit<Record, 'ID'>;
};

export const createRecordAPI = async ({
  record,
}: CreateRecordRequest): Promise<CreateRecordResponse> => {
  const res = await PrivateAxios.post<CreateRecordAPIResponse>(
    `/api/records`,
    record
  );

  return res;
};

export const useCreateRecordAPI = () => {
  return useMutation({
    mutationFn: createRecordAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGET_PROGRESS] });
    },
  });
};
