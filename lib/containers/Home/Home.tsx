import { Box, CircularProgress, Grid } from '@mui/material';
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

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Summary summary={summary} />
      </Grid>
      <Grid size={8}>
        <Statistics summary={summary} />
      </Grid>
      <Grid size={4}>
        <Records {...recordProps} isAddingAllowed={false} />
      </Grid>
      <Grid size={8}>
        <Statistics summary={summary} />
      </Grid>
    </Grid>
  );
};

export default Home;
