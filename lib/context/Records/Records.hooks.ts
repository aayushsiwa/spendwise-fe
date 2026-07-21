import { useGetRecordsAPI } from '@/api/records/getRecords';

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
    isGetRecordsSuccess,
    isGetRecordsLoading,
    isGetRecordsError,
  };
};
