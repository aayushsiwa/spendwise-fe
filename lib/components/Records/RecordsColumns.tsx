import { Receipt, Visibility } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { Record } from '@/types/Records';
import { DateUtil } from '@/utils/DateUtils';
import { RecordsUtil } from '@/utils/RecordsUtils';

function CategoryEditCell(props: GridRenderEditCellParams) {
  const { id, value, field, api } = props;
  const { categories } = useCategoriesContext();

  const handleChange = (event: { target: { value: unknown } }) => {
    api.setEditCellValue({ id, field, value: event.target.value });
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      autoFocus
      fullWidth
      sx={{ height: '100%' }}
    >
      {categories?.map((cat) => (
          <MenuItem key={cat.ID} value={cat.name}>
          {cat.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export const getRecordsColumns = (
  getCategoryColor: (name: string) => string,
  getTypeDetails: (type: string) => {
    color: string;
    icon: typeof Receipt;
    bgColor: string;
  },
  handleViewRecord: (record: Record) => void
): GridColDef<Record>[] => [
  {
    field: 'view',
    headerName: '',
    width: 48,
    sortable: false,
    align: 'center',
    renderCell: (params) => (
      <IconButton size="small" onClick={() => handleViewRecord(params.row)}>
        <Visibility fontSize="small" />
      </IconButton>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 0.6,
    editable: true,

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
          {isToday ? 'Today' : dayjs(date).format(`DD MMM 'YY`)}
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
    renderEditCell: (params) => <CategoryEditCell {...params} />,
    renderCell: (params) => {
      if (!params.value) {
        return null;
      }
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
    renderCell: (params) => {
      return (
        <Typography
          fontWeight={700}
          color={params.row.type === 'expense' ? 'error.main' : 'text.primary'}
        >
          {RecordsUtil.formatAmount(params.value, params.row.type)}
        </Typography>
      );
    },
  },
];
