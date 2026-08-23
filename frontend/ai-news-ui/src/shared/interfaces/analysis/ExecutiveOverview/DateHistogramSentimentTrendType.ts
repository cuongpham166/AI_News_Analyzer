import type { GlobalTrends } from '@/shared/types/analysis';

export interface TimelineBucket {
  timestamp: string;
  articleCount: number;
  averageSentiment: number;
  sentimentBreakdown: Record<string, number>;
}

export interface DateHistogramSentimentTrendType {
  timeline: TimelineBucket[];
}

export interface DateHistogramSentimentResponse {
  sentimentVolumeTimeline: DateHistogramSentimentTrendType;
  globalTrend: GlobalTrends;
}
