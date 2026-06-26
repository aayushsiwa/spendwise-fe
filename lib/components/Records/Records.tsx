'use client';

import { Receipt } from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useMemo } from 'react';

import { Pagination } from '@/api/records/getRecords';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import type { Record, TRecord } from '@/types/Records';
import { DateUtil } from '@/utils/DateUtils';

import { getRecordsColumns } from './RecordsColumns';
import RecordsTable from './RecordsTable';

export type RecordProps = {
  localRows: Record[];
  setLocalRows: React.Dispatch<React.SetStateAction<Record[]>>;
  records: TRecord[] | undefined;
  isLoading?: boolean;
  pagination: Pagination;
  handlePaginationModelChange: (model: {
    page: number;
    pageSize: number;
  }) => void;
  getTypeDetails: (type: string) => {
    color: string;
    icon: typeof Receipt;
    bgColor: string;
  };
  processRowUpdate: (newRow: Record, oldRow: Record) => Promise<Record>;
  handleDeleteRecord: (ID: string) => Promise<void>;
  isGetRecordsError?: boolean;
  error?: Error;
  isAdding: boolean;
  setIsAdding: (adding: boolean) => void;
  isAddingAllowed?: false;
  isCheckBoxSelectionAllowed?: boolean;
};

const Records: FC<RecordProps> = ({
  localRows,
  setLocalRows,
  records,
  isLoading,
  pagination,
  handlePaginationModelChange,
  getTypeDetails,
  processRowUpdate,
  handleDeleteRecord,
  isGetRecordsError,
  error,
  isAdding,
  setIsAdding,
  isAddingAllowed,
  isCheckBoxSelectionAllowed = true,
}: RecordProps) => {
  const { getCategoryColor } = useCategoriesContext();

  const columns = useMemo(
    () =>
      getRecordsColumns(getCategoryColor, getTypeDetails, handleDeleteRecord),
    [getCategoryColor, getTypeDetails, handleDeleteRecord]
  );

  const filteredColumns = useMemo(() => {
    if (!isAddingAllowed) {
      return columns.filter(
        (col) => !['actions', 'note', 'type'].includes(col.field)
      );
    }
    return columns;
  }, [columns, isAddingAllowed]);

  const paginationModel = useMemo(
    () => ({
      page: (pagination?.page ?? 1) - 1,
      pageSize: pagination?.limit ?? 10,
    }),
    [pagination]
  );

  if (isLoading || !pagination) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || isGetRecordsError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load records: {error?.message}</Alert>
      </Box>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6">No records found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      {isAddingAllowed && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Tooltip title="Add new record">
            <IconButton
              color="primary"
              onClick={() => {
                const newRecord: Record = {
                  id: 9999,
                  date: DateUtil.formattedDate(),
                  description: '',
                  category: 'misc',
                  amount: 0,
                  type: 'expense',
                  note: '',
                };
                setLocalRows((prev) => [newRecord, ...prev]);
                setIsAdding(true);
              }}
              disabled={isAdding}
            >
              <Receipt />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <RecordsTable
        rows={localRows}
        columns={filteredColumns}
        loading={isLoading}
        paginationModel={paginationModel}
        rowCount={pagination?.total_count}
        onPaginationModelChange={handlePaginationModelChange}
        processRowUpdate={processRowUpdate}
        getTypeDetails={getTypeDetails}
        isCheckBoxSelectionAllowed={isCheckBoxSelectionAllowed}
      />
    </Box>
  );
};

export default Records;
