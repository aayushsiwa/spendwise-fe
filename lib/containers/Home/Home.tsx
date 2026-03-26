import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { FC } from 'react';

import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import useHome from './Home.hooks';

const Home: FC = () => {
  const { summary, isLoading, isError, recordProps } = useHome();

  if (isLoading || !summary) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
        }}
      >
        Error while loading data.
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {/* first line */}
      <Grid
        size={{
          xs: 12,
        }}
      >
        <Summary summary={summary} />
      </Grid>
      {/* second line more of a stack */}
      <Grid
        size={{
          xs: 12,
          lg: 8,
        }}
      >
        <Stack spacing={2}>
          <Statistics summary={summary} />
          <Statistics summary={summary} />
        </Stack>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
        }}
        sx={{
          borderRadius: 1,
          boxShadow: 2,
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Records
          {...recordProps}
          isAddingAllowed={false}
          isCheckBoxSelectionAllowed={false}
        />
      </Grid>
      {/* third line */}
      <Grid size={8}></Grid>
    </Grid>
  );
};

export default Home;
