export interface SimilarNews {
  id: string;
  link: string;
  source: string;
  summary: string;
  title: string;
  sentiment: number;
  similarScore: number;
  rankingScore: number;
  publish_date: string;
  sentiment_label:string;
}