import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { PrivateAxios, queryClient } from "@/pages/api/index";
import { QueryKeys } from "@/constants/QueryKeys";
import { Record, RecordQuery } from "@/types/Records";

type DeleteRecordAPIResponse = {
  record: Record;
};
type DeleteRecordResponse = AxiosResponse<DeleteRecordAPIResponse>;

type DeleteRecordRequest = {
  id: string;
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
    onMutate: async ({ id }: { id: string }) => {
      // Cancel any outgoing fetches so they don’t overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: [QueryKeys.RECORDS] });

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData<RecordQuery>([
        QueryKeys.RECORDS,
      ]);

      // Optimistically remove record
      queryClient.setQueryData<RecordQuery>(
        [QueryKeys.RECORDS],
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

      return { previousRecords };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousRecords) {
        queryClient.setQueryData([QueryKeys.RECORDS], context.previousRecords);
      }
    },
    onSettled: () => {
      // Always refetch for consistency
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY_FILTER] });
    },
  });
};
