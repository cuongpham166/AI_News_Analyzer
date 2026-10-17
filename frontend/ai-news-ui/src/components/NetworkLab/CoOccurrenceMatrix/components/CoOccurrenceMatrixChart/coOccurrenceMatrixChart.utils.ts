import type { CoOccurrence } from '@/shared/types/analysis/network_lab/CoOccurrence.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
interface HeatmapEntity {
  name: string;
  type: string;
}

export interface HeatmapCell {
  value: [number, number, number];
  sharedCount: number;
  avgSentiment: number;
  entityA: string;
  entityB: string;
  typeA: string;
  typeB: string;
}

export const normalizeType = (type: string) => type.toLowerCase();

export const relationshipKey = (typeA: string, typeB: string) => {
  return [normalizeType(typeA), normalizeType(typeB)].sort().join(':');
};

export const buildCoOccurrenceHeatmap = (
  data: CoOccurrence[],
  topN: number,
) => {
  const relationships = new Map<string, CoOccurrence>();

  for (const item of data) {
    const entityA = item.entityA;
    const entityB = item.entityB;

    // Make the pair deterministic.
    const [a, b] = [entityA, entityB].sort();

    const key = `${a}|||${b}`;

    const existing = relationships.get(key);

    if (!existing || item.sharedCount > existing.sharedCount) {
      relationships.set(key, item);
    }
  }

  const topRelationships = Array.from(relationships.values())
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, topN);

  const entityMap = new Map<string, HeatmapEntity>();

  for (const relationship of topRelationships) {
    entityMap.set(relationship.entityA, {
      name: relationship.entityA,
      type: relationship.typeA,
    });

    entityMap.set(relationship.entityB, {
      name: relationship.entityB,
      type: relationship.typeB,
    });
  }

  const entities = Array.from(entityMap.values());

  const entityIndex = new Map(
    entities.map((entity, index) => [entity.name, index]),
  );

  const heatmapData: HeatmapCell[] = [];

  for (const relationship of topRelationships) {
    const x = entityIndex.get(relationship.entityB);
    const y = entityIndex.get(relationship.entityA);

    if (x === undefined || y === undefined) {
      continue;
    }

    const cell: HeatmapCell = {
      value: [x, y, relationship.sharedCount],
      sharedCount: relationship.sharedCount,
      avgSentiment: relationship.avgSentiment,
      entityA: relationship.entityA,
      entityB: relationship.entityB,
      typeA: relationship.typeA,
      typeB: relationship.typeB,
    };

    heatmapData.push(cell);

    if (x !== y) {
      heatmapData.push({
        ...cell,
        value: [y, x, relationship.sharedCount],
      });
    }
  }

  return {
    entities,
    heatmapData,
    relationships: topRelationships,
  };
};

export const buildCoOccurrenceMatrixChartTooltip = (params: any) => {
  const data = params.data as HeatmapCell | undefined;

  if (!data?.entityA || !data?.entityB) {
    return '';
  }

  const sentiment = data.avgSentiment;
  const sentimentText = sentiment.toFixed(2);
  const sentimentColor =
    sentiment > 0
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'];
  const title = `${escapeHtml(data.entityA)} ↔ ${escapeHtml(data.entityB)}`;
  const customContent = `
    <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
        <span style="color:#475569;">Shared coverage</span>
        <strong style="text-align:right;white-space:nowrap;">${data.sharedCount.toLocaleString()}</strong>
    </div>
    <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
        <span style="color:#475569;">Joint sentiment</span>
        <strong style="text-align:right;white-space:nowrap; color:${sentimentColor}">${sentimentText}</strong>
    </div>
  `;
  return createCustomChartTooltip({
    title: title,
    customContent: customContent,
  });
};
