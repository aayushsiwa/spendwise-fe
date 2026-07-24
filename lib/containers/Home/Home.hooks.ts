import dayjs from 'dayjs';

import { useGetBudgetProgressAPI } from '@/api/budgets/getBudgetProgress';
import { useGetSummaryAPI } from '@/api/summary/getSummary';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useRecords } from '@/lib/hooks/useRecords';
import { DateUtil } from '@/utils/DateUtils';

const useHome = () => {
  const {
    localRows,
    setLocalRows,
    records,
    isLoading: isGetRecordsLoading,
    pagination,
    handlePaginationModelChange,
    getTypeDetails,
    processRowUpdate,
    handleDeleteRecord,
    isGetRecordsError,
    error,
  } = useRecords({ usePeriodContext: true });

  const { range } = usePeriodContext();

  const queryParams = {
    from: DateUtil.formattedDate(range.from),
    to: DateUtil.formattedDate(range.to),
  };

  const from = dayjs(range.from);
  const { data: budgetProgress } = useGetBudgetProgressAPI({
    month: from.month() + 1,
    year: from.year(),
  });

  const { data: summary, isLoading, isError } = useGetSummaryAPI(queryParams);

  return {
    summary,
    records,
    isLoading: isLoading,
    isError: isError,
    recordProps: {
      localRows,
      setLocalRows,
      records,
      isGetRecordsLoading,
      pagination,
      handlePaginationModelChange,
      getTypeDetails,
      processRowUpdate,
      handleDeleteRecord,
      isGetRecordsError,
      error,
    },
    budgetProgress,
  };
};
export default useHome;
