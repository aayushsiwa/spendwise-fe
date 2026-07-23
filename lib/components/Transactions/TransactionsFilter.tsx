import { Clear } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useMemo } from 'react';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';

export type FiltersState = {
  search: string;
  type: string;
  category: string;
  from: string;
  to: string;
};

type TransactionsFilterProps = {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
};

const defaultFilters: FiltersState = {
  search: '',
  type: '',
  category: '',
  from: '',
  to: '',
};

const TransactionsFilter = ({ filters, onChange }: TransactionsFilterProps) => {
  const { categories } = useCategoriesContext();

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== '' ||
      filters.type !== '' ||
      filters.category !== '' ||
      filters.from !== '' ||
      filters.to !== '',
    [filters]
  );

  return (
    <Box
      sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}
    >
      <TextField
        size="small"
        placeholder="Search description..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filters.type}
          label="Type"
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="transfer">Transfer</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          label="Category"
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          {categories?.map((cat) => (
            <MenuItem key={cat.ID} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        type="date"
        label="From"
        value={filters.from}
        onChange={(e) => onChange({ ...filters, from: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 140 }}
      />
      <TextField
        size="small"
        type="date"
        label="To"
        value={filters.to}
        onChange={(e) => onChange({ ...filters, to: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 140 }}
      />
      {hasActiveFilters && (
        <Button
          size="small"
          startIcon={<Clear />}
          onClick={() => onChange(defaultFilters)}
          color="error"
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export { defaultFilters };
export default TransactionsFilter;
