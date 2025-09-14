import { Box, CircularProgress, Paper, useTheme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { FC } from 'react';

import Records from '@/lib/components/Records/Records';
import Statistics from '@/lib/components/Statistics/Statistics';
import Summary from '@/lib/components/Summary/Summary';
import Toolbar from '@/lib/components/Toolbar/Toolbar';
import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6299d0',
    },
    secondary: {
      main: '#6C5CE7',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const Home: FC = () => {
  const theme = useTheme();

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetSummaryAPI();

  if (summaryLoading || !summary) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  if (summaryError) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ color: theme.palette.error.main, textAlign: 'center' }}>
          <h2>Error Loading Data</h2>
          <p>Failed to load summary data. Please try refreshing the page.</p>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        // backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        sx={{
          padding: 2,
          margin: 2,
          borderRadius: 2,
          // backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
        variant="outlined"
      >
        <Summary summary={summary} />
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '80%',
        }}
      >
        <Paper
          sx={{
            flex: 1,
            padding: 2,
            margin: 2,
            borderRadius: 2,
            width: '70%',
            // backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            overflow: 'hidden',
          }}
          variant="outlined"
        >
          <Records />
        </Paper>

        {/* <Paper
            sx={{
              flex: 1,
              padding: 2,
              margin: 2,
              maxWidth: "30%",
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              overflow: "hidden",
            }}
          >
            <AddRecord />
          </Paper> */}
        {/* <Paper
          sx={{
            flex: 1,
            padding: 2,
            margin: 2,
            maxWidth: '30%',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            overflow: 'hidden',
          }}
        >
          <Statistics />
        </Paper> */}
      </Box>

      <Toolbar />
    </Box>
  );
};

export default Home;
