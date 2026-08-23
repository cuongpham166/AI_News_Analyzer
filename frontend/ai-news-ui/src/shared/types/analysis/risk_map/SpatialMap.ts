export interface SpatialMap {
  location: string;
  aliases: string[];
  latitude: number;
  longitude: number;
  count: number;
  avgSentiment: number;
  country: string;
  countryCode: string;
}