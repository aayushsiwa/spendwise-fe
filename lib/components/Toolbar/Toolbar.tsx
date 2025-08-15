import { Add, Refresh } from '@mui/icons-material';
import { Box, Fab, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';

const Toolbar = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  const handleAddRecord = () => {
    // TODO: Implement add record functionality
    console.log('Add record clicked');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        display: 'flex',
        // flexDirection: "column",
        gap: 2,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Refresh Data" placement="left">
        <Fab
          color="secondary"
          size="medium"
          onClick={handleRefresh}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
        >
          <Refresh />
        </Fab>
      </Tooltip>

      <Tooltip title="Add Record" placement="left">
        <Fab
          color="primary"
          size="large"
          onClick={handleAddRecord}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;
