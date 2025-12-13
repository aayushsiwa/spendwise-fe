import { useEffect } from 'react';

import useRecords from '@/lib/components/Records/Records.hooks';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useSummaryContext } from '@/lib/context/Summary/Summary';

const useHome = () => {
  const { range } = usePeriodContext();
  const { summary, isLoading, isError, setQueryParams } = useSummaryContext();
  const {
    localRows,
    setLocalRows,
    records,
    isLoading: isGetRecordsLoading,
    paginationResponse,
    handlePaginationModelChange,
    getTypeDetails,
    processRowUpdate,
    handleDeleteRecord,
    isGetRecordsError,
    error,
    recordsQueryParams,
    setRecordsQueryParams,
    isAdding,
    setIsAdding,
  } = useRecords();

  useEffect(() => {
    if (range?.startDate && range?.endDate) {
      setQueryParams({
        from: range.startDate,
        to: range.endDate,
      });
    }
  }, [range, setQueryParams]);

  return {
    summary,
    isLoading,
    isError,
    recordProps: {
      localRows,
      setLocalRows,
      records,
      isGetRecordsLoading,
      paginationResponse,
      handlePaginationModelChange,
      getTypeDetails,
      processRowUpdate,
      handleDeleteRecord,
      isGetRecordsError,
      error,
      recordsQueryParams,
      setRecordsQueryParams,
      isAdding,
      setIsAdding,
    },
  };
};
export default useHome;
