export interface SpatialMap {
  location: string;
  aliases: string[];
  latitude: number;
  longitude: number;
  frequency: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  riskScore: number;
  country: string;
  countryCode: string;
}