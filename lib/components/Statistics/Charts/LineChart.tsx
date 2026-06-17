import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type BalanceData = {
  date: string;
  balance: number;
};

const BalanceChart = ({ data }: { data: BalanceData[] }) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Balance Over Time
        </Typography>
        <LineChart
          height={350}
          dataset={data}
          series={[
            {
              dataKey: 'balance',
              label: 'Balance',
              color: theme.palette.primary.main,
              area: true,
              showMark: data.length < 60,
              curve: 'monotoneX',
            },
          ]}
          xAxis={[
            {
              dataKey: 'date',
              scaleType: 'point',
              tickLabelStyle: {
                angle: -40,
                textAnchor: 'end',
                fontSize: 11,
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
              fill: `url(#gradient)`,
            },
            '.MuiLineElement-root': {
              strokeWidth: 2.5,
            },
            '.MuiMarkElement-root': {
              stroke: theme.palette.primary.main,
              fill: theme.palette.background.paper,
              strokeWidth: 2,
            },
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default BalanceChart;
