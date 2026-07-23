import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { CategoryIcon } from '@/lib/components/Category/CategoryIcon';
import { Category } from '@/types/Categories';

export const CategoryCard = ({
  cat,
  openEdit,
  setDeleteConfirm,
}: {
  cat: Category;
  openEdit: (cat: Category) => void;
  setDeleteConfirm: (cat: Category) => void;
}) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.ID}>
        <Card variant="outlined">
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: cat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontFamily: '"Material Icons", sans-serif',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>
                <CategoryIcon name={cat.icon} />
              </span>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{cat.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                <CategoryIcon name={cat.name} />
              </Typography>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEdit(cat)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteConfirm(cat)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};
