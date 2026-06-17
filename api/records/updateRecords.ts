import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { RecordsQueryParams } from '@/lib/context/Records/Records';
import { Record, RecordQuery } from '@/types/Records';

type UpdateRecordAPIResponse = {
  record: Record;
};
type UpdateRecordResponse = AxiosResponse<UpdateRecordAPIResponse>;

type UpdateRecordRequest = {
  id: number;
  record: Omit<Record, 'id'>;
  queryParams: RecordsQueryParams;
};

export const updateRecordAPI = async ({
  id,
  record,
}: Omit<UpdateRecordRequest, 'queryParams'>): Promise<UpdateRecordResponse> => {
  const res = await PrivateAxios.patch<UpdateRecordAPIResponse>(
    `/api/records/${id}`,
    record
  );

  return res;
};

export const useUpdateRecordAPI = () => {
  return useMutation({
    mutationFn: async ({ id, record, queryParams }: UpdateRecordRequest) => {
      const cached = queryClient
        .getQueryData<RecordQuery>([QueryKeys.RECORDS, queryParams])
        ?.data.records.find((r) => r.id === id);

      const noChanges =
        cached &&
        Object.keys(record).every(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (key) => (cached as any)[key] === (record as any)[key]
        );

      if (noChanges) {
        // Return a fake response so downstream code still works
        return {
          data: { record: cached },
          __skip: true, // custom flag
        };
      }

      return updateRecordAPI({ id, record });
    },
    onMutate: async ({ id, record, queryParams }) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.RECORDS, queryParams],
      });

      const previousRecords = queryClient.getQueryData<RecordQuery>([
        QueryKeys.RECORDS,
        queryParams,
      ]);

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
      if (context?.previousRecords) {
        queryClient.setQueryData(
          [QueryKeys.RECORDS, variables.queryParams],
          context.previousRecords
        );
      }
    },
    onSettled: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((data as any)?.__skip) return;
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
    },
  });
};
