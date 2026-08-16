import { useEffect, useState } from 'react';

import { usePeriodContext } from '@/lib/context/Period/Period';
import { TRecord } from '@/types/Records';
import { SummaryMonth } from '@/types/Summary';

const useStatistics = (summary: SummaryMonth, records: TRecord[]) => {
  const { range } = usePeriodContext();

  const [data, setData] = useState<
    {
      date: string;
      balance: number | null;
      income: number;
      expense: number;
      transfer: number;
    }[]
  >([]);

  useEffect(() => {
    if (!range?.from || !range?.to || !summary) {
      setData([]);
      return;
    }

    const latestPerDateMap = new Map<string, TRecord>();
    const dailyTotals = new Map<
      string,
      { income: number; expense: number; transfer: number }
    >();

    for (const r of records || []) {
      const dateKey = r.date.split('T')[0];

      const existing = latestPerDateMap.get(dateKey);
      if (!existing || r.createdAt > existing.createdAt) {
        latestPerDateMap.set(dateKey, r);
      }

      const totals = dailyTotals.get(dateKey) ?? {
        income: 0,
        expense: 0,
        transfer: 0,
      };
      if (r.type === 'income') totals.income += r.amount;
      else if (r.type === 'expense') totals.expense += r.amount;
      else if (r.type === 'transfer') totals.transfer += r.amount;
      dailyTotals.set(dateKey, totals);
    }

    const startDate = new Date(range.from);
    const endDate = new Date(
      Math.min(new Date(range.to).getTime(), new Date().getTime())
    );

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const filled: {
      date: string;
      balance: number | null;
      income: number;
      expense: number;
      transfer: number;
    }[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      let balance: number | null = null;

      if (dateStr === startStr) {
        balance = summary.opening;
      } else if (dateStr === endStr) {
        balance = summary.closing;
      } else {
        balance = latestPerDateMap.get(dateStr)?.balance ?? null;
      }

      const totals = dailyTotals.get(dateStr) ?? {
        income: 0,
        expense: 0,
        transfer: 0,
      };

      filled.push({ date: dateStr, balance, ...totals });
    }

    setData(filled);
  }, [records, range, summary]);

  return { summary, data };
};

export default useStatistics;
