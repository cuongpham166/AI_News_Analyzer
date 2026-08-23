import type {
  DateHistogramSentimentResponse,
  DateHistogramSentimentTrendType,
} from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import type {
  DeepVelocity,
  GlobalEntitiesTrends,
  GlobalTrends,
  SignificantTerms,
  TopicRadar,
} from '@/shared/types/analysis';

export interface SourceDistributionOverview{
  id:number;
  name: string;
  newsCount: number;
}

export interface EntityTypeDistributionOverview {
  id: number;
  name: string;
  entityCount: number;
}

export interface TopicDistributionOverview {
  id: number;
  name: string;
  newsCount: number;
}

export interface MacroPulseOverview {
  totalNews: number;
  totalInference: number;
  sourceNewsCounts: SourceDistributionOverview[];
  entityTypeCounts: EntityTypeDistributionOverview[];
  topicNewsCounts: TopicDistributionOverview[];
  totalArticles: number;
  uniqueStories: number;
  amplificationRatio: number;
}


export interface MacroPulseDetail {
  sentimentVolumeTimeline: DateHistogramSentimentTrendType;
  globalTrend: GlobalTrends;
  globalEntityTrend: GlobalEntitiesTrends;
  entityVelocity: DeepVelocity[];
  significantTerms: SignificantTerms[];
  topicRadar: TopicRadar;
}