'use client';

import { Receipt } from '@mui/icons-material';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';

import { Pagination } from '@/api/records/getRecords';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { useAppSnackbar } from '@/lib/context/Snackbar/Snackbar';
import type { Record, TRecord } from '@/types/Records';
import { getApiErrorMessage } from '@/utils/apiError';

import RecordDetailDialog from './RecordDetailDialog';
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
  handleCreateRecord: (record: Omit<Record, 'ID'>) => Promise<Record>;
  isGetRecordsError?: boolean;
  error?: Error;
  isCheckBoxSelectionAllowed?: boolean;
};

const Records: FC<RecordProps> = ({
  localRows,
  records,
  isLoading,
  pagination,
  handlePaginationModelChange,
  getTypeDetails,
  processRowUpdate,
  handleDeleteRecord,
  handleCreateRecord,
  isGetRecordsError,
  error,
  isCheckBoxSelectionAllowed = true,
}: RecordProps) => {
  const { getCategoryColor } = useCategoriesContext();
  const { showSnackbar } = useAppSnackbar();
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);

  const recordsErrorMessage =
    error || isGetRecordsError
      ? getApiErrorMessage(error, 'Failed to load records')
      : '';

  useEffect(() => {
    if (recordsErrorMessage) {
      showSnackbar(recordsErrorMessage, 'error');
    }
  }, [recordsErrorMessage, showSnackbar]);

  const handleViewRecord = (record: Record) => {
    setSelectedRecord(record);
    setDialogMode('edit');
  };

  const columns = useMemo(
    () => getRecordsColumns(getCategoryColor, getTypeDetails, handleViewRecord),
    [getCategoryColor, getTypeDetails]
  );

  const hasCategory = localRows.some((row) => row.category);
  const filteredColumns = useMemo(
    () =>
      hasCategory ? columns : columns.filter((col) => col.field !== 'category'),
    [columns, hasCategory]
  );

  const paginationModel = useMemo(
    () => ({
      page: (pagination?.page ?? 1) - 1,
      pageSize: pagination?.limit ?? 10,
    }),
    [pagination]
  );

  const handleFabClick = () => {
    setDialogMode('create');
  };

  const handleDialogSave = async (updatedRecord: Record) => {
    if (selectedRecord) {
      await processRowUpdate(updatedRecord, selectedRecord);
    }
  };

  const handleDialogClose = () => {
    setDialogMode(null);
    setSelectedRecord(null);
  };

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
        <Alert severity="error">{recordsErrorMessage}</Alert>
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
          p: 2,
        }}
      >
        <Typography variant="h6">No records found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <RecordsTable
        rows={localRows}
        columns={filteredColumns}
        loading={isLoading}
        paginationModel={paginationModel}
        rowCount={pagination?.totalCount}
        onPaginationModelChange={handlePaginationModelChange}
        processRowUpdate={processRowUpdate}
        getTypeDetails={getTypeDetails}
        isCheckBoxSelectionAllowed={isCheckBoxSelectionAllowed}
      />

      <RecordDetailDialog
        record={selectedRecord}
        open={selectedRecord !== null}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        onDelete={handleDeleteRecord}
      />

      <Fab
        color="primary"
        onClick={handleFabClick}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Records;
