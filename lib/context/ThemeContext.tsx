import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getDesignTokens } from '@/theme/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ColorModeContextProps {
  mode: ThemeMode; // selected mode
  setMode: (mode: ThemeMode) => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  mode: 'system',
  setMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  // Load preference (client-only)
  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeMode | null;
    setMode(stored ?? 'system');
    setMounted(true);
  }, []);

  // Resolve actual theme used by MUI
  const resolvedMode: 'light' | 'dark' =
    mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode;

  const theme = useMemo(
    () => createTheme(getDesignTokens(resolvedMode)),
    [resolvedMode]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode: (newMode: ThemeMode) => {
        localStorage.setItem('theme', newMode);
        setMode(newMode);
      },
    }),
    [mode]
  );

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
