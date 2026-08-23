import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getGlobalEntityTrend,
  getGlobalTrend, getImpactArticles,
  getSentimentVolumeTimeline,
} from '@/api/analysis.api.ts';

import { useDashboardIntervalStore } from '@/stores/dashboard.store.ts';
import type { CalendarInterval } from '@/shared/types/DashboardInterval.ts';



export const useSentimentVolumeTimeline = (calendarInterval: CalendarInterval) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );
  return useQuery({
    queryKey: [
      'sentimentDistribution',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      calendarInterval,
    ],

    queryFn: () =>
      getSentimentVolumeTimeline({
        intervalUnit: appliedInterval.intervalUnit,
        amount: appliedInterval.amount,
        calendarInterval,
      }),
  });
};

export const useGlobalTrend = (calendarInterval: CalendarInterval) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );
  return useQuery({
    queryKey: [
      'globalTrend',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      calendarInterval,
    ],

    queryFn: () =>
      getGlobalTrend({
        intervalUnit: appliedInterval.intervalUnit,
        amount: appliedInterval.amount,
        calendarInterval,
      }),
  });
};

export const useGlobalEntityTrend = (calendarInterval: CalendarInterval) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );

  return useQuery({
    queryKey: [
      'globalEntityTrend',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      calendarInterval,
    ],

    queryFn: () =>
      getGlobalEntityTrend({
        intervalUnit: appliedInterval.intervalUnit,
        amount: appliedInterval.amount,
        calendarInterval,
      }),
  });
};

type ImpactArticle = {
  isPositive: boolean;
  topN:number;
}
export const useImpactArticles = (impactArticle: ImpactArticle) => {
  const {isPositive, topN} = impactArticle;
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );

  return useQuery({
    queryKey: [
      'impactArticles',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      isPositive,
      topN,
    ],

    queryFn: () =>
      getImpactArticles({
        intervalUnit: appliedInterval.intervalUnit,
        amount: appliedInterval.amount,
        isPositive,
        topN,
      }),
  });
};