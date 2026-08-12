import type { GlobalTrendType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';

export interface TopicGrowthChartData {
  date: string;
  articleCount: number;
  topics: Record<string, number>;
}

export const getTopicGrowthData = (
  data: GlobalTrendType,
): TopicGrowthChartData[] => {
  return data.timeline.map((item) => ({
    date: item.date,
    articleCount: item.articleCount,
    topics: item.topTopics,
  }));
};