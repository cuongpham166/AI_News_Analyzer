import { createContext } from 'react';
import type { GlobalInterval } from '../interfaces/intervals/GlobalInterval.ts';

type GlobalIntervalContext = {
  globalInterval: GlobalInterval;
  setGlobalInterval: (updatedInterval: GlobalInterval) => void;
};

export const GlobalIntervalContext = createContext<GlobalIntervalContext | undefined>(
  undefined,
);
