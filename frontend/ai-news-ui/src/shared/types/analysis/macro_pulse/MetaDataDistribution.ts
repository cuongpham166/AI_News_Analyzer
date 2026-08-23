
interface SourceDistribution {
  id: number;
  name: string;
  newsCount: number;
}

interface EntityTypeDistribution {
  id: number;
  name: string;
  entityCount:number;
}

interface TopicDistribution {
  id: number;
  name: string;
  newsCount: number;
}

export interface MetaDataDistribution {
  totalNews: number;
  totalInference: number;
  sourceNewsCounts: SourceDistribution[];
  entityTypeCounts: EntityTypeDistribution[];
  topicNewsCounts: TopicDistribution[];
}