import type { GlobalTimelineBucket, GlobalTrendType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';

export interface TopicMomentumPoint {
  topic: string;
  currentValue: number;
  previousValue: number;
  growthRate: number | null;
  share: number;
  isNew: boolean;
}

export const getTopicMomentumData = (
  data: GlobalTimelineBucket[],
): TopicMomentumPoint[] => {
  if (data.length < 2) {
    return [];
  }

  const current = data[data.length - 1];
  const previous = data[data.length - 2];

  const currentTopics = current.topTopics;
  const previousTopics = previous.topTopics;

  const topics = new Set([
    ...Object.keys(currentTopics),
    ...Object.keys(previousTopics),
  ]);

  return [...topics].map((topic) => {
    const currentValue = currentTopics[topic] ?? 0;
    const previousValue = previousTopics[topic] ?? 0;
    const isNew = previousValue === 0 && currentValue > 0;
    const growthRate =
      previousValue > 0
        ? ((currentValue - previousValue) / previousValue) * 100
        : null;

    const share =
      current.articleCount > 0
        ? (currentValue / current.articleCount) * 100
        : 0;

    return {
      topic,
      currentValue,
      previousValue,
      growthRate,
      share,
      isNew,
    };
  });
};