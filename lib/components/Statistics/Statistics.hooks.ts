import { useEffect, useState } from 'react';

import { usePeriodContext } from '@/lib/context/Period/Period';
import { useRecordsContext } from '@/lib/context/Records/Records';
import { useGetSummaryAPI } from '@/pages/api/summary/getSummary';
import { TRecord } from '@/types/Records';

const useStatistics = () => {
  const { range } = usePeriodContext();
  const {
    data: summary,
    isLoading,
    error,
  } = useGetSummaryAPI({
    from: range.startDate,
    to: range.endDate,
  });
  const { records, setQueryParams } = useRecordsContext();

  useEffect(() => {
    if (range?.startDate && range?.endDate) {
      setQueryParams({
        from: range.startDate,
        to: range.endDate,
      });
    }
  }, [range, setQueryParams]);

  const [data, setData] = useState<{ date: string; balance: number }[]>([]);

  useEffect(() => {
    if (!range?.startDate || !range?.endDate || !summary) {
      setData([]);
      return;
    }

    // Step 1: Map latest record per date
    const latestPerDateMap = new Map<string, TRecord>();
    for (const r of records || []) {
      const dateKey = r.date.split('T')[0];
      const existing = latestPerDateMap.get(dateKey);
      if (!existing || r.id > existing.id) {
        latestPerDateMap.set(dateKey, r);
      }
    }

    // Step 2: Build full date range
    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);
    const filled: { date: string; balance: number }[] = [];

    let prevBalance: number | null = summary.opening ?? null; // 👈 start from opening

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      const record = latestPerDateMap.get(dateStr);

      if (record) {
        filled.push({ date: dateStr, balance: record.balance });
        prevBalance = record.balance;
      } else {
        // carry forward last known balance
        filled.push({ date: dateStr, balance: prevBalance ?? 0 });
      }
    }

    setData(filled);
  }, [records, range, summary]);

  return { summary, isLoading, error, data };
};

export default useStatistics;
