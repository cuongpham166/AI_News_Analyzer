interface GlobalTimelineBucket {
  date: string;
  articleCount: number;
  averageSentiment: number;
  topTopics: Record<string, number>;
}

export interface GlobalTrends {
  timeline: GlobalTimelineBucket[];
}


