import { Box, Typography, useTheme } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BalanceData = {
  date: string; // e.g. '2025-09-01'
  balance: number; // balance on that date
};

const BalanceChart = ({ data }: { data: BalanceData[] }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, ml: 2, mt: 1 }}>
        Your Account
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(value)
            }
            labelStyle={{
              color: theme.palette.text.secondary, // tooltip label (date)
              fontWeight: 600,
            }}
            itemStyle={{
              color: theme.palette.text.primary, // value color
              fontWeight: 700,
            }}
            contentStyle={{
              backgroundColor: theme.palette.background.paper, // tooltip box background
              borderRadius: 8,
              borderColor: theme.palette.divider,
              padding: '10px 12px',
            }}
          />

          <Line
            type="monotone"
            dataKey="balance"
            stroke={'blue'}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BalanceChart;
