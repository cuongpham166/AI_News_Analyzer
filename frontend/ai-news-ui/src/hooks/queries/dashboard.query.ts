import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getMacroPulseDetailDashboard,
  getMacroPulseOverviewDashboard,
  getMediaBiasDetailDashboard,
  getNetworkLabDetailDashboard,
  getRiskMapDetailDashboard,
} from '@/api/dashboard.api.ts';

import { useDashboardIntervalStore } from '@/stores/dashboard.store.ts';

export const useMacroPulseOverviewDashboard = () => {
  return useQuery({
    queryKey: ['macroPulseDashboard'],
    queryFn: () => getMacroPulseOverviewDashboard(),
  });
};

export const useMacroPulseDetailDashboard = () => {
  const interval = useDashboardIntervalStore((state) => state.appliedInterval);

  return useQuery({
    queryKey: [
      'macroPulseDetailDashboard',
      interval.intervalUnit,
      interval.amount,
    ],

    queryFn: () =>
      getMacroPulseDetailDashboard({
        intervalUnit: interval.intervalUnit,
        amount: interval.amount,
        calendarInterval: 'month',
      }),
  });
};

export const useRiskMapDetailDashboard = () => {
  const interval = useDashboardIntervalStore((state) => state.appliedInterval);
  return useQuery({
    queryKey: [
      'riskMapDetailDashboard',
      interval.intervalUnit,
      interval.amount,
    ],

    queryFn: () =>
      getRiskMapDetailDashboard({
        intervalUnit: interval.intervalUnit,
        amount: interval.amount,
      }),
  });
};



export const useMediaBiasDetailDashboard = () => {
  const interval = useDashboardIntervalStore((state) => state.appliedInterval);
  return useQuery({
    queryKey: [
      'mediaBiasDetailDashboard',
      interval.intervalUnit,
      interval.amount,
    ],

    queryFn: () =>
      getMediaBiasDetailDashboard({
        intervalUnit: interval.intervalUnit,
        amount: interval.amount,
      }),
  });
};


export const useNetworkLabDetailDashboard = () => {
  const interval = useDashboardIntervalStore((state) => state.appliedInterval);
  return useQuery({
    queryKey: [
      'networkLabDetailDashboard',
      interval.intervalUnit,
      interval.amount,
    ],

    queryFn: () =>
      getNetworkLabDetailDashboard({
        intervalUnit: interval.intervalUnit,
        amount: interval.amount,
      }),
  });
};
