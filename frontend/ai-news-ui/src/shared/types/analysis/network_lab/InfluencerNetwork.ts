export interface InfluencerNetwork {
  personA: string;
  personB: string;
  sharedArticles: number;
  avgSentiment: number;
  volatility: number;
}

export interface Influencer {
  name: string;
  connections: number;
  sharedArticles: number;
  influenceScore: number;
}

/*
* Influence Score =
    connection count
  + shared articles weight
  + sentiment impact
* */