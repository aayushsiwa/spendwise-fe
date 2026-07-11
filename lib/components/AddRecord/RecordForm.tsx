import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

export interface RecordFormData {
  date: string;
  description: string;
  amount: string;
  category: string;
  type: string;
  note: string;
}

interface RecordFormProps {
  formData: RecordFormData;
  onFormDataChange: (field: keyof RecordFormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  categories?: string[];
  types?: string[];
}

const defaultCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

const defaultTypes = ['Income', 'Expense'];

const RecordForm: React.FC<RecordFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting = false,
  categories = defaultCategories,
  types = defaultTypes,
}) => {
  const handleFieldChange =
    (field: keyof RecordFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormDataChange(field, e.target.value);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel shrink htmlFor="date-input">
              Date *
            </InputLabel>
            <TextField
              id="date-input"
              type="date"
              value={formData.date}
              onChange={handleFieldChange('date')}
              fullWidth
              margin="normal"
              required
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <TextField
              label="Description"
              type="text"
              value={formData.description}
              onChange={handleFieldChange('description')}
              fullWidth
              margin="normal"
              required
              placeholder="Enter transaction description"
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={handleFieldChange('amount')}
              fullWidth
              margin="normal"
              required
              inputProps={{
                min: 0,
                step: 0.01,
              }}
              placeholder="0.00"
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Category"
              value={formData.category}
              onChange={handleFieldChange('category')}
              fullWidth
              margin="normal"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleFieldChange('type')}
              fullWidth
              margin="normal"
              required
            >
              {types.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <TextField
              label="Note"
              type="text"
              value={formData.note}
              onChange={handleFieldChange('note')}
              fullWidth
              margin="normal"
              multiline
              rows={2}
              placeholder="Optional notes"
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              <Typography variant="button">
                {isSubmitting ? 'Adding...' : 'Add Record'}
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecordForm;
