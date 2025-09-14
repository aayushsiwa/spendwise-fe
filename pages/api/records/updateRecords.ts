import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { RecordsQueryParams } from '@/lib/context/Records/Records';
import { PrivateAxios, queryClient } from '@/pages/api/index';
import { Record, RecordQuery } from '@/types/Records';

type UpdateRecordAPIResponse = {
  record: Record;
};
type UpdateRecordResponse = AxiosResponse<UpdateRecordAPIResponse>;

type UpdateRecordRequest = {
  id: string;
  record: Omit<Record, 'id'>;
  queryParams: RecordsQueryParams;
};

export const updateRecordAPI = async ({
  id,
  record,
  queryParams,
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
    onMutate: async ({ id, record, queryParams }) => {
      // Cancel any outgoing queries so they don’t overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.RECORDS, queryParams],
      });

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData<RecordQuery>([
        QueryKeys.RECORDS,
        queryParams,
      ]);

      const updatedRecord = previousRecords?.data.records.find(
        (r) => r.id === id
      );
      const isEqual =
        updatedRecord &&
        Object.keys(record).every(
          (key) => (updatedRecord as any)[key] === (record as any)[key]
        ) &&
        updatedRecord.id === id;

      // Optimistically update
      queryClient.setQueryData<RecordQuery>(
        [QueryKeys.RECORDS, queryParams],
        (old: RecordQuery | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              records: old.data.records.map((r: Record) =>
                r.id === id ? { ...r, ...record } : r
              ),
            },
          };
        }
      );

      return { previousRecords };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousRecords) {
        queryClient.setQueryData(
          [QueryKeys.RECORDS, variables.queryParams],
          context.previousRecords
        );
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
