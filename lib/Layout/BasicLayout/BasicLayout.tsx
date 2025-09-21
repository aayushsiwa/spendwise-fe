import {
  Dashboard as DashboardIcon,
  Drafts as DraftsIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import Sidebar, { SidebarMenuItem } from '@/lib/components/Sidebar/Sidebar';
import ThemeToggle from '@/lib/components/ThemeToggle/ThemeToggle';
import { PeriodProvider } from '@/lib/context/Period/Period';

const BasicLayout: FC<PropsWithChildren> = ({ children }) => {
  const menuItems: SidebarMenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      onClick: () => console.log('Dashboard clicked'),
      href: '/',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      onClick: () => console.log('Users clicked'),
      href: '/users',
    },
    {
      text: 'Inbox',
      icon: <InboxIcon />,
      onClick: () => console.log('Inbox clicked'),
      href: '/inbox',
    },
    {
      text: 'Send Email',
      icon: <SendIcon />,
      onClick: () => console.log('Send Email clicked'),
      href: '/send',
    },
    {
      text: 'Drafts',
      icon: <DraftsIcon />,
      onClick: () => console.log('Drafts clicked'),
      href: '/drafts',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      onClick: () => console.log('Settings clicked'),
      href: '/settings',
    },
  ];

  return (
    <PeriodProvider>
      <Sidebar
        title="Spend Wise"
        menuItems={menuItems}
        defaultOpen={false}
        showAppBar={true}
      >
        {children}
      </Sidebar>
    </PeriodProvider>
  );
};

export default BasicLayout;
