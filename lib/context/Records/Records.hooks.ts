import { useCreateRecordAPI } from '@/api/records/createRecord';
import { useDeleteRecordAPI } from '@/api/records/deleteRecords';
import { useGetRecordsAPI } from '@/api/records/getRecords';
import { useUpdateRecordAPI } from '@/api/records/updateRecords';

import { RecordsQueryParams, TRecordsContext } from './Records';

export const useRecordsProvider = (
  params: RecordsQueryParams
): Omit<TRecordsContext, 'setQueryParams'> => {
  const {
    data: getRecordsResponse,
    isLoading: isGetRecordsLoading,
    isError: isGetRecordsError,
    isSuccess: isGetRecordsSuccess,
  } = useGetRecordsAPI(params);

  const updateRecord = useUpdateRecordAPI();
  const deleteRecord = useDeleteRecordAPI();
  const createRecord = useCreateRecordAPI();

  const { records = [], ...pagination } = getRecordsResponse?.data ?? {
    hasNext: false,
    hasPrev: false,
    limit: 0,
    page: 0,
    totalCount: 0,
    totalPages: 0,
  };

  return {
    records,
    pagination,
    queryParams: params,
    updateRecord,
    deleteRecord,
    createRecord,
    isGetRecordsSuccess,
    isGetRecordsLoading,
    isGetRecordsError,
  };
};
