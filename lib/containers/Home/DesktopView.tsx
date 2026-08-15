import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import SpendingHeatmap from '@/lib/components/Analytics/SpendingHeatmap';
import BudgetRadarChart from '@/lib/components/BudgetProgress/BudgetRadarChart';
import Records from '@/lib/components/Records/Records';
import SimpleRadarChart from '@/lib/components/Statistics/Charts/RadarChart';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import type { HomeViewProps } from './types';

const DesktopView: FC<HomeViewProps> = ({
  summary,
  records,
  recordProps,
  budgetProgress,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Summary summary={summary} />
      </Grid>
      <Grid
        size={{ xs: 12, lg: budgetProgress.data.progress.length > 2 ? 8 : 12 }}
      >
        <Statistics summary={summary} records={records ?? []} />
      </Grid>
      {budgetProgress.data.progress.length > 2 && (
        <Grid size={{ xs: 12, lg: 4 }}>
          <BudgetRadarChart data={budgetProgress} />
        </Grid>
      )}
      <Grid size={{ xs: 12, lg: 12 }}>
        <Box
          sx={{
            borderRadius: 1,
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Records {...recordProps} isCheckBoxSelectionAllowed={false} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DesktopView;
