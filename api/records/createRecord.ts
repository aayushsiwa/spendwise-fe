import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PrivateAxios, queryClient } from '@/api/index';
import { QueryKeys } from '@/constants/QueryKeys';
import { RecordsQueryParams } from '@/lib/context/Records/Records';
import { Record, RecordQuery } from '@/types/Records';

type CreateRecordAPIResponse = {
  message: string;
  id: number;
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
              records: [...old.data.records, { ...record, id: 9999 }],
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
