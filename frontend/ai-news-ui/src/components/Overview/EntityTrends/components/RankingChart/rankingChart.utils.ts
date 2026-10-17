import type { GlobalEntitiesTrends } from '@/shared/types/analysis';

export interface EntityRankingItem {
  entity: string;
  type: string;
  mentions: number;
  sentiment: number;
  riskScore: number;
  positiveVolume: number;
  negativeVolume: number;
}

export interface RankingDataResult {
  chartData: Array<[string, number, number, number, number, number, string]>;
  rawItems: EntityRankingItem[];
}

export const getRankingChartData = (
  data?: GlobalEntitiesTrends,
  topLimit: number = 20,
): RankingDataResult => {
  if (!data?.timeline) {
    return { chartData: [], rawItems: [] };
  }

  const entityMap = new Map<
    string,
    {
      type: string;
      mentions: number;
      weightedSentimentSum: number;
      posVol: number;
      negVol: number;
    }
  >();

  Object.values(data.timeline).forEach((entities) => {
    entities.forEach((item) => {
      const existing = entityMap.get(item.name) || {
        type: item.type || 'ENTITY',
        mentions: 0,
        weightedSentimentSum: 0,
        posVol: 0,
        negVol: 0,
      };

      existing.mentions += item.count;
      existing.weightedSentimentSum += item.averageSentiment * item.count;
      existing.posVol += item.positiveVolume;
      existing.negVol += item.negativeVolume;

      entityMap.set(item.name, existing);
    });
  });

  const aggregated: EntityRankingItem[] = Array.from(entityMap.entries())
    .map(([entity, stats]) => {
      const mentions = stats.mentions;
      const sentiment =
        mentions > 0 ? stats.weightedSentimentSum / mentions : 0;
      const riskScore = mentions > 0 ? stats.negVol / mentions : 0;

      return {
        entity,
        type: stats.type,
        mentions,
        sentiment,
        riskScore,
        positiveVolume: stats.posVol,
        negativeVolume: stats.negVol,
      };
    })
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, topLimit);

  const chartData: RankingDataResult['chartData'] = aggregated.map((item) => [
    item.entity,
    item.mentions,
    item.sentiment,
    item.riskScore,
    item.positiveVolume,
    item.negativeVolume,
    item.type,
  ]);

  return { chartData, rawItems: aggregated };
};
