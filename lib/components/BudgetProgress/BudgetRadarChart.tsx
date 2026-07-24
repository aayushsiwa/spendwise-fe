import { Box, Paper, Typography, useTheme } from '@mui/material';
import { RadarChart } from '@mui/x-charts';
import dayjs from 'dayjs';

import { useGetBudgetProgressAPI } from '@/api/budgets/getBudgetProgress';
import { usePeriodContext } from '@/lib/context/Period/Period';

const BudgetRadarChart = () => {
  const theme = useTheme();
  const { range } = usePeriodContext();
  const from = dayjs(range.from);
  const { data } = useGetBudgetProgressAPI({
    month: from.month() + 1,
    year: from.year(),
  });

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

  const categories = progress.map((bp) => bp.category);
  const budgetData = progress.map((bp) => bp.amount);
  const spentData = progress.map((bp) => bp.spent);

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
