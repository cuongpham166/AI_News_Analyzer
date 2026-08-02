export interface GlobalTimelineBucket {
  date: string;
  articleCount: number;
  averageSentiment: number;
  topTopics: Record<string, number>;
}

export interface GlobalTrendType {
  timeline: GlobalTimelineBucket[];
}