import { Receipt, Visibility } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { Record, RecordTypes } from '@/types/Records';
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

function AmountEditCell(props: GridRenderEditCellParams) {
  const { id, value, row, api, field } = props;
  const [currentType, setCurrentType] = useState<RecordTypes>(
    row.type as RecordTypes
  );

  // Show negative value when expense, positive otherwise
  const displayValue =
    currentType === 'expense'
      ? value && Number(value) > 0
        ? `-${Math.abs(Number(value))}`
        : (value?.toString() ?? '')
      : value && Number(value) < 0
        ? Math.abs(Number(value)).toString()
        : (value?.toString() ?? '');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const edited = e.target.value;
    const newValue = edited === '' ? '' : Number(edited);
    api.setEditCellValue({ id, field, value: newValue });
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as RecordTypes;
    setCurrentType(newType);
    const current = Number(value);
    let newAmount = current;
    // Flip sign so it matches the chosen type's convention
    if (newType === 'expense' && current > 0) {
      newAmount = -Math.abs(current);
    } else if (newType !== 'expense' && current < 0) {
      newAmount = Math.abs(current);
    }
    api.setEditCellValue({ id, field, value: newAmount });
    // setEditCellValue for 'type' is a no-op because the type cell
    // is not in edit mode. Instead, directly write into the edit rows
    // state so the valueSetter picks it up on commit.
    if (api.state.editRows[id]) {
      api.state.editRows[id].type = { value: newType };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: 1,
        pr: 0.5,
      }}
    >
      <TextField
        value={displayValue}
        onChange={handleAmountChange}
        type="number"
        size="small"
        autoFocus
        sx={{ flex: 1, minWidth: 0 }}
        slotProps={{ htmlInput: { step: 0.01 } }}
      />
      <Select
        value={currentType}
        onChange={handleTypeChange}
        size="small"
        variant="standard"
        disableUnderline
        sx={{
          minWidth: 84,
          fontSize: '0.85rem',
          '.MuiSelect-select': { p: '3px 12px 3px 8px' },
        }}
      >
        <MenuItem value="expense">Expense</MenuItem>
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="transfer">Transfer</MenuItem>
      </Select>
    </Box>
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
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
          sx={{ fontWeight: 700 }}
          color={params.row.type === 'expense' ? 'error.main' : 'text.primary'}
        >
          {RecordsUtil.formatAmount(params.value, params.row.type)}
        </Typography>
      );
    },
    valueSetter: (value, row, column, apiRef) => {
      const editState = apiRef.current.state.editRows;
      const typeValue = editState[row.ID]?.type?.value;
      return {
        ...row,
        amount: value,
        type: typeValue ?? row.type,
      };
    },
    renderEditCell: (params) => <AmountEditCell {...params} />,
  },
];
