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
  const { showSnackbar } = useAppSnackbar();
  const createRecord = useCreateRecordAPI();
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
    const normalizedRecord = normalizeRecord(data);
    const validationErrors = validateRecord(normalizedRecord);
    if (hasRecordValidationErrors(validationErrors)) {
      const message = getRecordValidationMessage(validationErrors);
      showSnackbar(message, 'error');
      throw new Error(message);
    }
    try {
      await createRecord.mutateAsync({ record: normalizedRecord });
      setCreateDialogOpen(false);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create record');
      showSnackbar(message, 'error');
      throw error;
    }
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
