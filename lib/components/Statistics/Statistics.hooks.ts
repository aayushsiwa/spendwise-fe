import { useEffect, useState } from 'react';

import { usePeriodContext } from '@/lib/context/Period/Period';
import { TRecord } from '@/types/Records';
import { SummaryMonth } from '@/types/Summary';

const useStatistics = (summary: SummaryMonth, records: TRecord[]) => {
  const { range } = usePeriodContext();

  const [data, setData] = useState<{ date: string; balance: number }[]>([]);

  useEffect(() => {
    if (!range?.from || !range?.to || !summary) {
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
    const startDate = new Date(range.from);
    const endDate = new Date(range.to);
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

  return { summary, data };
};

export default useStatistics;
