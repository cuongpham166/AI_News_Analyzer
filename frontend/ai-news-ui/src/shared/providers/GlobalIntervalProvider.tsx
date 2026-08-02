import { useState, type ReactNode } from 'react';
import { GlobalIntervalContext } from '../contexts/GlobalIntervalContext.ts';
import type { GlobalInterval } from '../interfaces/intervals/GlobalInterval.ts';

type Props = {
  children: ReactNode;
};

export const GlobalIntervalProvider = ({ children }: Props) => {
  const [globalInterval, setGlobalInterval] = useState<GlobalInterval>({
    intervalUnit: 'month',
    amount: 6,
  });

  return (
    <GlobalIntervalContext.Provider
      value={{
        globalInterval,
        setGlobalInterval,
      }}
    >
      {children}
    </GlobalIntervalContext.Provider>
  );
};
