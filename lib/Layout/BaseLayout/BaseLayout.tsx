import {
  Category as CategoryIcon,
  CloudUpload,
  Dashboard as DashboardIcon,
  Receipt,
} from '@mui/icons-material';
import { FC, PropsWithChildren, useState } from 'react';

import { useCreateRecordAPI } from '@/api/records/createRecord';
import RecordDetailDialog from '@/lib/components/Records/RecordDetailDialog';
import Sidebar, { SidebarMenuItem } from '@/lib/components/Sidebar/Sidebar';
import { useAppSnackbar } from '@/lib/context/Snackbar/Snackbar';
import { SummaryProvider } from '@/lib/context/Summary/Summary';
import { useCreateRecord } from '@/lib/hooks/useRecords';
import type { Record } from '@/types/Records';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  getRecordValidationMessage,
  hasRecordValidationErrors,
  normalizeRecord,
  validateRecord,
} from '@/validations/Record';

export type BaseLayoutProps = {
  showPeriodSelector?: boolean;
};

const BaseLayout: FC<PropsWithChildren<BaseLayoutProps>> = ({
  children,
  showPeriodSelector,
}) => {
  const { create } = useCreateRecord();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  const handleCreateRecord = async (recordData: Record): Promise<void> => {
    const { ID, ...data } = recordData;
    await create(data);
    setCreateDialogOpen(false);
  };

  return (
    <SummaryProvider>
      <Sidebar
        title="Spend Wise"
        menuItems={menuItems}
        defaultOpen={false}
        showAppBar={true}
        showPeriodSelector={showPeriodSelector}
        globalFab={{
          onClick: () => setCreateDialogOpen(true),
          label: 'Add Record',
        }}
      >
        {children}
      </Sidebar>

      <RecordDetailDialog
        record={null}
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateRecord}
      />
    </SummaryProvider>
  );
};

export default BaseLayout;
