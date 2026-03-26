import { Delete, Receipt } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetter,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

import { currency } from '@/constants/Currency';
import { Record } from '@/types/Records';
import { DateUtil } from '@/utils/DateUtils';
import { RecordsUtil } from '@/utils/RecordsUtils';

export const getRecordsColumns = (
  getCategoryColor: (name: string) => string,
  getTypeDetails: (type: string) => {
    color: string;
    icon: typeof Receipt;
    bgColor: string;
  },
  handleDeleteRecord: (id: number) => void
): GridColDef<Record>[] => [
  {
    field: 'date',
    headerName: 'Date',
    flex: 0.6,
    editable: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const date = DateUtil.formattedDate(params.value);
      const today = DateUtil.formattedDate();
      const isToday = date === today;

      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isToday ? '#E17055' : 'text.primary',
            fontSize: '0.85rem',
          }}
        >
          {isToday ? 'Today' : dayjs(date).format('MM DD YYYY')}
        </Typography>
      );
    },
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1.2,
    editable: true,
    renderCell: (params) => (
      <Tooltip title={params.value} placement="top" arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <Receipt
            sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.7 }}
          /> */}
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
        </Box>
      </Tooltip>
    ),
  },
  {
    field: 'category',
    headerName: 'Category',
    flex: 0.7,
    editable: true,
    renderCell: (params) => {
      const color = getCategoryColor(params.value);
      return (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: alpha(color, 0.1),
            color,
            fontWeight: 600,
            border: `1px solid ${alpha(color, 0.3)}`,
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
    align: 'center',
    valueGetter: (value, row) => {
      return RecordsUtil.formatAmount(value, row.type);
    },
    // renderCell: (params) => {
    //   // const amount = RecordsUtil.formatAmount(params.value, params.row.type);
    //   return (
    //     <Typography
    //       fontWeight={700}
    //       color={params.row.type === 'expense' ? 'error.main' : 'text.primary'}
    //     >
    //       {params.value}
    //     </Typography>
    //   );
    // },
  },
  {
    field: 'type',
    headerName: 'Type',
    flex: 0.6,
    editable: true,
    renderCell: (params) => {
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
          }}
        >
          <Icon sx={{ fontSize: 16, color }} />
          <Typography fontWeight={600} fontSize="0.75rem" color={color}>
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
    renderCell: (params) => (
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
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={() => handleDeleteRecord(params.row.id)}
        sx={{ color: '#E17055' }}
      >
        <Delete fontSize="small" />
      </IconButton>
    ),
  },
];
