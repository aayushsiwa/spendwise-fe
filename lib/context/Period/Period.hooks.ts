import dayjs from 'dayjs';
import { useState } from 'react';

import { TPeriodContext } from './Period';

export type PeriodRange = {
  startDate: string;
  endDate: string;
  key: string;
};

const usePeriodProvider = (): TPeriodContext => {
  const currentMonthName = dayjs().format('MMMM');

  const [period, setPeriod] = useState<string>(currentMonthName);
  const [range, setRange] = useState<PeriodRange>({
    startDate: '',
    endDate: '',
    key: 'selection',
  });

  return { period, setPeriod, range, setRange };
};

export default usePeriodProvider;
