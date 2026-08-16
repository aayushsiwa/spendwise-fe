import {
  Paper,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type BalanceData = {
  date: string;
  balance: number | null;
  income: number;
  expense: number;
  transfer: number;
};

const BalanceChart = ({ data }: { data: BalanceData[] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Paper sx={{ p: 2, height: '100%', width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1,
          fontSize: isMobile ? '1rem' : undefined,
        }}
      >
        Balance Over Time
      </Typography>
      <LineChart
        height={isMobile ? 300 : 400}
        dataset={data}
        series={[
          {
            dataKey: 'balance',
            label: 'Balance',
            color: alpha(theme.palette.primary.main, 0.5),
            area: true,
            showMark: data.length <= 1,
            curve: 'monotoneX',
            connectNulls: true,
          },
          {
            dataKey: 'income',
            label: 'Income',
            color: alpha(theme.palette.success.main, 0.5),
            area: true,
            showMark: false,
            curve: 'monotoneX',
            connectNulls: true,
          },
          {
            dataKey: 'expense',
            label: 'Expense',
            color: alpha(theme.palette.error.main, 0.5),
            area: true,
            showMark: false,
            curve: 'monotoneX',
            connectNulls: true,
          },
          {
            dataKey: 'transfer',
            label: 'Transfer',
            color: alpha(theme.palette.warning.main, 0.5),
            area: true,
            showMark: false,
            curve: 'monotoneX',
            connectNulls: true,
          },
        ]}
        margin={{ bottom: isMobile ? 40 : 60 }}
        xAxis={[
          {
            dataKey: 'date',
            scaleType: 'point',
            tickLabelStyle: {
              angle: isMobile ? 0 : -40,
              textAnchor: isMobile ? 'middle' : 'end',
              fontSize: isMobile ? 10 : 11,
            },
            valueFormatter: (value: string) =>
              new Date(value).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: isMobile ? 'numeric' : 'short',
              }),
            tickLabelInterval: (_, index) => {
              const maxLabels = isMobile ? 6 : 10;
              const step = Math.ceil(data.length / maxLabels);
              return index % step === 0 || index === data.length - 1;
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: { fontSize: isMobile ? 10 : 12 },
            valueFormatter: (value: number) =>
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
            strokeDasharray: '4 4',
          },
          '.MuiLineElement-root': {
            strokeWidth: { sm: 2, md: 2.5 },
          },
          '.MuiMarkElement-root': {
            stroke: theme.palette.primary.main,
            fill: theme.palette.background.paper,
            strokeWidth: 2,
          },
        }}
      />
    </Paper>
  );
};

export default BalanceChart;
