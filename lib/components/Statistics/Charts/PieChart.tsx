import { Box, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';
import { SummaryMonth } from '@/types/Summary';

type SimplePieChartProps = {
  summary: SummaryMonth;
};

const SimplePieChart = ({ summary }: SimplePieChartProps) => {
  const { getCategoryColor } = useCategoriesContext();

  if (!summary?.expenses || summary.expenses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No expense data</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={summary.expenses}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {summary.expenses.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getCategoryColor(entry.category) || '#8884d8'}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SimplePieChart;
