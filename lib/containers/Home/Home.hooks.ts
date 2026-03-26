import useRecords from '@/lib/components/Records/Records.hooks';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useSummaryContext } from '@/lib/context/Summary/Summary';
import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';
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
    isAdding,
    setIsAdding,
  } = useRecords();

  const { range } = usePeriodContext();

  const queryParams = {
    from: DateUtil.formattedDate(range.from),
    to: DateUtil.formattedDate(range.to),
  };

  const { data: summary, isLoading, isError } = useGetSummaryAPI(queryParams);

  return {
    summary,
    isLoading,
    isError,
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
      isAdding,
      setIsAdding,
    },
  };
};
export default useHome;
