import { ThemeOptions, createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2', contrastText: '#fff' },
          secondary: { main: '#9c27b0', contrastText: '#fff' },
          background: { default: '#f5f5f5', paper: '#ffffff' },
          text: { primary: '#333', secondary: '#555' },
        }
      : {
          primary: { main: '#90caf9', contrastText: '#000' },
          secondary: { main: '#ce93d8', contrastText: '#000' },
          background: { default: '#121212', paper: '#1e1e1e' },
          text: { primary: '#ffffff', secondary: '#cccccc' },
        }),
  },
  typography: {
    fontFamily: `'Roboto','Helvetica','Arial',sans-serif`,
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});
