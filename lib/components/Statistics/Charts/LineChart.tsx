import {
  Card,
  CardContent,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type BalanceData = {
  date: string;
  balance: number;
};

const BalanceChart = ({ data }: { data: BalanceData[] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card>
      <CardContent
        sx={{
          p: isMobile ? 1.5 : 2.5,
          '&:last-child': { pb: isMobile ? 1.5 : 2.5 },
        }}
      >
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
          height={isMobile ? 200 : 350}
          dataset={data}
          series={[
            {
              dataKey: 'balance',
              label: 'Balance',
              color: theme.palette.primary.main,
              area: true,
              showMark: data.length <= 1,
              curve: 'monotoneX',
            },
          ]}
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
            '.MuiAreaElement-root': {
              fill: alpha(theme.palette.primary.main, 0.15),
            },
            '.MuiLineElement-root': {
              strokeWidth: isMobile ? 2 : 2.5,
            },
            '.MuiMarkElement-root': {
              stroke: theme.palette.primary.main,
              fill: theme.palette.background.paper,
              strokeWidth: 2,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BalanceChart;
