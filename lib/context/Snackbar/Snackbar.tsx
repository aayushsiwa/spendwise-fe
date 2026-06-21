import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import {
  ReactNode,
  SyntheticEvent,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

type SnackbarState = {
  message: string;
  severity: SnackbarSeverity;
  duration: number;
};

type SnackbarContextValue = {
  showSnackbar: (
    message: string,
    severity?: SnackbarSeverity,
    duration?: number
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const handleClose = (
    _event?: Event | SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(null);
  };

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSnackbar: (
        message: string,
        severity: SnackbarSeverity = 'info',
        duration = 4000
      ) => {
        setSnackbar({ message, severity, duration });
      },
    }),
    []
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={snackbar?.duration ?? 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar?.severity ?? 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useAppSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useAppSnackbar must be used within SnackbarProvider');
  }

  return context;
};
