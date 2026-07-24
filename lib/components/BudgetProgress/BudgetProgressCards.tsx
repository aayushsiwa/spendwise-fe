import { Box, LinearProgress, Paper, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

import { useGetBudgetProgressAPI } from '@/api/budgets/getBudgetProgress';
import { usePeriodContext } from '@/lib/context/Period/Period';

const BudgetProgressCards = () => {
  const { range } = usePeriodContext();
  const from = dayjs(range.from);
  const { data } = useGetBudgetProgressAPI({
    month: from.month() + 1,
    year: from.year(),
  });
  const theme = useTheme();

  const progress = data?.data.progress ?? [];

  if (progress.length === 0) return null;

  const getColor = (pct: number) => {
    if (pct >= 100) return theme.palette.error.main;
    if (pct >= 80) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontWeight: 700, mb: 1.5 }}
      >
        Budget Progress
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {progress.slice(0, 4).map((bp) => {
          const pct = Math.min(bp.percentage, 100);
          const color = getColor(pct);
          return (
            <Box key={bp.ID}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.3,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {bp.category}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{bp.spent.toLocaleString('en-IN')} / ₹
                  {bp.amount.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(color, 0.15),
                  '& .MuiLinearProgress-bar': { backgroundColor: color },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default BudgetProgressCards;
