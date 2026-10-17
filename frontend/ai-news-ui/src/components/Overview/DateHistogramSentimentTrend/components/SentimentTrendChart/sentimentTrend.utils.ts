import type {
  DateHistogramSentimentTrendType,
} from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';

export interface SentimentTrendData {
  timestamp: string;
  averageSentiment: number;
}

export const getSentimentTrendData = (
  data: DateHistogramSentimentTrendType,
): SentimentTrendData[] => {
  const filteredTimelines = data.timeline.filter(
    (timeline) => timeline.articleCount > 0,
  );
  return filteredTimelines.map((filteredTimeline) => ({
    timestamp: filteredTimeline.timestamp,
    averageSentiment: filteredTimeline.averageSentiment,
  }));
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '.');
};