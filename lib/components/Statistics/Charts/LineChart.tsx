import { Card, CardContent, Typography, useTheme } from '@mui/material';
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
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Balance Trend
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(value)
              }
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
      </CardContent>
    </Card>
  );
};

export default BalanceChart;
