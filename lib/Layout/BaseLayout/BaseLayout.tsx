import { CloudUpload, Dashboard as DashboardIcon } from '@mui/icons-material';
import { FC, PropsWithChildren } from 'react';

import Sidebar, { SidebarMenuItem } from '@/lib/components/Sidebar/Sidebar';
import { SummaryProvider } from '@/lib/context/Summary/Summary';

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  const menuItems: SidebarMenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/',
    },
    {
      text: 'Upload',
      icon: <CloudUpload />,
      href: '/upload/csv',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      href: '/categories',
    },
  ];

  return (
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
  );
};

export default BaseLayout;
