export interface CountryRisk {
  country: string;
  countryCode: string;
  frequency: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  riskScore: number;
  coveragePercent: number;
}