import dayjs from 'dayjs';
import { useState } from 'react';

import { TPeriodContext } from './Period';

export type PeriodRange = {
  from?: string;
  to?: string;
  key: string;
};

const usePeriodProvider = (): TPeriodContext => {
  const currentMonthName = dayjs().format('MMMM');

  const d = dayjs().month(dayjs().month());

  const [period, setPeriod] = useState<string>(currentMonthName);
  const [range, setRange] = useState<PeriodRange>({
    from: d.startOf('month').format('YYYY-MM-DD'),
    to: d.endOf('month').format('YYYY-MM-DD'),
    key: 'selection',
  });

  return { period, setPeriod, range, setRange };
};

export default usePeriodProvider;
