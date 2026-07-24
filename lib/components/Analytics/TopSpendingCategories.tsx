import { Box, LinearProgress, Typography, alpha } from '@mui/material';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { SummaryMonth } from '@/types/Summary';

type TopSpendingCategoriesProps = {
  summary: SummaryMonth;
  limit?: number;
};

const TopSpendingCategories = ({
  summary,
  limit = 5,
}: TopSpendingCategoriesProps) => {
  const { getCategoryColor } = useCategoriesContext();

  const sorted = [...(summary.expenses ?? [])].sort(
    (a, b) => b.amount - a.amount
  );
  const top = sorted.slice(0, limit);
  const maxAmount = top[0]?.amount ?? 0;

  if (top.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No expense data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {top.map((item) => {
        const color = getCategoryColor(item.category) || '#8884d8';
        const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
        return (
          <Box key={item.category}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.category}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700 }}
                color={color}
              >
                ₹{item.amount.toLocaleString('en-IN')}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(color, 0.12),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default TopSpendingCategories;
