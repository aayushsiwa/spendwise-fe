import { InboxOutlined } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC } from 'react';

import DesktopView from './DesktopView';
import useHome from './Home.hooks';
import MobileView from './MobileView';

const Home: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { summary, isLoading, isError, recordProps, records, budgetProgress } =
    useHome();

  if (isLoading) {
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

  if (isError || !summary || !budgetProgress) {
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
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          No records found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try changing the time period or add a new record to get started.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <MobileView
        summary={summary}
        records={records}
        recordProps={recordProps}
        budgetProgress={budgetProgress}
      />
    );
  }

  return (
    <DesktopView
      summary={summary}
      records={records}
      recordProps={recordProps}
      budgetProgress={budgetProgress}
    />
  );
};

export default Home;
