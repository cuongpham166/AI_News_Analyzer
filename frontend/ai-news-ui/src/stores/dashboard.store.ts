import { create } from 'zustand';
import type {
  DashboardInterval,
  Interval,
} from '@/shared/types/DashboardInterval.ts';

interface DashboardIntervalStore {
  interval: Interval;
  updateInterval: (updates: Partial<Interval>) => void;
}

const defaultInterval: Interval = {
  intervalUnit: 'month',
  amount: 6,
};

export const useDashboardIntervalStore = create<DashboardIntervalStore>((set) => ({
  interval: defaultInterval,
  updateInterval: (updates) =>
    set((state) => ({
      interval: {
        ...state.interval,
        ...updates,
      },
    })),
}));