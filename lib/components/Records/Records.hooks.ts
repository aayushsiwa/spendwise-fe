import {
  Receipt,
  SwapHoriz,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

import { usePeriodContext } from '@/lib/context/Period/Period';
import { useCreateRecordAPI } from '@/pages/api/records/createRecord';
import { useDeleteRecordAPI } from '@/pages/api/records/deleteRecords';
import { useGetRecordsAPI } from '@/pages/api/records/getRecords';
import { useUpdateRecordAPI } from '@/pages/api/records/updateRecords';
import type { Record } from '@/types/Records';

import { RecordProps } from './Records';

const useRecords = (): RecordProps => {
  const { range } = usePeriodContext();

  const updateRecord = useUpdateRecordAPI();
  const deleteRecord = useDeleteRecordAPI();
  const createRecord = useCreateRecordAPI();

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
  }>({ page: 1, limit: 10 });

  const { data, isLoading, isError, error } = useGetRecordsAPI({
    ...queryParams,
    ...range,
  });

  const { records, ...pagination } = data?.data ?? {
    has_next: false,
    has_prev: false,
    limit: 0,
    page: 0,
    total_count: 0,
    total_pages: 0,
  };

  const [localRows, setLocalRows] = useState<Record[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAdding) {
      setLocalRows(records ?? []);
    }
  }, [records, isAdding]);

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

      // 🚫 prevent redundant updates
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

  const handleDeleteRecord = async (id: number) => {
    if (id === 9999) {
      setLocalRows((prev) => prev.filter((r) => r.id !== 9999));
      setIsAdding(false);
      return;
    }
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord.mutateAsync({ id });
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const processRowUpdate = async (
    newRow: Record,
    oldRow: Record
  ): Promise<Record> => {
    try {
      const isNew = newRow.id === 9999;

      if (isNew) {
        const { id, ...recordData } = newRow;
        const createdResponse = await createRecord.mutateAsync({
          record: recordData,
          queryParams,
        });

        const created: Record =
          createdResponse.data?.record ??
          createdResponse.data ??
          createdResponse;

        setLocalRows((prev) => [created, ...prev.filter((r) => r.id !== 9999)]);
        return created;
      } else {
        const { id, ...recordData } = newRow;
        await updateRecord.mutateAsync({ id, record: recordData, queryParams });
        setLocalRows((prev) =>
          prev.map((r) => (r.id === newRow.id ? newRow : r))
        );
        return newRow;
      }
    } catch (error) {
      console.error('Failed to update record:', error);
      return oldRow;
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
    isGetRecordsError: isError,
    error: error ?? undefined,
    isAdding,
    setIsAdding,
  };
};

export default useRecords;
