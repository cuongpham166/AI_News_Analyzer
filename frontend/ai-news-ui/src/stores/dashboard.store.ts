import { create } from 'zustand';
import type {
  DashboardInterval,
  Interval,
} from '@/shared/types/DashboardInterval.ts';

interface DashboardIntervalStore {
  interval: Interval;
  appliedInterval: Interval;

  updateInterval: (updates: Partial<Interval>) => void;
  applyInterval: () => void;
}

const defaultInterval: Interval = {
  intervalUnit: 'month',
  amount: 6,
};

export const useDashboardIntervalStore = create<DashboardIntervalStore>(
  (set) => ({
    interval: defaultInterval,

    appliedInterval: defaultInterval,

    updateInterval: (updates) =>
      set((state) => ({
        interval: {
          ...state.interval,
          ...updates,
        },
      })),

    applyInterval: () =>
      set((state) => ({
        appliedInterval: {
          ...state.interval,
        },
      })),
  }),
);