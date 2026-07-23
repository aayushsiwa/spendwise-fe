import { Download, Menu as MenuIcon, Refresh } from '@mui/icons-material';
import {
  Alert,
  Box,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import React, { ReactNode } from 'react';

import PeriodSelector from '@/lib/components/PeriodSelector/PeriodSelector';
import ThemeToggle from '@/lib/components/ThemeToggle/ThemeToggle';

import { useSidebar } from './Sidebar.hooks';
import { SidebarItemComponent } from './SidebarItem';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  display: 'flex',
  flexDirection: 'column',
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
        [theme.breakpoints.down('md')]: {
          marginLeft: 0,
          width: '100%',
        },
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
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
  showPeriodSelector?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  title = 'SpendWise',
  menuItems = [],
  defaultOpen = false,
  showAppBar = true,
  showPeriodSelector = true,
}) => {
  const theme = useTheme();
  const largeView = useMediaQuery(theme.breakpoints.up('md'));
  const {
    open,
    setOpen,
    snackbar,
    setSnackbar,
    currentPath,
    handleRefreshBalances,
    handleDrawer,
    handleMenuItemClick,
  } = useSidebar(defaultOpen, largeView);

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
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                direction: largeView ? 'ltr' : 'rtl',
                alignItems: 'center',
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
                      display: { md: open ? 'none' : 'block', xs: 'block' },
                    },
                  ]}
                >
                  {largeView && !open
                    ? title
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .toUpperCase()
                    : title.toUpperCase()}
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
            </Box>
            <Grid
              sx={{
                display: 'flex',
                gap: 1,
                mr: 0.5,
                alignItems: 'center',
              }}
            >
              {showPeriodSelector && <PeriodSelector />}
              <ThemeToggle />
            </Grid>
          </Grid>
        </AppBar>
      )}

      <Drawer
        variant={largeView ? 'permanent' : 'temporary'}
        open={open}
        onClose={() => setOpen(false)}
      >
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
            {menuItems.map((item) => (
              <SidebarItemComponent
                key={item.text}
                item={item}
                currentPath={currentPath}
                open={open}
                handleMenuItemClick={handleMenuItemClick}
              />
            ))}
          </List>
        )}

        <Box sx={{ mt: 'auto', mb: 2 }}>
          <Divider sx={{ mb: 1 }} />

          <SidebarItemComponent
            item={{
              text: 'Export CSV',
              icon: <Download />,
              href: '/api/export/csv?download=true',
            }}
            currentPath={currentPath}
            open={open}
            handleMenuItemClick={handleMenuItemClick}
          />

          <SidebarItemComponent
            item={{
              text: 'Recalculate Balances',
              icon: <Refresh />,
              onClick: handleRefreshBalances,
            }}
            currentPath={currentPath}
            open={open}
            handleMenuItemClick={handleMenuItemClick}
          />
        </Box>
      </Drawer>

      <Main open={open}>
        {showAppBar && <DrawerHeader />}
        {children}
      </Main>

      {snackbar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(null)}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Sidebar;
