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
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Client-only logic
  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeMode | null;
    const selectedMode = stored ?? 'system';
    setMode(selectedMode);

    if (selectedMode === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedMode(selectedMode);
    }

    setMounted(true);
  }, []);

  // Update resolved mode when user changes theme
  useEffect(() => {
    if (!mounted) return;

    if (mode === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedMode(mode);
    }
  }, [mode, mounted]);

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
