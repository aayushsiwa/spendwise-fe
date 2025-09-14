import {
  Receipt,
  SwapHoriz,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { blankRecord } from '@/constants/Records';
import { useRecordsContext } from '@/lib/context/Records/Records';
import type { Record } from '@/types/Records';

const useRecords = () => {
  const {
    records,
    pagination: paginationResponse,
    isGetRecordsError,
    isGetRecordsLoading: isLoading,
    error,
    deleteRecord,
    updateRecord,
    createRecord,
    queryParams,
    setQueryParams,
  } = useRecordsContext();

  const [localRows, setLocalRows] = useState<Record[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setLocalRows(records ?? []);
  }, [records]);

  const getTypeDetails = (type: string) => {
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
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setQueryParams({
      ...queryParams,
      page: model.page + 1,
      limit: model.pageSize,
    });
  };

  const handleDeleteRecord = async (id: string) => {
    if (id === 'new') {
      setLocalRows((prev) => prev.filter((r) => r.id !== 'new'));
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
      const isNew = newRow.id === 'new';

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

        setLocalRows((prev) => [
          created,
          ...prev.filter((r) => r.id !== 'new'),
        ]);
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
    paginationResponse,
    handlePaginationModelChange,
    getTypeDetails,
    processRowUpdate,
    handleDeleteRecord,
    isGetRecordsError,
    error,
    queryParams,
    isAdding,
    setIsAdding,
  };
};

export default useRecords;
