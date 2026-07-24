import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useGetRecordsAPI } from '@/api/records/getRecords';
import MonthOverMonth from '@/lib/components/Analytics/MonthOverMonth';
import SpendingHeatmap from '@/lib/components/Analytics/SpendingHeatmap';
import TopSpendingCategories from '@/lib/components/Analytics/TopSpendingCategories';
import BalanceChart from '@/lib/components/Statistics/Charts/LineChart';
import SimplePieChart from '@/lib/components/Statistics/Charts/PieChart';
import SimpleRadarChart from '@/lib/components/Statistics/Charts/RadarChart';
import useStatistics from '@/lib/components/Statistics/Statistics.hooks';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useSummaryContext } from '@/lib/context/Summary/Summary';
import { DateUtil } from '@/utils/DateUtils';

const Analytics = () => {
  const { summary, isLoading, isError } = useSummaryContext();
  const { range } = usePeriodContext();

  const fetchTo = range.to;
  const fetchFrom = dayjs(range.from)
    .subtract(13, 'month')
    .format('YYYY-MM-DD');

  const { data: recordsData } = useGetRecordsAPI({
    from: fetchFrom,
    to: DateUtil.formattedDate(fetchTo),
    page: 1,
    limit: 9999,
  });

  const records = useMemo(
    () => recordsData?.data?.records ?? [],
    [recordsData]
  );

  const { data } = useStatistics(
    summary ?? {
      expenses: [],
      incomes: [],
      net: 0,
      opening: 0,
      closing: 0,
      totalExpense: 0,
      totalIncome: 0,
    },
    records
  );

  if (isLoading || !summary) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error">Failed to load analytics data</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Balance Trend
            </Typography>
            <BalanceChart data={data} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Top Spending Categories
            </Typography>
            <TopSpendingCategories summary={summary} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Month-over-Month
            </Typography>
            <MonthOverMonth records={records} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Expense Breakdown
            </Typography>
            <SimplePieChart summary={summary} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Category Comparison
            </Typography>
            <SimpleRadarChart summary={summary} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Spending Heatmap (Last 8 Weeks)
            </Typography>
            <SpendingHeatmap records={records} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
