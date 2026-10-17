export interface EntityTimeline {
  name: string;
  type: string;
  count: number;
  averageSentiment: number;
  positiveVolume: number;
  negativeVolume: number;
  riskScore: number;
}

export interface GlobalEntitiesTrends {
  timeline: Record<string, EntityTimeline[]>;
}
