export interface EntityTimeline {
  name: string;
  count: number;
  averageSentiment: number;
}

export interface GlobalEntitiesTrends {
  timeline: Record<string, EntityTimeline[]>;
}


