import {
  Category as CategoryIcon,
  CloudUpload,
  Dashboard as DashboardIcon,
  Receipt,
} from '@mui/icons-material';
import { FC, PropsWithChildren } from 'react';

import Sidebar, { SidebarMenuItem } from '@/lib/components/Sidebar/Sidebar';
import { SummaryProvider } from '@/lib/context/Summary/Summary';

export type BaseLayoutProps = {
  showPeriodSelector?: boolean;
};

const BaseLayout: FC<PropsWithChildren<BaseLayoutProps>> = ({
  children,
  showPeriodSelector,
}) => {
  const menuItems: SidebarMenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/',
    },
    {
      text: 'Transactions',
      icon: <Receipt />,
      href: '/transactions',
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
        showPeriodSelector={showPeriodSelector}
      >
        {children}
      </Sidebar>
    </SummaryProvider>
  );
};

export default BaseLayout;
