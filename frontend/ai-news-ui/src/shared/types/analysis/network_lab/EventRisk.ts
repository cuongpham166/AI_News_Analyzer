export interface EventRisk {
  event: string;
  frequency: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  volatility: number;
  riskScore: number;
  polarizationScore: number;
}