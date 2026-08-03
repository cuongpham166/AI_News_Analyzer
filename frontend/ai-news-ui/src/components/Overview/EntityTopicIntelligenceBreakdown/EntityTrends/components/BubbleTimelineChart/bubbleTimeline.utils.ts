import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';

interface BubbleTimelineData {
  date: string;
  entity: string;
  count: number;
  sentiment: number;
}

export const getBubbleTimelineData = (
  data: GlobalEntitiesTrendsType,
): BubbleTimelineData[] => {
  return Object.entries(data.timeline).flatMap(([date, entities]) =>
    entities.map((item) => ({
      date,
      entity: item.name,
      count: item.count,
      sentiment: item.averageSentiment,
    })),
  );
};