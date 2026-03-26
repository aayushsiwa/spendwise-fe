import { useCreateRecordAPI } from '@/pages/api/records/createRecord';
import { useDeleteRecordAPI } from '@/pages/api/records/deleteRecords';
import { useGetRecordsAPI } from '@/pages/api/records/getRecords';
import { useUpdateRecordAPI } from '@/pages/api/records/updateRecords';

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

  const records = getRecordsResponse?.data?.records;

  const { records: _ignored, ...pagination } = getRecordsResponse?.data ?? {
    has_next: false,
    has_prev: false,
    limit: 0,
    page: 0,
    total_count: 0,
    total_pages: 0,
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
