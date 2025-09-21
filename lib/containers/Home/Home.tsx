import { Box, CircularProgress, Grid } from '@mui/material';
import { FC } from 'react';

import BasicLayout from '@/lib/Layout/BasicLayout/BasicLayout';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import useHome from './Home.hooks';

const Home: FC = () => {
  const { summary, isLoading, error } = useHome();

  if (isLoading || !summary) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <BasicLayout>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Summary summary={summary} />
        </Grid>
        <Grid size={8}>
          <Statistics />
        </Grid>
      </Grid>
    </BasicLayout>
  );
};

export default Home;
