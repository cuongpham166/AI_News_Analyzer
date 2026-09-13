export interface EntityPolarizationSentiment {
  entity: string;
  entityGroup: string;
  totalArticles: number;
  positiveCount: number;
  negativeCount: number;
  avgSentiment: number;
  polarizationScore: number;
}
