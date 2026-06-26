import {
  Receipt,
  SwapHoriz,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

import { useCreateRecordAPI } from '@/api/records/createRecord';
import { useDeleteRecordAPI } from '@/api/records/deleteRecords';
import { useGetRecordsAPI } from '@/api/records/getRecords';
import { useUpdateRecordAPI } from '@/api/records/updateRecords';
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

import { RecordProps } from './Records';

const useRecords = (): RecordProps => {
  const { range } = usePeriodContext();
  const { showSnackbar } = useAppSnackbar();

  const updateRecord = useUpdateRecordAPI();
  const deleteRecord = useDeleteRecordAPI();
  const createRecord = useCreateRecordAPI();

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
  }>({ page: 1, limit: 10 });

  const fullParams: RecordsQueryParams = { ...queryParams, ...range };

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
      const ID = response.data?.ID ?? '';
      const created: Record = { ...normalizedRecord, ID };
      setLocalRows((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to add record');
      showSnackbar(message, 'error');
      throw error;
    }
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
  };
};

export default useRecords;
