import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { TRecord } from '@/types/Records';

type MonthOverMonthProps = {
  records: TRecord[];
};

type Mode = 'prev-month' | 'prev-year';

function aggregate(records: TRecord[], month: string) {
  let income = 0;
  let expense = 0;
  for (const r of records) {
    if (r.date.slice(0, 7) !== month) continue;
    if (r.type === 'income') income += r.amount;
    else if (r.type === 'expense') expense += r.amount;
  }
  return { income, expense };
}

const MonthOverMonth = ({ records }: MonthOverMonthProps) => {
  const theme = useTheme();
  const [mode, setMode] = useState<Mode>('prev-month');

  const { cur, compare, compareLabel } = useMemo(() => {
    const now = dayjs();
    const current = now.format('YYYY-MM');
    const prev = now.subtract(1, 'month').format('YYYY-MM');
    const lastYear = now.subtract(1, 'year').format('YYYY-MM');

    const cur = aggregate(records, current);

    if (mode === 'prev-month') {
      return {
        cur,
        compare: aggregate(records, prev),
        compareLabel: `vs ${dayjs(prev + '-01').format("MMM 'YY")}`,
      };
    }
    return {
      cur,
      compare: aggregate(records, lastYear),
      compareLabel: `vs ${dayjs(lastYear + '-01').format("MMM 'YY")}`,
    };
  }, [records, mode]);

  const formatMonth = (m: string) => dayjs(m + '-01').format("MMM 'YY");
  const currentMonth = dayjs().format('YYYY-MM');

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {compareLabel}
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
        >
          <ToggleButton value="prev-month">vs Prev Month</ToggleButton>
          <ToggleButton value="prev-year">vs Last Year</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <BarChart
        height={260}
        xAxis={[
          {
            scaleType: 'band',
            data: [formatMonth(currentMonth), compareLabel.replace('vs ', '')],
          },
        ]}
        yAxis={[
          {
            valueFormatter: (v: number) => '₹' + (v / 1000).toFixed(0) + 'k',
          },
        ]}
        series={[
          {
            data: [cur.income, compare.income],
            label: 'Income',
            color: theme.palette.success.main,
          },
          {
            data: [cur.expense, compare.expense],
            label: 'Expense',
            color: theme.palette.error.main,
          },
        ]}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: { vertical: 'bottom', horizontal: 'center' },
          },
        }}
      />
    </Box>
  );
};

export default MonthOverMonth;
