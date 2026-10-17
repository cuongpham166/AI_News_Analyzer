export interface EventTracker {
  event: string;
  location: string;
  aliases: string[];
  frequency: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  volatility: number;
  riskScore: number;
  countryCode: string;
  country: string;
  latitude: number;
  longitude: number;
}