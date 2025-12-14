'use client';

import { Receipt } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { FC, ReactComponentElement, ReactElement } from 'react';

import { currency } from '@/constants/Currency';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { RecordsQueryParams } from '@/lib/context/Records/Records';
import { Pagination } from '@/pages/api/records/getRecords';
import type { Record } from '@/types/Records';

import { getRecordsColumns } from './RecordsColumns';
import RecordsTable from './RecordsTable';

export type RecordProps = {
  localRows: Record[];
  setLocalRows: React.Dispatch<React.SetStateAction<Record[]>>;
  records: Record[] | undefined;
  isLoading?: boolean;
  paginationResponse?: Pagination;
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
  handleDeleteRecord: (id: number) => void;
  isGetRecordsError?: boolean;
  error?: Error;
  recordsQueryParams?: RecordsQueryParams;
  setRecordsQueryParams: (params: RecordsQueryParams) => void;
  isAdding: boolean;
  setIsAdding: (adding: boolean) => void;
  isAddingAllowed?: false;
};

const Wrapper = (children: ReactElement, theme: Theme) => {
  <Box
    sx={{
      height: '100%',
      width: '100%',
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
    }}
  >
    {children}
  </Box>;
};

const Records: FC<RecordProps> = ({
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
  recordsQueryParams,
  isAdding,
  setIsAdding,
  isAddingAllowed,
}: RecordProps) => {
  const { categories, getCategoryColor } = useCategoriesContext();
  const theme = useTheme();

  // console.log(recordsQueryParams);

  if (isLoading) {
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

  const columns = getRecordsColumns(
    getCategoryColor,
    getTypeDetails,
    handleDeleteRecord
  );

  let filteredColumns = columns;

  if (!isAddingAllowed) {
    filteredColumns = columns.filter(
      (col) => !['actions', 'note', 'type'].includes(col.field)
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
                  date: new Date().toISOString().split('T')[0],
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
        paginationModel={{
          page: (recordsQueryParams?.page || 1) - 1,
          pageSize: recordsQueryParams?.limit || 50,
        }}
        rowCount={paginationResponse?.total_count || 0}
        onPaginationModelChange={handlePaginationModelChange}
        processRowUpdate={processRowUpdate}
        getTypeDetails={getTypeDetails}
      />
    </Box>
  );
};

export default Records;
