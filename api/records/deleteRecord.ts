import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Record } from '@/types/Records';

type DeleteRecordAPIResponse = {
  record: Record;
};
type DeleteRecordResponse = AxiosResponse<DeleteRecordAPIResponse>;

type DeleteRecordRequest = {
  ID: string;
};

export const deleteRecordAPI = async ({
  ID,
}: DeleteRecordRequest): Promise<DeleteRecordResponse> => {
  const res = await PrivateAxios.delete<DeleteRecordAPIResponse>(
    `/api/records/${ID}`
  );
  return res;
};

export const useDeleteRecordAPI = () => {
  return useMutation({
    mutationFn: deleteRecordAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGET_PROGRESS] });
    },
  });
};
