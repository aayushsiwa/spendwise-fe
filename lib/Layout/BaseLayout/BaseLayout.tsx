import {
  Dashboard as DashboardIcon,
  Drafts as DraftsIcon,
  Inbox as InboxIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { FC, PropsWithChildren } from 'react';

import Sidebar, { SidebarMenuItem } from '@/lib/components/Sidebar/Sidebar';
import { PeriodProvider } from '@/lib/context/Period/Period';
import { SummaryProvider } from '@/lib/context/Summary/Summary';

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
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
      <SummaryProvider>
        <Sidebar
          title="Spend Wise"
          menuItems={menuItems}
          defaultOpen={false}
          showAppBar={true}
        >
          {children}
        </Sidebar>
      </SummaryProvider>
    </PeriodProvider>
  );
};

export default BaseLayout;
