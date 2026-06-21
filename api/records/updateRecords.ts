import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Record } from '@/types/Records';

type UpdateRecordAPIResponse = {
  record: Record;
};
type UpdateRecordResponse = AxiosResponse<UpdateRecordAPIResponse>;

type UpdateRecordRequest = {
  id: number;
  record: Partial<Omit<Record, 'id'>>;
};

export const updateRecordAPI = async ({
  id,
  record,
}: UpdateRecordRequest): Promise<UpdateRecordResponse> => {
  const res = await PrivateAxios.patch<UpdateRecordAPIResponse>(
    `/api/records/${id}`,
    record
  );

  return res;
};

export const useUpdateRecordAPI = () => {
  return useMutation({
    mutationFn: updateRecordAPI,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BUDGET_PROGRESS] });
    },
  });
};
