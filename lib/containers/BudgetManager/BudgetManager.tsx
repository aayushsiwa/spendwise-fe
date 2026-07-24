import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useCreateBudgetAPI } from '@/api/budgets/createBudget';
import { useDeleteBudgetAPI } from '@/api/budgets/deleteBudget';
import { useGetBudgetProgressAPI } from '@/api/budgets/getBudgetProgress';
import { useUpdateBudgetAPI } from '@/api/budgets/updateBudget';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { BudgetProgress } from '@/types/Budget';

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const BudgetManager = () => {
  const { categories } = useCategoriesContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetProgress | null>(null);
  const [formData, setFormData] = useState({ categoryID: '', amount: '' });
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [deleteTarget, setDeleteTarget] = useState<BudgetProgress | null>(null);

  const { data: progressData, isLoading } = useGetBudgetProgressAPI({
    month,
    year,
  });

  const createBudget = useCreateBudgetAPI();
  const updateBudget = useUpdateBudgetAPI();
  const deleteBudget = useDeleteBudgetAPI();

  const progress = progressData?.data.progress ?? [];

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormData({ categoryID: categories?.[0]?.ID ?? '', amount: '' });
    setDialogOpen(true);
  };

  const openEdit = (bp: BudgetProgress) => {
    setEditing(bp);
    setFormData({ categoryID: bp.categoryID, amount: bp.amount.toString() });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0 || !formData.categoryID) return;

    try {
      if (editing) {
        await updateBudget.mutateAsync({ ID: editing.ID, amount });
        setSnackbar({ message: 'Budget updated', severity: 'success' });
      } else {
        await createBudget.mutateAsync({
          categoryID: formData.categoryID,
          amount,
          month,
          year,
        });
        setSnackbar({ message: 'Budget created', severity: 'success' });
      }
      setDialogOpen(false);
    } catch {
      setSnackbar({ message: 'Failed to save budget', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBudget.mutateAsync(deleteTarget.ID);
      setSnackbar({ message: 'Budget deleted', severity: 'success' });
      setDeleteTarget(null);
    } catch {
      setSnackbar({ message: 'Failed to delete budget', severity: 'error' });
      setDeleteTarget(null);
    }
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return 'error';
    if (pct >= 80) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Budgets - {MONTHS[month - 1]} {year}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {MONTHS.map((name, i) => (
              <MenuItem key={i} value={i + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ minWidth: 90 }}
          />
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Add Budget
          </Button>
        </Box>
      </Box>

      {isLoading && <LinearProgress />}

      <Grid container spacing={2}>
        {progress.map((bp) => {
          const pct = Math.min(bp.percentage, 100);
          const color = getProgressColor(pct);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bp.ID}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {bp.category}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => openEdit(bp)}
                        aria-label="Edit budget"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget(bp)}
                        aria-label="Delete budget"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ₹{bp.spent.toLocaleString('en-IN')} / ₹
                      {bp.amount.toLocaleString('en-IN')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700 }}
                      color={`${color}.main`}
                    >
                      {bp.percentage.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    color={color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  {bp.percentage >= 100 && (
                    <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                      Budget exceeded by ₹
                      {(bp.spent - bp.amount).toLocaleString('en-IN')}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {!isLoading && progress.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No budgets set for this month. Click &quot;Add Budget&quot; to create
          one.
        </Typography>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Category"
              value={formData.categoryID}
              onChange={(e) =>
                setFormData({ ...formData, categoryID: e.target.value })
              }
              fullWidth
              disabled={!!editing}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.ID} value={cat.ID}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Budget Amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              fullWidth
              slotProps={{ htmlInput: { min: 1, step: 100 } }}
            />
            {!editing && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  select
                  label="Month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  fullWidth
                >
                  {MONTHS.map((name, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  fullWidth
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              !formData.amount ||
              !formData.categoryID ||
              createBudget.isPending ||
              updateBudget.isPending
            }
          >
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the budget for &quot;
            {deleteTarget?.category}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteBudget.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {snackbar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(null)}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BudgetManager;
