export interface EventTracker {
  event: string;
  location: string;
  strength: number;
  avgSentiment: number;
  volatility: number;
  countryCode: string;
  country: string;
  latitude: number;
  longitude: number;
  aliases: string[];
}