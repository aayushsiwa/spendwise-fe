import { useEffect, useState } from 'react';

import { useRecordsContext } from '@/lib/context/Records/Records';
import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';
import { TRecord } from '@/types/Records';

const useStatistics = () => {
  const { data: summary, isLoading, error } = useGetSummaryAPI();
  const { records } = useRecordsContext();

  const [data, setData] = useState<{ date: string; balance: number }[]>([]);
  // from records set data as date and balance
  useEffect(() => {
    if (!records || records.length === 0) {
      setData([]);
      return;
    }

    // Step 1: Group by date and keep only highest id per date
    const latestPerDateMap = new Map<string, TRecord>();
    for (const r of records) {
      const dateKey = r.date.split('T')[0];
      const existing = latestPerDateMap.get(dateKey);
      if (!existing || r.id > existing.id) {
        latestPerDateMap.set(dateKey, r);
      }
    }

    // Step 2: Convert to array and sort by date ascending
    const formatted = Array.from(latestPerDateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: r.date.split('T')[0],
        balance: r.balance,
      }));

    setData(formatted);
  }, [records]);

  return { summary, isLoading, error, data };
};

export default useStatistics;
