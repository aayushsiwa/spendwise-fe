import { Box, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type BalanceData = {
  date: string;
  balance: number;
};

const BalanceChart = ({ data }: { data: BalanceData[] }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 1,
        boxShadow: 2,
        height: 'fit-content',
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Your Account
      </Typography>

      <LineChart
        height={500}
        dataset={data}
        series={[
          {
            dataKey: 'balance', // ✅ use dataKey with dataset
            label: 'Balance',
            color: 'blue',
            area: true,
            showMark: false,
          },
        ]}
        xAxis={[
          {
            dataKey: 'date', // ✅ correct
            scaleType: 'point',
            tickLabelStyle: {
              angle: -45,
              textAnchor: 'end',
              fontSize: 12,
            },
            valueFormatter: (value: string) =>
              new Date(value).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              }),
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: { fontSize: 12 },
            valueFormatter: (value) =>
              new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(value as number),
          },
        ]}
        sx={{
          '.MuiChartsGrid-line': {
            stroke: theme.palette.divider,
            strokeDasharray: '3 3',
          },
          '.MuiLineElement-root': {
            strokeWidth: 3,
          },
        }}
      />
    </Box>
  );
};

export default BalanceChart;
