import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';

interface EntityImpactData {
  entity: string;
  mentions: number;
  sentiment: number;
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
  data: GlobalEntitiesTrendsType,
): EntityImpactData[] => {
  const entityMap = new Map<
    string,
    {
      mentions: number;
      weightedSentiment: number;
    }
  >();
  Object.values(data.timeline).forEach((entities) => {
    entities.forEach((entity) => {
      const existing = entityMap.get(entity.name);

      if (existing) {
        existing.mentions += entity.count;
        existing.weightedSentiment += entity.count * entity.averageSentiment;
      } else {
        entityMap.set(entity.name, {
          mentions: entity.count,
          weightedSentiment: entity.count * entity.averageSentiment,
        });
      }
    });
  });

  return Array.from(entityMap.entries())
    .map(([entity, value]) => ({
      entity,
      mentions: value.mentions,
      sentiment: value.weightedSentiment / value.mentions,
    }))
};


