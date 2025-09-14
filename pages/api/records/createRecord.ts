import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { RecordsQueryParams } from '@/lib/context/Records/Records';
import { PrivateAxios, queryClient } from '@/pages/api/index';
import { Record, RecordQuery } from '@/types/Records';

type CreateRecordAPIResponse = {
  record: Record;
};
type CreateRecordResponse = AxiosResponse<CreateRecordAPIResponse>;

type CreateRecordRequest = {
  record: Omit<Record, 'id'>;
  queryParams: RecordsQueryParams;
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
    onMutate: async ({ record, queryParams }) => {
      // Cancel any outgoing queries so they don’t overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.RECORDS, queryParams],
      });

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData<RecordQuery>([
        QueryKeys.RECORDS,
        queryParams,
      ]);

      // Optimistically update
      queryClient.setQueryData<RecordQuery>(
        [QueryKeys.RECORDS],
        (old: RecordQuery | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              records: [
                ...old.data.records,
                { ...record, id: `temp-${Date.now()}` },
              ],
            },
          };
        }
      );

      return { previousRecords };
    },
    onError: (err, _variables, context) => {
      // Rollback on error
      if (context?.previousRecords) {
        queryClient.setQueryData([QueryKeys.RECORDS], context.previousRecords);
      }
    },
    onSettled: () => {
      // Re-fetch for data consistency
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
    },
  });
};
