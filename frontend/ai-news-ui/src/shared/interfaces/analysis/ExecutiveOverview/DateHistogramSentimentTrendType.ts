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
  success: boolean;
  message: string;
  data: DateHistogramSentimentTrendType;
  timestamp: number;
}
