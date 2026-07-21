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
    if (!expenses.some((exp) => exp.category === inc.category)) {
      categorySet.add(inc.category);
    }
  }

  const categories = Array.from(categorySet);

  const expenseData = expenses.map((exp) => exp.amount);
  // const incomeData = expenses.map((exp) => 0);

  const uniqueIncomes = incomes.filter(
    (inc) => !expenses.some((exp) => exp.category === inc.category)
  );
  const uniqueIncomeValues = uniqueIncomes.map((inc) => inc.amount);

  const data = [...expenseData, ...uniqueIncomeValues];

  if (data.length === 0) {
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
            data: uniqueIncomeValues,
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
