import { Box, Grid, Stack } from '@mui/material';
import { FC } from 'react';

import BudgetRadarChart from '@/lib/components/BudgetProgress/BudgetRadarChart';
import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import type { HomeViewProps } from './types';

const DesktopView: FC<HomeViewProps> = ({ summary, records, recordProps }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Summary summary={summary} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack spacing={2}>
          <Statistics summary={summary} records={records ?? []} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <BudgetRadarChart />
      </Grid>
      <Grid size={{ xs: 12 }}>
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
