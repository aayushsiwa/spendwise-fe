import { InboxOutlined } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { FC } from 'react';

import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';

import useHome from './Home.hooks';

const Home: FC = () => {
  const theme = useTheme();
  const { summary, isLoading, isError, recordProps, records } = useHome();

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

  if (Array.isArray(records) && records.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: 2,
        }}
      >
        <InboxOutlined
          sx={{
            fontSize: 80,
            color: alpha(theme.palette.text.secondary, 0.3),
          }}
        />
        <Typography variant="h5" color="text.secondary" fontWeight={600}>
          No records found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try changing the time period or add a new record to get started.
        </Typography>
      </Box>
    );
  }

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
      <Grid
        size={{ xs: 12, md: 4 }}
        sx={{
          borderRadius: 1,
          boxShadow: 2,
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
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
