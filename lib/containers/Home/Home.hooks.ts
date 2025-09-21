import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';

const useHome = () => {
  const { data: summary, isLoading, error } = useGetSummaryAPI();

  return { summary, isLoading, error };
};
export default useHome;
