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

    // Helper to format dates consistently using local date parts
    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

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

    // Normalize dates to local midnight
    const startDate = new Date(range.from);
    startDate.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const endDate = new Date(
      Math.min(new Date(range.to).getTime(), now.getTime())
    );
    endDate.setHours(0, 0, 0, 0);

    const startStr = formatLocalDate(startDate);
    const endStr = formatLocalDate(endDate);

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
      const dateStr = formatLocalDate(d);
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
