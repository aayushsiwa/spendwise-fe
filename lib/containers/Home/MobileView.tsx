import { Box, Stack } from '@mui/material';
import { FC } from 'react';

import BudgetRadarChart from '@/lib/components/BudgetProgress/BudgetRadarChart';
import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import type { HomeViewProps } from './types';

const MobileView: FC<HomeViewProps> = ({
  summary,
  records,
  recordProps,
  budgetProgress,
}) => {
  // Compute valid unique categories the same way BudgetRadarChart does
  const progress = budgetProgress.data.progress ?? [];
  const validCategories = new Set<string>();
  const validProgress = progress.filter((bp) => {
    return (
      typeof bp.category === 'string' &&
      bp.category.trim() !== '' &&
      Number.isFinite(bp.amount) &&
      Number.isFinite(bp.spent) &&
      !validCategories.has(bp.category) &&
      validCategories.add(bp.category)
    );
  });
  const hasEnoughCategories = validProgress.length >= 3;

  return (
    <Stack spacing={2}>
      <Summary summary={summary} />
      {hasEnoughCategories && <BudgetRadarChart data={budgetProgress} />}
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
