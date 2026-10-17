export interface EventTrackerMetrics {
  eventsTracked: number;
  totalMentions: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  avgVolatility: number;
  highRiskEvents: number;
}