import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';

import { useRefreshBalancesAPI } from '@/api/records/refreshBalances';

import { SidebarMenuItem } from './Sidebar';

export const useSidebar = (defaultOpen: boolean, largeView: boolean) => {
  const [open, setOpen] = useState(defaultOpen);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const router = useRouter();
  const currentPath = router.pathname;

  const refreshBalances = useRefreshBalancesAPI();
  const handleRefreshBalances = () => {
    refreshBalances.mutate(undefined, {
      onSuccess: () => {
        setSnackbar({ message: 'Balances recalculated', severity: 'success' });
      },
      onError: () => {
        setSnackbar({
          message: 'Failed to recalculate balances',
          severity: 'error',
        });
      },
    });
  };

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (item: SidebarMenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      // Handle download URLs by triggering browser navigation
      if (item.href.includes('download=true')) {
        window.location.assign(item.href);
      } else {
        router.push(item.href);
      }
    }
    if (!largeView) {
      setOpen(false);
    }
  };

  return {
    open,
    setOpen,
    snackbar,
    setSnackbar,
    refreshBalances,
    handleRefreshBalances,
    handleDrawer,
    handleMenuItemClick,
    currentPath,
  };
};
