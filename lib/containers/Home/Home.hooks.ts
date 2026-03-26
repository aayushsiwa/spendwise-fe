import useRecords from '@/lib/components/Records/Records.hooks';
import { usePeriodContext } from '@/lib/context/Period/Period';
import { useGetRecordsAPI } from '@/pages/api/records/getRecords';
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

  const {
    data,
    isError: isGetAllRecordsError,
    isLoading: isGetAllRecordsLoading,
  } = useGetRecordsAPI({
    ...queryParams,
  });
  const allRecords = data?.data.records;

  const { data: summary, isLoading, isError } = useGetSummaryAPI(queryParams);

  return {
    summary,
    allRecords,
    isLoading: isGetAllRecordsLoading || isLoading,
    isError: isGetAllRecordsError || isError,
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
