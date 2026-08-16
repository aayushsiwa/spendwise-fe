import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';

import { useCreateCategoryAPI } from '@/api/categories/createCategory';
import {
  CATEGORY_ICONS,
  CategoryIcon,
} from '@/lib/components/Category/CategoryIcon';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { Record, RecordTypes } from '@/types/Records';
import { snake_CaseToNormalTitle } from '@/utils/CategoryUtils';
import { DateUtil } from '@/utils/DateUtils';
import {
  RecordValidationErrors,
  hasRecordValidationErrors,
  normalizeRecord,
  validateRecord,
} from '@/validations/Record';

type RecordDetailDialogProps = {
  record: Record | null;
  open: boolean;
  onClose: () => void;
  onSave?: (record: Record) => Promise<void>;
  onDelete?: (ID: string) => Promise<void>;
};

const RecordDetailDialog = ({
  record,
  open,
  onClose,
  onSave,
  onDelete,
}: RecordDetailDialogProps) => {
  const { categories } = useCategoriesContext();
  const createCategory = useCreateCategoryAPI();
  const isCreate = !record;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<RecordValidationErrors>({});
  const [createCatDialogOpen, setCreateCatDialogOpen] = useState(false);
  const [createCatForm, setCreateCatForm] = useState({
    name: '',
    icon: 'restaurant',
    color: '#1976d2',
  });
  const [edit, setEdit] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'expense' as RecordTypes,
    note: '',
  });

  useEffect(() => {
    if (record) {
      setEdit({
        date: record.date,
        description: record.description,
        category: record.category,
        amount: record.amount.toString(),
        type: record.type,
        note: record.note,
      });
    } else {
      setEdit({
        date: DateUtil.formattedDate(),
        description: '',
        category: '',
        amount: '',
        type: 'expense',
        note: '',
      });
    }

    setValidationErrors({});
  }, [record, open]);

  const handleChange = <T extends keyof typeof edit>(
    field: T,
    value: string
  ) => {
    // For amount field, ensure the value doesn't contradict the selected type
    if (field === 'amount' && value !== '' && value !== '-') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue < 0) {
        // User entered a negative amount - adjust type to expense
        setEdit((current) => ({
          ...current,
          [field]: value,
          type: 'expense',
        }));
        setValidationErrors((current) => {
          const next = { ...current };
          delete next[field];
          delete next.type;
          return next;
        });
        return;
      }
    }

    setEdit((current) => ({ ...current, [field]: value }));
    setValidationErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSave = async () => {
    if (!onSave) return;

    const normalizedRecord = normalizeRecord({
      date: edit.date,
      description: edit.description,
      category: edit.category,
      amount: parseFloat(edit.amount),
      type: edit.type,
      note: edit.note,
    });

    const nextValidationErrors = validateRecord(normalizedRecord);
    if (hasRecordValidationErrors(nextValidationErrors)) {
      setValidationErrors(nextValidationErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ID: record?.ID ?? '',
        ...normalizedRecord,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!record || !onDelete) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(record.ID);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const isBusy = saving || deleting;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          if (!isBusy) onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: 700 }}>
            {isCreate ? 'Add Record' : 'Edit Record'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Description"
              value={edit.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
              autoFocus
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
            <FormControl
              fullWidth
              error={!!validationErrors.amount}
              variant="outlined"
            >
              <InputLabel htmlFor="amount-field">Amount</InputLabel>
              <OutlinedInput
                id="amount-field"
                type="number"
                label="Amount"
                value={edit.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <Select
                      value={edit.type}
                      onChange={(e: SelectChangeEvent) =>
                        handleChange('type', e.target.value)
                      }
                      size="small"
                      variant="standard"
                      disableUnderline
                      sx={{
                        minWidth: 90,
                        fontSize: '0.95rem',
                        '.MuiSelect-select': { p: '3px 12px 3px 8px' },
                      }}
                    >
                      <MenuItem value="expense">Expense</MenuItem>
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="transfer">Transfer</MenuItem>
                    </Select>
                  </InputAdornment>
                }
              />
              {validationErrors.amount && (
                <FormHelperText>{validationErrors.amount}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={edit.date}
              onChange={(e) => handleChange('date', e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!validationErrors.date}
              helperText={validationErrors.date}
            />
            <Autocomplete
              freeSolo
              options={categories?.map((cat) => cat.name) ?? []}
              inputValue={edit.category}
              onInputChange={(_, value, reason) => {
                if (reason === 'input') {
                  handleChange('category', value);
                }
              }}
              onChange={(_, value) => {
                if (typeof value === 'string') {
                  const match = value.match(/^\+ Create "(.+)"$/);
                  if (match) {
                    setCreateCatForm({
                      name: match[1],
                      icon: 'restaurant',
                      color: '#1976d2',
                    });
                    setCreateCatDialogOpen(true);
                  } else if (value) {
                    handleChange('category', value);
                  }
                }
              }}
              filterOptions={(options, { inputValue }) => {
                const filtered = options.filter((opt) =>
                  opt.toLowerCase().includes(inputValue.toLowerCase())
                );
                if (
                  inputValue.trim() &&
                  !options.some(
                    (opt) => opt.toLowerCase() === inputValue.toLowerCase()
                  )
                ) {
                  filtered.push(`+ Create "${inputValue}"`);
                }
                return filtered;
              }}
              renderOption={(props, option) => {
                if (option.startsWith('+ Create "')) {
                  return (
                    <li {...props}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'primary.main',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option}
                        </Typography>
                      </Box>
                    </li>
                  );
                }
                return <li {...props}>{option}</li>;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  fullWidth
                  error={!!validationErrors.category}
                  helperText={validationErrors.category}
                />
              )}
            />
            <TextField
              label="Note"
              value={edit.note}
              onChange={(e) => handleChange('note', e.target.value)}
              fullWidth
              multiline
              rows={2}
              error={!!validationErrors.note}
              helperText={validationErrors.note}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          {!isCreate && onDelete && (
            <Button color="error" onClick={handleDelete} disabled={isBusy}>
              Delete
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Button onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            {onSave && (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isBusy}
              >
                {isCreate ? 'Create' : 'Save'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createCatDialogOpen}
        onClose={() => setCreateCatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: 700 }}>Add Category</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={createCatForm.name}
              onChange={(e) =>
                setCreateCatForm({ ...createCatForm, name: e.target.value })
              }
              fullWidth
              autoFocus
            />
            <TextField
              select
              label="Icon"
              value={createCatForm.icon}
              onChange={(e) =>
                setCreateCatForm({ ...createCatForm, icon: e.target.value })
              }
              fullWidth
            >
              {Object.keys(CATEGORY_ICONS).map((name) => (
                <MenuItem key={name} value={name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon name={name} />
                    {snake_CaseToNormalTitle(name)}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Color"
              value={createCatForm.color}
              onChange={(e) =>
                setCreateCatForm({ ...createCatForm, color: e.target.value })
              }
              fullWidth
              placeholder="#1976d2"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCatDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!createCatForm.name.trim()) return;
              try {
                await createCategory.mutateAsync(createCatForm);
                handleChange('category', createCatForm.name);
                setCreateCatDialogOpen(false);
              } catch {
                /* error handled by mutation */
              }
            }}
            disabled={!createCatForm.name.trim() || createCategory.isPending}
          >
            {createCategory.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecordDetailDialog;
