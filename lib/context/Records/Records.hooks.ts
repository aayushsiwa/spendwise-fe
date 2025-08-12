import { useGetRecordsAPI } from "@/pages/api/records/getRecords";
import { RecordsQueryParams, TRecordsContext } from "./Records";
import { useUpdateRecordAPI } from "@/pages/api/records/updateRecords";
import { useDeleteRecordAPI } from "@/pages/api/records/deleteRecords";

export const useRecordsProvider = (
  params: RecordsQueryParams
): Omit<TRecordsContext, "setQueryParams"> => {
  const {
    data: getRecordsResponse,
    isLoading: isGetRecordsLoading,
    isError: isGetRecordsError,
    isSuccess: isGetRecordsSuccess,
  } = useGetRecordsAPI(params);

  const updateRecord = useUpdateRecordAPI();
  const deleteRecord = useDeleteRecordAPI();

  return {
    records: getRecordsResponse?.data.records,
    pagination: getRecordsResponse?.data.pagination,
    queryParams: params,
    updateRecord,
    deleteRecord,
    isGetRecordsSuccess,
    isGetRecordsLoading,
    isGetRecordsError,
  };
};
