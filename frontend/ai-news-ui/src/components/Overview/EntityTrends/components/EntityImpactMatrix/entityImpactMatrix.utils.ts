import type { GlobalEntitiesTrendsType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';

interface EntityImpactData {
  entity: string;
  mentions: number;
  sentiment: number;
}

export interface EntityImpactItem {
  entity: string;
  type: string;
  mentions: number;
  sentiment: number;
  riskScore: number;
  positiveVolume: number;
  negativeVolume: number;
}

export interface EntityImpactDataResult {
  chartData: Array<[number, number, string, number, number, number, string]>;
  impactItems: EntityImpactItem[];
}

export const getMedian = (values: number[]): number => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const getEntityImpactData = (
  data?: GlobalEntitiesTrends,
  topLimit: number = 30,
): EntityImpactDataResult => {
  if (!data?.timeline) {
    return { chartData: [], impactItems: [] };
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
    entities.forEach((entity) => {
      const existing = entityMap.get(entity.name) || {
        type: entity.type || 'ENTITY',
        mentions: 0,
        weightedSentimentSum: 0,
        posVol: 0,
        negVol: 0,
      };

      existing.mentions += entity.count;
      existing.weightedSentimentSum += entity.count * entity.averageSentiment;
      existing.posVol += entity.positiveVolume;
      existing.negVol += entity.negativeVolume;

      entityMap.set(entity.name, existing);
    });
  });

  const impactItems: EntityImpactItem[] = Array.from(entityMap.entries())
    .map(([entity, value]) => {
      const mentions = value.mentions;
      const sentiment =
        mentions > 0 ? value.weightedSentimentSum / mentions : 0;
      const riskScore = mentions > 0 ? value.negVol / mentions : 0;

      return {
        entity,
        type: value.type,
        mentions,
        sentiment,
        riskScore,
        positiveVolume: value.posVol,
        negativeVolume: value.negVol,
      };
    })
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, topLimit);

  // Tuple: [sentiment (X), mentions (Y), entity, riskScore, posVol, negVol, type]
  const chartData: EntityImpactDataResult['chartData'] = impactItems.map(
    (item) => [
      item.sentiment,
      item.mentions,
      item.entity,
      item.riskScore,
      item.positiveVolume,
      item.negativeVolume,
      item.type,
    ],
  );

  return { chartData, impactItems };
};
