import { Box, Stack } from '@mui/material';
import { FC } from 'react';

import BudgetRadarChart from '@/lib/components/BudgetProgress/BudgetRadarChart';
import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import type { HomeViewProps } from './types';

const MobileView: FC<HomeViewProps> = ({ summary, records, recordProps }) => {
  return (
    <Stack spacing={2}>
      <Summary summary={summary} />
      <BudgetRadarChart />
      <Statistics summary={summary} records={records ?? []} />
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
    </Stack>
  );
};

export default MobileView;
