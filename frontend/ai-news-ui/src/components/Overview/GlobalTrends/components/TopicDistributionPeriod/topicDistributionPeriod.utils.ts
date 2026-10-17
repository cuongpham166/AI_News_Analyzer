import { NEWS_TOPICS } from '@/shared/constants/NewsTopics.ts';
import type {
  GlobalTimelineBucket,
  GlobalTrendType,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';

interface GlobalTrendChartData {
  percentages: number[][];
  counts: number[][];
}

export const getGlobalTrendsData = (
  data: GlobalTimelineBucket[],
): GlobalTrendChartData => {
  const timelines = data;
  if (!timelines || timelines.length === 0) {
    return {
      counts: [],
      percentages: [],
    };
  }

  const counts = NEWS_TOPICS.map(
    (topic) =>
      timelines && timelines.map((timeline) => timeline.topTopics[topic] ?? 0),
  );

  const percentages = NEWS_TOPICS.map(
    (_, topicIndex) =>
      timelines &&
      timelines.map((_, timelineIndex) => {
        const total = counts.reduce(
          (sum, topicData) => sum + topicData[timelineIndex],
          0,
        );

        return total === 0 ? 0 : counts[topicIndex][timelineIndex] / total;
      }),
  );

  return {
    counts,
    percentages,
  };
};

export const formatDate = (date: string): string => {
  const [year, month, day] = date.split('-');

  return `${day}.${month}.${year}`;
};