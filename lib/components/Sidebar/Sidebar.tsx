import { Menu as MenuIcon } from '@mui/icons-material';
import {
  Box,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Typography,
} from '@mui/material';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';

import PeriodSelector from '@/lib/components/PeriodSelector/PeriodSelector';
import ThemeToggle from '@/lib/components/ThemeToggle/ThemeToggle';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export interface SidebarMenuItem {
  text: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface SidebarProps {
  children: ReactNode;
  title?: string;
  menuItems?: SidebarMenuItem[];
  defaultOpen?: boolean;
  showAppBar?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  title = 'Application',
  menuItems = [],
  defaultOpen = false,
  showAppBar = true,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const router = useRouter();
  const currentPath = router.pathname;

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (item: SidebarMenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {showAppBar && (
        <AppBar position="fixed" open={open}>
          <Grid
            container
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
            }}
          >
            <Grid size="auto">
              <Typography
                variant="h6"
                component="div"
                sx={[
                  {
                    fontWeight: 800,
                    textAlign: 'left',
                    px: 2,
                    letterSpacing: 0.5,
                  },
                  open && { display: 'none' },
                ]}
              >
                {open
                  ? title.toUpperCase()
                  : title
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()}
              </Typography>
            </Grid>

            <Grid size="grow">
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={handleDrawer}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            </Grid>

            <Grid
              sx={{
                display: 'flex',
                gap: 4,
              }}
            >
              <PeriodSelector />
              <ThemeToggle />
            </Grid>
          </Grid>
        </AppBar>
      )}

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: 'center', mr: 2, fontWeight: 800 }}
          >
            {title.toUpperCase()}
          </Typography>
        </DrawerHeader>

        <Divider />

        {menuItems.length > 0 && (
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={`${item.text}-${index}`}
                disablePadding
                sx={{ display: 'block' }}
              >
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
                    open
                      ? { justifyContent: 'initial' }
                      : { justifyContent: 'center' },
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
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>

      <Main open={open}>
        {showAppBar && <DrawerHeader />}
        {children}
      </Main>
    </Box>
  );
};

export default Sidebar;
