import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { PrivateAxios, queryClient } from "@/pages/api/index";
import { QueryKeys } from "@/constants/QueryKeys";
import { Record, RecordQuery } from "@/types/Records";

type UpdateRecordAPIResponse = {
  record: Record;
};
type UpdateRecordResponse = AxiosResponse<UpdateRecordAPIResponse>;

type UpdateRecordRequest = {
  id: string;
  record: Omit<Record, "id">;
};

export const updateRecordAPI = async ({
  id,
  record,
}: UpdateRecordRequest): Promise<UpdateRecordResponse> => {
  console.log("called");
  const res = await PrivateAxios.patch<UpdateRecordAPIResponse>(
    `/api/records/${id}`,
    record
  );

  return res;
};

export const useUpdateRecordAPI = () => {
  return useMutation({
    mutationFn: updateRecordAPI,
    onMutate: async ({ id, record }) => {
      // Cancel any outgoing queries so they don’t overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [QueryKeys.RECORDS] });

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData<RecordQuery>([
        QueryKeys.RECORDS,
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
              records: old.data.records.map((r: Record) =>
                r.id === id ? { ...r, ...record } : r
              ),
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
