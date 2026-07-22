import type { Pagination } from '@/api/records/getRecords';
import type { RecordsQueryParams, TRecord } from '@/types/Records';

export type { RecordsQueryParams } from '@/types/Records';

export type TRecordsContext = {
  records: TRecord[];
  pagination: Pagination;
  queryParams: RecordsQueryParams;
  isGetRecordsSuccess: boolean;
  isGetRecordsLoading: boolean;
  isGetRecordsError: boolean;
  setQueryParams: (params: RecordsQueryParams) => void;
};
