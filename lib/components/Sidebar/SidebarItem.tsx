import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { SidebarMenuItem } from './Sidebar';

export function SidebarItemComponent({
  item,
  currentPath,
  open,
  handleMenuItemClick,
}: {
  item: SidebarMenuItem;
  currentPath: string;
  open: boolean;
  handleMenuItemClick: (item: SidebarMenuItem) => void;
}) {
  const theme = useTheme();

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={item.text} placement="right">
        <ListItemButton
          onClick={() => handleMenuItemClick(item)}
          selected={item.href ? currentPath === item.href : false}
          sx={[
            {
              minHeight: 48,
              px: 2.5,
              color: 'inherit',
              textDecoration: 'none',
            },
            currentPath === item.href && {
              backgroundColor: theme.palette.action.selected,
              fontWeight: 600,
            },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
          ]}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open ? { mr: 3 } : { mr: 'auto' },
            ]}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
