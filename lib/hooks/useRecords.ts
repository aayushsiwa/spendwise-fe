import {
  Receipt,
  SwapHoriz,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCreateRecordAPI } from '@/api/records/createRecord';
import type {
  CreateRecordRequest,
  CreateRecordResponse,
} from '@/api/records/createRecord';
import { useDeleteRecordAPI } from '@/api/records/deleteRecord';
import { useGetRecordsAPI } from '@/api/records/getRecords';
import { useUpdateRecordAPI } from '@/api/records/updateRecord';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useAppSnackbar } from '@/lib/context/Snackbar/Snackbar';
import type { Record, RecordsQueryParams } from '@/types/Records';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  getRecordValidationMessage,
  hasRecordValidationErrors,
  normalizeRecord,
  validateRecord,
} from '@/validations/Record';

async function createRecordWithValidation(
  recordData: Omit<Record, 'ID'>,
  createRecord: {
    mutateAsync: (args: CreateRecordRequest) => Promise<CreateRecordResponse>;
  },
  showSnackbar: (message: string, severity: 'error' | 'success') => void
): Promise<Record> {
  const normalizedRecord = normalizeRecord(recordData);
  const validationErrors = validateRecord(normalizedRecord);
  if (hasRecordValidationErrors(validationErrors)) {
    const message = getRecordValidationMessage(validationErrors);
    showSnackbar(message, 'error');
    throw new Error(message);
  }
  try {
    const response = await createRecord.mutateAsync({
      record: normalizedRecord,
    });
    const ID = response.data?.ID;
    if (!ID) {
      throw new Error('No ID returned from server');
    }
    return { ...normalizedRecord, ID };
  } catch (error) {
    const message = getApiErrorMessage(error, 'Failed to create record');
    showSnackbar(message, 'error');
    throw error;
  }
}

export function useCreateRecord() {
  const { showSnackbar } = useAppSnackbar();
  const createRecord = useCreateRecordAPI();

  return {
    create: (recordData: Omit<Record, 'ID'>) =>
      createRecordWithValidation(recordData, createRecord, showSnackbar),
  };
}

export type RecordsFilter = {
  search: string;
  type: string;
  category: string;
  from: string;
  to: string;
};

export type UseRecordsConfig = {
  defaultPageSize?: number;
  initialFilters?: Partial<RecordsFilter>;
  usePeriodContext?: boolean;
};

export const defaultFilters: RecordsFilter = {
  search: '',
  type: '',
  category: '',
  from: '',
  to: '',
};

export function useRecords({
  defaultPageSize = 10,
  initialFilters = {},
  usePeriodContext: enablePeriodCtx = false,
}: UseRecordsConfig = {}) {
  const periodContext = usePeriodContext();
  const period = enablePeriodCtx ? periodContext : undefined;
  const { showSnackbar } = useAppSnackbar();
  const updateRecord = useUpdateRecordAPI();
  const deleteRecord = useDeleteRecordAPI();
  const createRecord = useCreateRecordAPI();

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: defaultPageSize,
  });

  const [filters, setFilters] = useState<RecordsFilter>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const prevFilters = useRef({ ...filters, debouncedSearch });
  useEffect(() => {
    const prev = prevFilters.current;
    if (
      prev.debouncedSearch !== debouncedSearch ||
      prev.type !== filters.type ||
      prev.category !== filters.category ||
      prev.from !== filters.from ||
      prev.to !== filters.to
    ) {
      setQueryParams((q) => ({ ...q, page: 1 }));
    }
    prevFilters.current = { ...filters, debouncedSearch };
  }, [filters, debouncedSearch]);

  const fullParams: RecordsQueryParams = {
    ...queryParams,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.type && { type: filters.type }),
    ...(filters.category && { category: filters.category }),
    ...(filters.from && { from: filters.from }),
    ...(filters.to && { to: filters.to }),
    ...(period?.range || {}),
  };

  const { data, isLoading, isError, error } = useGetRecordsAPI(fullParams);
  const { records, ...pagination } = data?.data ?? {
    hasNext: false,
    hasPrev: false,
    limit: 0,
    page: 0,
    totalCount: 0,
    totalPages: 0,
  };

  const [localRows, setLocalRows] = useState<Record[]>([]);
  useEffect(() => {
    setLocalRows(records ?? []);
  }, [records]);

  const getTypeDetails = useCallback((type: string) => {
    switch (type) {
      case 'income':
        return { color: '#00B894', icon: TrendingUp, bgColor: '#00B89410' };
      case 'expense':
        return { color: '#E17055', icon: TrendingDown, bgColor: '#E1705510' };
      case 'transfer':
        return { color: '#0984E3', icon: SwapHoriz, bgColor: '#0984E310' };
      default:
        return { color: '#636E72', icon: Receipt, bgColor: '#636E7210' };
    }
  }, []);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      const newPage = model.page + 1;
      const newLimit = model.pageSize;
      if (newPage === queryParams.page && newLimit === queryParams.limit) {
        return;
      }
      setQueryParams({
        page: newPage,
        limit: newLimit,
      });
    },
    [setQueryParams, queryParams.page, queryParams.limit]
  );

  const handleDeleteRecord = async (ID: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord.mutateAsync({ ID });
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to delete record');
        showSnackbar(message, 'error');
        throw error;
      }
    }
  };

  const handleCreateRecord = async (
    recordData: Omit<Record, 'ID'>
  ): Promise<Record> => {
    const created = await createRecordWithValidation(
      recordData,
      createRecord,
      showSnackbar
    );
    setLocalRows((prev) => [created, ...prev]);
    return created;
  };

  const processRowUpdate = async (
    newRow: Record,
    oldRow: Record
  ): Promise<Record> => {
    try {
      const { ID, ...recordData } = newRow;
      const normalizedRecord = normalizeRecord(recordData);
      const validationErrors = validateRecord(normalizedRecord);
      if (hasRecordValidationErrors(validationErrors)) {
        const message = getRecordValidationMessage(validationErrors);
        throw new Error(message);
      }
      const changes: Partial<Omit<Record, 'ID'>> = {};
      for (const key of Object.keys(
        normalizedRecord
      ) as (keyof typeof normalizedRecord)[]) {
        if (normalizedRecord[key] !== oldRow[key]) {
          changes[key] = normalizedRecord[key] as never;
        }
      }
      if (Object.keys(changes).length === 0) {
        return { ...newRow, ...normalizedRecord };
      }
      await updateRecord.mutateAsync({ ID, record: changes });
      setLocalRows((prev) =>
        prev.map((r) =>
          r.ID === newRow.ID ? { ...newRow, ...normalizedRecord } : r
        )
      );
      return { ...newRow, ...normalizedRecord };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update record');
      showSnackbar(message, 'error');
      throw error instanceof Error ? error : new Error(message);
    }
  };

  return {
    localRows,
    setLocalRows,
    records,
    isLoading,
    pagination,
    handlePaginationModelChange,
    getTypeDetails,
    processRowUpdate,
    handleDeleteRecord,
    handleCreateRecord,
    isGetRecordsError: isError,
    error: error ?? undefined,
    filters,
    setFilters,
  };
}
