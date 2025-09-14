import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';

const useStatistics = () => {
  // const {
  //   data: filteredSummary,
  //   isLoading,
  //   error,
  // } = useSummaryQuery({
  //   type: "expense",
  //   month: new Date().toISOString().slice(0, 7), // current month in YYYY-MM format
  //   group_by: "category",
  // });
  const { data: summary, isLoading, error } = useGetSummaryAPI();
  return { summary, isLoading, error };
};
export default useStatistics;
