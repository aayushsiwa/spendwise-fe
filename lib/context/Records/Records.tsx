import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useCreateRecordAPI } from '@/pages/api/records/createRecord';
import { useDeleteRecordAPI } from '@/pages/api/records/deleteRecords';
import { Pagination } from '@/pages/api/records/getRecords';
import { useUpdateRecordAPI } from '@/pages/api/records/updateRecords';
import { TRecord } from '@/types/Records';
import { DateUtil } from '@/utils/DateUtils';

import { usePeriodContext } from '../Period/Period';
import { useRecordsProvider } from './Records.hooks';

export type TRecordsContext = {
  records?: TRecord[];
  pagination: Pagination;
  isGetRecordsSuccess?: boolean;
  isGetRecordsLoading?: boolean;
  isGetRecordsError?: boolean;
  error?: Error;
  queryParams: RecordsQueryParams;
  setQueryParams: (params: Partial<RecordsQueryParams>) => void;
  updateRecord: ReturnType<typeof useUpdateRecordAPI>;
  deleteRecord: ReturnType<typeof useDeleteRecordAPI>;
  createRecord: ReturnType<typeof useCreateRecordAPI>;
};

export type RecordsQueryParams = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  category?: string;
  type?: string;
  search?: string;
  description?: string;
  min_amount?: number;
  max_amount?: number;
};

export const RecordsContext = createContext<TRecordsContext>(
  {} as unknown as TRecordsContext
);

export const RecordsContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { range } = usePeriodContext();
  console.log('range', range);

  const baseParams = useMemo(
    () => ({
      from: DateUtil.formattedDate(range.from),
      to: DateUtil.formattedDate(range.to),
    }),
    [range]
  );

  const [uiParams, setUIParams] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setUIParams({
      page: 1,
      limit: 10,
    });
  }, [range.from, range.to]);

  const queryParams = useMemo(
    () => ({
      ...baseParams,
      ...uiParams,
    }),
    [baseParams, uiParams]
  );

  const setQueryParams = useCallback((params: Partial<RecordsQueryParams>) => {
    setUIParams((prev) => ({
      ...prev,
      ...params,
    }));
  }, []);

  const provider = useRecordsProvider(queryParams);

  return (
    <RecordsContext.Provider
      value={{
        ...provider,
        queryParams,
        setQueryParams,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecordsContext = () => useContext(RecordsContext);
