export interface TimelineBucket {
  timestamp: string;
  articleCount: number;
  averageSentiment: number;
  sentimentBreakdown: Record<string, number>;
}

export interface DateHistogramSentimentTrend {
  timeline: TimelineBucket[];
}

