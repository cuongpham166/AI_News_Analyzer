interface NewsEntity {
  value: string;
  entity_type: string;
}

export interface SearchedNewsResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  link: string;
  publish_date: number;
  sentiment: number;
  sentiment_label: string;
  topic: string;
  entities: NewsEntity[];
  highlights: Map<string, string[]>;
}
