import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  createTheme,
  useColorScheme,
} from '@mui/material/styles';
import { createContext, useContext, useMemo } from 'react';

import { themeOptions } from '@/theme/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ColorModeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  mode: 'system',
  setMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

const theme = createTheme(themeOptions);

function ModeProvider({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useColorScheme();

  const value = useMemo(
    () => ({
      mode: (mode ?? 'system') as ThemeMode,
      setMode: (newMode: ThemeMode) => {
        setMode(newMode === 'system' ? 'system' : newMode);
      },
    }),
    [mode, setMode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme} defaultMode="system" modeStorageKey="theme">
      <CssBaseline />
      <ModeProvider>{children}</ModeProvider>
    </ThemeProvider>
  );
};
