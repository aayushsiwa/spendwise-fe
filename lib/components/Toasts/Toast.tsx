import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import * as React from 'react';

const Toast: React.FC<{
  variant: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}> = ({ variant, message, duration = 6000 }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={variant}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Toast;
