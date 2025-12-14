import { Brightness4, Brightness6, Brightness7 } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

import { useColorMode } from '@/lib/context/ThemeContext';

export default function ThemeMenu() {
  const { mode, setMode } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        {mode === 'dark' ? (
          <Brightness4 />
        ) : mode === 'light' ? (
          <Brightness7 />
        ) : (
          <Brightness6 />
        )}
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          selected={mode === 'system'}
          onClick={() => {
            setMode('system');
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Brightness6 fontSize="small" />
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>

        <MenuItem
          selected={mode === 'light'}
          onClick={() => {
            setMode('light');
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>

        <MenuItem
          selected={mode === 'dark'}
          onClick={() => {
            setMode('dark');
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
