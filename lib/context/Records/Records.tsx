import type { Pagination } from '@/api/records/getRecords';
import type { RecordsQueryParams, TRecord } from '@/types/Records';

export type { RecordsQueryParams } from '@/types/Records';

export type TRecordsContext = {
  records: TRecord[];
  pagination: Pagination;
  queryParams: RecordsQueryParams;
  updateRecord: {
    mutateAsync: (vars: any) => Promise<any>;
    isPending: boolean;
  };
  deleteRecord: {
    mutateAsync: (vars: any) => Promise<any>;
    isPending: boolean;
  };
  createRecord: {
    mutateAsync: (vars: any) => Promise<any>;
    isPending: boolean;
  };
  isGetRecordsSuccess: boolean;
  isGetRecordsLoading: boolean;
  isGetRecordsError: boolean;
  setQueryParams: (params: RecordsQueryParams) => void;
};
