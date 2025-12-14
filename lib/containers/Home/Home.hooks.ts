import useRecords from '@/lib/components/Records/Records.hooks';
import { useSummaryContext } from '@/lib/context/Summary/Summary';

const useHome = () => {
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

  const { summary, isLoading, isError } = useSummaryContext();

  console.log('Summary Data:', summary);

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
