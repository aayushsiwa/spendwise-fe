import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { Record, RecordTypes } from '@/types/Records';
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
  const isCreate = !record;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<RecordValidationErrors>({});
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
          {categories && categories.length > 0 ? (
            <TextField
              select
              label="Category"
              value={edit.category}
              onChange={(e) => handleChange('category', e.target.value)}
              fullWidth
              error={!!validationErrors.category}
              helperText={validationErrors.category}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.ID} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              label="Category"
              value={edit.category}
              onChange={(e) => handleChange('category', e.target.value)}
              fullWidth
              error={!!validationErrors.category}
              helperText={validationErrors.category}
            />
          )}
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
            <Button variant="contained" onClick={handleSave} disabled={isBusy}>
              {isCreate ? 'Create' : 'Save'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RecordDetailDialog;
