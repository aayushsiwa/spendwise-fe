import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useColorMode } from '@/lib/context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
}
