import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { Record, RecordQuery, RecordsQueryParams } from '@/types/Records';

type DeleteRecordAPIResponse = {
  record: Record;
};
type DeleteRecordResponse = AxiosResponse<DeleteRecordAPIResponse>;

type DeleteRecordRequest = {
  id: number;
  queryParams: RecordsQueryParams;
};

export const deleteRecordAPI = async ({
  id,
}: DeleteRecordRequest): Promise<DeleteRecordResponse> => {
  const res = await PrivateAxios.delete<DeleteRecordAPIResponse>(
    `/api/records/${id}`
  );
  return res;
};

export const useDeleteRecordAPI = () => {
  return useMutation({
    mutationFn: deleteRecordAPI,
    onMutate: async ({ id, queryParams }: DeleteRecordRequest) => {
      const queryKey = [
        QueryKeys.RECORDS,
        queryParams.page,
        queryParams.limit,
        queryParams.from,
        queryParams.to,
        queryParams.category,
        queryParams.type,
        queryParams.description,
        queryParams.min_amount,
        queryParams.max_amount,
      ];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<RecordQuery>(
        queryKey,
        (old: RecordQuery | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              records: old.data.records.filter((r: Record) => r.id !== id),
            },
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
    },
  });
};
