import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

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
    <Box sx={{ width: '100%', height: 300 }}>
      <PieChart
        series={[
          {
            data: summary.expenses.map((entry, index) => ({
              id: index,
              value: entry.amount,
              label: entry.category,
              color: getCategoryColor(entry.category) || '#8884d8',
            })),
            innerRadius: 60,
            outerRadius: 80,
            arcLabel: (item) => `${item.label} ${((item.value / summary.expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(0)}%`,
            arcLabelMinAngle: 30,
          },
        ]}
        height={300}
      />
    </Box>
  );
};

export default SimplePieChart;
