import { ReactNode, createContext, useContext } from 'react';

import usePeriodProvider, { PeriodRange } from './Period.hooks';

export type TPeriodContext = {
  period: string;
  range: PeriodRange;
  setPeriod: (period: string) => void;
  setRange: (range: PeriodRange) => void;
};

export const PeriodContext = createContext<TPeriodContext>(
  {} as TPeriodContext
);

export const PeriodProvider = ({ children }: { children: ReactNode }) => {
  const { period, setPeriod, range, setRange } = usePeriodProvider();

  return (
    <PeriodContext.Provider value={{ period, range, setPeriod, setRange }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriodContext = (): TPeriodContext => useContext(PeriodContext);
