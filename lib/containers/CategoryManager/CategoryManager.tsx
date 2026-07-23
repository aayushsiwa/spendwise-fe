import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useCreateCategoryAPI } from '@/api/categories/createCategory';
import { useDeleteCategoryAPI } from '@/api/categories/deleteCategory';
import { useUpdateCategoryAPI } from '@/api/categories/updateCategory';
import {
  CATEGORY_ICONS,
  CategoryIcon,
} from '@/lib/components/Category/CategoryIcon';
import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { Category } from '@/types/Categories';
import { snake_CaseToNormalTitle } from '@/utils/CategoryUtils';

import { CategoryCard } from './CategoryCard';

const CategoryManager = () => {
  const { categories } = useCategoriesContext();
  const createCategory = useCreateCategoryAPI();
  const updateCategory = useUpdateCategoryAPI();
  const deleteCategory = useDeleteCategoryAPI();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'restaurant',
    color: '#1976d2',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: 'restaurant', color: '#1976d2' });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, icon: cat.icon, color: cat.color });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          ID: editingCategory.ID,
          data: formData,
        });
        setSnackbar({ message: 'Category updated', severity: 'success' });
      } else {
        await createCategory.mutateAsync(formData);
        setSnackbar({ message: 'Category created', severity: 'success' });
      }
      setDialogOpen(false);
    } catch {
      setSnackbar({ message: 'Failed to save category', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteCategory.mutateAsync(deleteConfirm.ID);
      setSnackbar({ message: 'Category deleted', severity: 'success' });
      setDeleteConfirm(null);
    } catch {
      setSnackbar({
        message: 'Failed to delete category. It may have associated records.',
        severity: 'error',
      });
      setDeleteConfirm(null);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Category Manager
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Add Category
        </Button>
      </Box>

      <Grid container spacing={2}>
        {categories?.map((cat) => (
          // move card to other component
          <CategoryCard
            key={cat.ID}
            cat={cat}
            openEdit={openEdit}
            setDeleteConfirm={setDeleteConfirm}
          />
        ))}
      </Grid>

      {categories?.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No categories yet. Click &quot;Add Category&quot; to create one.
        </Typography>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              autoFocus
            />
            <TextField
              select
              label="Icon"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
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
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              fullWidth
              placeholder="#1976d2"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Preview:
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: formData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: '"Material Icons", sans-serif',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>
                  <CategoryIcon name={formData.icon} />
                </span>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formData.name}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              !formData.name.trim() ||
              createCategory.isPending ||
              updateCategory.isPending
            }
          >
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteConfirm?.name}&quot;?
            This cannot be undone if no records use this category.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
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

export default CategoryManager;
