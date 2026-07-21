import { Box, Typography } from '@mui/material';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import { SummaryMonth } from '@/types/Summary';

type SimpleRadarChartProps = {
  summary: SummaryMonth;
};

const SimpleRadarChart = ({ summary }: SimpleRadarChartProps) => {
  const data = [
    ...(summary?.expenses?.map((e) => ({
      category: e.category,
      expense: e.amount,
      income: 0,
    })) ?? []),
    ...(summary?.incomes
      ?.filter(
        (inc) => !summary.expenses?.some((exp) => exp.category === inc.category)
      )
      .map((inc) => ({
        category: inc.category,
        expense: 0,
        income: inc.amount,
      })) ?? []),
  ];

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No category data</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          dataKey="expense"
          stroke="#E17055"
          fill="#E17055"
          fillOpacity={0.3}
          name="Expense"
        />
        <Radar
          dataKey="income"
          stroke="#00B894"
          fill="#00B894"
          fillOpacity={0.3}
          name="Income"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SimpleRadarChart;
