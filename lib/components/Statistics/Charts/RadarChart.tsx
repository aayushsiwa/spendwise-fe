import { Box, Typography } from '@mui/material';
import { RadarChart } from '@mui/x-charts/RadarChart';

import { SummaryMonth } from '@/types/Summary';

type SimpleRadarChartProps = {
  summary: SummaryMonth;
};

const SimpleRadarChart = ({ summary }: SimpleRadarChartProps) => {
  const categorySet = new Set<string>();
  const expenses = summary?.expenses || [];
  const incomes = summary?.incomes || [];

  for (const exp of expenses) {
    categorySet.add(exp.category);
  }

  for (const inc of incomes) {
    categorySet.add(inc.category);
  }

  const categories = Array.from(categorySet);

  // Generate data arrays in the same order as categories
  const expenseData = categories.map((category) => {
    const exp = expenses.find((e) => e.category === category);
    return exp ? exp.amount : 0;
  });

  const incomeData = categories.map((category) => {
    const inc = incomes.find((i) => i.category === category);
    return inc ? inc.amount : 0;
  });

  // Check if both series are empty
  if (expenseData.every((v) => v === 0) && incomeData.every((v) => v === 0)) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No category data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <RadarChart
        height={300}
        series={[
          {
            label: 'Expense',
            data: expenseData,
            color: '#E17055',
          },
          {
            label: 'Income',
            data: incomeData,
            color: '#00B894',
          },
        ]}
        radar={{
          metrics: categories,
        }}
      />
    </Box>
  );
};

export default SimpleRadarChart;
