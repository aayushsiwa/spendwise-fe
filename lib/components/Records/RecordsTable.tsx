import { Receipt } from '@mui/icons-material';
import { Box, alpha, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { Record } from '@/types/Records';

type RecordsTableProps = {
  rows: Record[];
  columns: any[];
  loading?: boolean;
  paginationModel: { page: number; pageSize: number };
  rowCount: number;
  onPaginationModelChange: (model: any) => void;
  processRowUpdate: (newRow: Record, oldRow: Record) => Promise<Record>;
  getTypeDetails: (type: string) => {
    color: string;
    icon: typeof Receipt;
    bgColor: string;
  };
  isCheckBoxSelectionAllowed?: boolean;
};

const RecordsTable = ({
  rows,
  columns,
  loading,
  paginationModel,
  rowCount,
  onPaginationModelChange,
  processRowUpdate,
  getTypeDetails,
  isCheckBoxSelectionAllowed,
}: RecordsTableProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: '16px',
      }}
    >
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        paginationMode="server"
        paginationModel={paginationModel}
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50, 100]}
        onPaginationModelChange={onPaginationModelChange}
        loading={loading}
        processRowUpdate={processRowUpdate}
        checkboxSelection={isCheckBoxSelectionAllowed}
        disableRowSelectionOnClick
        sx={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          '& .MuiDataGrid-row[data-id="new"]': {
            backgroundColor: alpha(theme.palette.success.light, 0.08),
            '&:hover': {
              backgroundColor: alpha(theme.palette.success.light, 0.12),
            },
          },
          '& .MuiDataGrid-row.row-type-income': {
            borderLeft: `4px solid ${getTypeDetails('income').color}`,
          },
          '& .MuiDataGrid-row.row-type-expense': {
            borderLeft: `4px solid ${getTypeDetails('expense').color}`,
          },
          '& .MuiDataGrid-row.row-type-transfer': {
            borderLeft: `4px solid ${getTypeDetails('transfer').color}`,
          },

          '& .MuiDataGrid-root': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-columnHeaders': {
            background: `linear-gradient(90deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
            borderBottom: `2px solid ${alpha(
              theme.palette.primary.main,
              0.15
            )}`,
            borderRadius: '12px 12px 0 0',
            '& .MuiDataGrid-columnHeader': {
              fontWeight: 700,
              fontSize: '0.85rem',
              color: theme.palette.primary.main,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            },
            '& .MuiDataGrid-columnSeparator': {
              color: alpha(theme.palette.primary.main, 0.2),
            },
          },
          '& .MuiDataGrid-row': {
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            margin: '4px 8px',
            boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.04)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.light, 0.08),
              transform: 'scale(1.01)',
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              },
            },
            // '&:nth-of-type(even)': {
            //   backgroundColor: alpha(theme.palette.background.paper, 0.4),
            // },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            fontSize: '0.875rem',
            padding: theme.spacing(1.5),
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-footerContainer': {
            background: `linear-gradient(90deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: '0 0 12px 12px',
            '& .MuiTablePagination-root': {
              color: theme.palette.primary.main,
              fontWeight: 500,
            },
          },
          '& .MuiCheckbox-root': {
            color: alpha(theme.palette.primary.main, 0.6),
            '&.Mui-checked': {
              color: theme.palette.primary.main,
            },
          },
          '& .MuiDataGrid-selectedRow': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
          scrollbarColor: `${alpha(
            theme.palette.primary.main,
            0.3
          )} transparent`,
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth',
          '& .MuiDataGrid-row.MuiDataGrid-row--editing': {
            backgroundColor: alpha(theme.palette.info.light, 0.12),
            borderLeft: `4px solid ${theme.palette.info.main}`,
          },
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.grey[300], 0.3),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.6),
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default RecordsTable;
