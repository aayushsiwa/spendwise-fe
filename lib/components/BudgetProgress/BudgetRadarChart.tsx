import { Box, Paper, Typography, useTheme } from '@mui/material';
import { RadarChart } from '@mui/x-charts/RadarChart';

import { GetBudgetProgressResponse } from '@/api/budgets/getBudgetProgress';

const BudgetRadarChart = ({ data }: { data: GetBudgetProgressResponse }) => {
  const theme = useTheme();

  const progress = data?.data.progress ?? [];

  if (progress.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Budget Overview
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No budgets set for this month
          </Typography>
        </Box>
      </Paper>
    );
  }

  const validCategories = new Set<string>();
  const validProgress = progress.filter((bp) => {
    return (
      typeof bp.category === 'string' &&
      bp.category.trim() !== '' &&
      Number.isFinite(bp.amount) &&
      Number.isFinite(bp.spent) &&
      !validCategories.has(bp.category) &&
      validCategories.add(bp.category)
    );
  });

  if (validProgress.length < 2) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Budget Overview
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Need at least two valid budget categories
          </Typography>
        </Box>
      </Paper>
    );
  }

  const categories = validProgress.map((bp) => bp.category);
  const budgetData = validProgress.map((bp) => bp.amount);
  const spentData = validProgress.map((bp) => bp.spent);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontWeight: 700, mb: 1 }}
      >
        Budget Overview
      </Typography>
      <Box sx={{ width: '100%', height: 280 }}>
        <RadarChart
          height={280}
          highlight="axis"
          series={[
            {
              label: 'Budget',
              data: budgetData,
              color: theme.palette.primary.main,
            },
            {
              label: 'Spent',
              data: spentData,
              color: theme.palette.error.main,
            },
          ]}
          radar={{
            metrics: categories,
          }}
        />
      </Box>
    </Paper>
  );
};

export default BudgetRadarChart;
