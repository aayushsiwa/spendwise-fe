'use client';

import { Receipt } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { currency } from '@/constants/Currency';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import type { Record } from '@/types/Records';

import useRecords from './Records.hooks';

const Records = () => {
  const {
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
  } = useRecords();
  const { categories, getCategoryColor } = useCategoriesContext();
  const theme = useTheme();

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

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load records: {error.message}</Alert>
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

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.6,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isToday ? '#E17055' : 'text.primary',
                fontSize: '0.85rem',
              }}
            >
              {isToday
                ? 'Today'
                : date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  }) +
                  ' ' +
                  date.getFullYear()}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.2,
      editable: true,
      headerAlign: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value} placement="top" arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 0.5,
              textOverflow: 'ellipsis',
            }}
          >
            <Receipt
              sx={{
                fontSize: 18,
                color: 'text.secondary',
                opacity: 0.7,
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  lineHeight: 1.2,
                  mb: 0.25,
                  textOverflow: 'ellipsis',
                }}
              >
                {params.value}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.7,
      editable: true,
      type: 'singleSelect',
      valueOptions:
        categories?.map((cat) => ({ value: cat.name, label: cat.name })) || [],
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const color = getCategoryColor(params.value);
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              fontWeight: 600,
              fontSize: '0.75rem',
              border: `1px solid ${alpha(color, 0.3)}`,
              '&:hover': {
                backgroundColor: alpha(color, 0.15),
              },
            }}
          />
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      editable: true,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'text.primary',
          }}
        >
          {currency.Rupee} {params.value}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.6,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
        { value: 'transfer', label: 'Transfer' },
      ],
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const { color, icon: Icon, bgColor } = getTypeDetails(params.value);
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              gap: 1,
              backgroundColor: bgColor,
              borderRadius: '999px',
              border: `1px solid ${alpha(color, 0.2)}`,
              boxShadow: `inset 0 0 4px ${alpha(color, 0.1)}`,
            }}
          >
            <Icon sx={{ fontSize: 16, color }} />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color,
                textTransform: 'capitalize',
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1,
      editable: true,
      headerAlign: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || 'No note'} placement="top" arrow>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8rem',
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
            }}
          >
            {params.value || '—'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleDeleteRecord(params.row.id)}
          sx={{
            color: '#E17055',
            '&:hover': {
              backgroundColor: alpha('#E17055', 0.1),
            },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Tooltip title="Add new record">
          <IconButton
            color="primary"
            onClick={() => {
              const newRecord: Record = {
                id: 'new',
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

      <DataGrid
        rows={localRows}
        getRowId={(row) => row.id}
        getRowClassName={(params) => `row-type-${params.row.type}`}
        columns={columns}
        pagination
        editMode="row"
        onRowEditStop={(params, event) => {
          if (params.id === 'new') {
            setIsAdding(false);
          }
        }}
        paginationMode="server"
        paginationModel={{
          page: (queryParams.page || 1) - 1, // Convert 1-based to 0-based
          pageSize: queryParams.limit || 50,
        }}
        rowCount={paginationResponse?.total_count || 0}
        pageSizeOptions={[10, 25, 50, 100]}
        onPaginationModelChange={handlePaginationModelChange}
        className="data-grid"
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error('Row update error:', error);
        }}
        loading={isLoading}
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

export default Records;
