interface Publisher {
  publisher: string;
  articleCount: number;
}

export interface EchoChamber {
  contentHash: string;
  sampleTitle: string;
  totalDuplications: number;
  publishers: Publisher[];
}