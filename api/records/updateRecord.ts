import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { invalidateOnChange } from '@/constants/QueryInvalidation';
import { QueryKeys } from '@/constants/QueryKeys';
import { Record } from '@/types/Records';

type UpdateRecordAPIResponse = {
  record: Record;
};
type UpdateRecordResponse = AxiosResponse<UpdateRecordAPIResponse>;

type UpdateRecordRequest = {
  ID: string;
  record: Partial<Omit<Record, 'ID'>>;
};

export const updateRecordAPI = async ({
  ID,
  record,
}: UpdateRecordRequest): Promise<UpdateRecordResponse> => {
  const res = await PrivateAxios.patch<UpdateRecordAPIResponse>(
    `/api/records/${ID}`,
    record
  );

  return res;
};

export const useUpdateRecordAPI = () => {
  return useMutation({
    mutationFn: updateRecordAPI,
    onSettled: () => {
      invalidateOnChange(queryClient, QueryKeys.RECORDS);
    },
  });
};
