export interface EntityTimeline {
  name: string;
  count: number;
  averageSentiment: number;
}

export interface GlobalEntitiesTrendsType {
  timeline: Record<string, EntityTimeline[]>;
}