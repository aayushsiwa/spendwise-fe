import { Record } from "@/types/Records";
import { createContext, FC, useContext, useState } from "react";
import { useRecordsProvider } from "./Records.hooks";
import { Pagination } from "@/pages/api/records/getRecords";
import { useUpdateRecordAPI } from "@/pages/api/records/updateRecords";
import { useDeleteRecordAPI } from "@/pages/api/records/deleteRecords";

export type TRecordsContext = {
  records?: Record[];
  pagination?: Pagination;
  isGetRecordsSuccess?: boolean;
  isGetRecordsLoading?: boolean;
  isGetRecordsError?: boolean;
  error?: Error;
  queryParams?: RecordsQueryParams;
  setQueryParams?: (params: RecordsQueryParams) => void;
  updateRecord?: ReturnType<typeof useUpdateRecordAPI>;
  deleteRecord?: ReturnType<typeof useDeleteRecordAPI>;
};

export type RecordsQueryParams = {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  category?: string;
  type?: string;
  description?: string;
  min_amount?: number;
  max_amount?: number;
};

export const RecordsContext = createContext<TRecordsContext>(
  {} as unknown as TRecordsContext
);

export const RecordsContextProvider: FC<
  React.PropsWithChildren<TRecordsContext>
> = ({ children }) => {
  const [queryParams, setQueryParams] = useState<RecordsQueryParams>({
    page: 1,
    limit: 10,
  });

  const {
    records,
    pagination,
    updateRecord,
    deleteRecord,
    isGetRecordsSuccess,
    isGetRecordsLoading,
    isGetRecordsError,
    error,
  } = useRecordsProvider(queryParams);

  return (
    <RecordsContext.Provider
      value={{
        records,
        pagination,
        isGetRecordsSuccess,
        isGetRecordsLoading,
        isGetRecordsError,
        error,
        queryParams,
        setQueryParams,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecordsContext = (): TRecordsContext =>
  useContext(RecordsContext);
