import { ThemeOptions } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
            contrastText: '#fff',
          },
          secondary: {
            main: '#EC4899',
            light: '#F472B6',
            dark: '#DB2777',
            contrastText: '#fff',
          },
          success: { main: '#10B981', light: '#34D399', dark: '#059669' },
          error: { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
          warning: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
          info: { main: '#3B82F6', light: '#60A5FA', dark: '#2563EB' },
          background: { default: '#F8FAFC', paper: '#FFFFFF' },
          text: { primary: '#1E293B', secondary: '#64748B' },
          divider: '#E2E8F0',
        }
      : {
          primary: {
            main: '#818CF8',
            light: '#A5B4FC',
            dark: '#6366F1',
            contrastText: '#000',
          },
          secondary: {
            main: '#F472B6',
            light: '#F9A8D4',
            dark: '#EC4899',
            contrastText: '#000',
          },
          success: { main: '#34D399', light: '#6EE7B7', dark: '#10B981' },
          error: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444' },
          warning: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B' },
          info: { main: '#60A5FA', light: '#93C5FD', dark: '#3B82F6' },
          background: { default: '#0F172A', paper: '#1E293B' },
          text: { primary: '#F1F5F9', secondary: '#94A3B8' },
          divider: '#334155',
        }),
  },
  typography: {
    fontFamily: `'Inter','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto',sans-serif`,
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            mode === 'light'
              ? '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)'
              : '0 1px 3px 0 rgba(0,0,0,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});
