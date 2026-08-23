interface GeopoliticalTopic {
  name: string;
  articleCount: number;
}

export interface GeopoliticalHotspot {
  location: string;
  topics: GeopoliticalTopic[];
  articleCount: number;
  avgSentiment: number;
  aliases: string[];
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
}