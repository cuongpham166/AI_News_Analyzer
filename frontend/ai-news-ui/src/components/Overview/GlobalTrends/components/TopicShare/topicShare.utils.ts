import type { GlobalTrendType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';

export interface TopicShareChartData {
  date: string;
  topics: Record<string, number>;
}

export const getTopicShareData = (
  data: GlobalTrendType,
): TopicShareChartData[] => {
  return data.timeline.map((item) => {
    const total = Object.values(item.topTopics).reduce(
      (sum, count) => sum + count,
      0,
    );

    const topics = Object.fromEntries(
      Object.entries(item.topTopics).map(([topic, count]) => [
        topic,
        total > 0 ? (count / total) * 100 : 0,
      ]),
    );

    return {
      date: item.date,
      topics,
    };
  });
};