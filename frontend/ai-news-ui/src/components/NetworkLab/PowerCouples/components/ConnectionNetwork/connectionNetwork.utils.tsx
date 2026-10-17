import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';


export type NetworkRelationship = PowerCouple

export interface NetworkNode {
  id: string;
  name: string;
  category: number;
  entityType: 'person' | 'organization';
  symbolSize: number;
  totalStrength: number;
  avgSentiment: number;
  avgVolatility: number;
  connectedCount: number;
  itemStyle: {
    color: string;
  };
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  relationship: NetworkRelationship;
  lineStyle: {
    width: number;
    color: string;
    opacity: number;
  };
}

interface ConnectionNetworkProps {
  powerCouple?: PowerCouple[];
  height?: number;
}


const getEdgeSentimentColor = (sentiment: number): string => {
  if (sentiment > 0.15) return NEWS_SENTIMENT_COLORS["positive"];
  if (sentiment < -0.15) return NEWS_SENTIMENT_COLORS['negative'];
  return NEWS_SENTIMENT_COLORS['default'];
};

export const getConnectionNetworkData = (data: PowerCouple[], limit = 10) => {
  const relationships = data
    .slice()
    .sort((a, b) => b.strength - a.strength)
    .slice(0, limit);

  const people = [...new Set(relationships.map((d) => d.person))];
  const organizations = [...new Set(relationships.map((d) => d.organization))];

  const nodeStrengthMap = new Map<string, number>();
  const nodeSentimentMap = new Map<string, number[]>();
  const nodeVolatilityMap = new Map<string, number[]>();

  const trackNodeMetrics = (id: string, rel: PowerCouple) => {
    nodeStrengthMap.set(id, (nodeStrengthMap.get(id) ?? 0) + rel.strength);

    const sArr = nodeSentimentMap.get(id) ?? [];
    sArr.push(rel.avgSentiment);
    nodeSentimentMap.set(id, sArr);

    const vArr = nodeVolatilityMap.get(id) ?? [];
    vArr.push(rel.volatility);
    nodeVolatilityMap.set(id, vArr);
  };

  for (const rel of relationships) {
    trackNodeMetrics(`person:${rel.person}`, rel);
    trackNodeMetrics(`organization:${rel.organization}`, rel);
  }

  const maxNodeStrength = Math.max(...nodeStrengthMap.values(), 1);

  const createNode = (
    name: string,
    entityType: 'person' | 'organization',
    category: number
  ): NetworkNode => {
    const id = `${entityType}:${name}`;
    const totalStrength = nodeStrengthMap.get(id) ?? 0;
    const normalizedStrength = totalStrength / maxNodeStrength;

    const sentiments = nodeSentimentMap.get(id) ?? [0];
    const avgSentiment =
      sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    const volatilities = nodeVolatilityMap.get(id) ?? [0];
    const avgVolatility =
      volatilities.reduce((a, b) => a + b, 0) / volatilities.length;

    return {
      id,
      name,
      category,
      entityType,
      totalStrength,
      avgSentiment,
      avgVolatility,
      connectedCount: sentiments.length,
      symbolSize: 22 + normalizedStrength * 32,
      itemStyle: {
        color: NEWS_ENTITY_COLORS[entityType],
      },
    };
  };

  const nodes: NetworkNode[] = [
    ...people.map((person) => createNode(person, 'person', 0)),
    ...organizations.map((org) => createNode(org, 'organization', 1)),
  ];

  const maxRelationshipStrength = Math.max(
    ...relationships.map((d) => d.strength),
    1
  );

  const links: NetworkLink[] = relationships.map((rel) => {
    const normalizedStrength = rel.strength / maxRelationshipStrength;

    return {
      source: `person:${rel.person}`,
      target: `organization:${rel.organization}`,
      value: rel.strength,
      relationship: rel,
      lineStyle: {
        width: 1.5 + normalizedStrength * 6,
        color: getEdgeSentimentColor(rel.avgSentiment),
        opacity: 0.7,
      },
    };
  });

  return {
    people,
    organizations,
    relationships,
    nodes,
    links,
  };
};


export const buildConnectionNetworkTooltipChart = (params: any) => {
  if (params.dataType === 'node') {
    const node = params.data as NetworkNode;
    const type = node.category === 0 ? 'Person' : 'Organization';

    const sentimentLabel =
      node.avgSentiment > 0.15
        ? 'Positive Lean'
        : node.avgSentiment < -0.15
          ? 'Negative Lean'
          : 'Balanced';

    const sentimentColor = node.avgSentiment > 0 ? NEWS_SENTIMENT_COLORS["positive"] : NEWS_SENTIMENT_COLORS["negative"]

    const customContent = `
        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
            <span style="color:#475569;">Connections</span>
            <strong style="text-align:right;white-space:nowrap;">${node.connectedCount}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
            <span style="color:#475569;">Total Strength</span>
            <strong style="text-align:right;white-space:nowrap;">${node.totalStrength}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
            <span style="color:#475569;">Avg. Sentiment</span>
            <strong style="text-align:right;white-space:nowrap;color:${sentimentColor}">${node.avgSentiment.toFixed(2)} (${sentimentLabel})</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;">
            <span style="color:#475569;">Avg. Volatility</span>
            <strong style="text-align:right;white-space:nowrap;">${node.avgVolatility.toFixed(2)}</strong>
        </div>
    `;
    return createCustomChartTooltip({
      title: escapeHtml(node.name),
      badge: String(type).toUpperCase(),
      badgeBgColor: NEWS_ENTITY_COLORS[type.toLowerCase()],
      customContent: customContent,
    });
  }

  if (params.dataType === 'edge') {
    const link = params.data as NetworkLink;
    const rel = link.relationship;

    const posVol = rel.positiveCoOccurrences ?? 0;
    const negVol = rel.negativeCoOccurrences ?? 0;
    const totalVol = posVol + negVol || 1;

    const posPct = Math.round((posVol / totalVol) * 100);
    const negPct = Math.round((negVol / totalVol) * 100);

    const sentimentColor =
      rel.avgSentiment > 0
        ? NEWS_SENTIMENT_COLORS['positive']
        : NEWS_SENTIMENT_COLORS["negative"]

    const sentimentLabel =
      rel.avgSentiment > 0.15
        ? 'Positive Lean'
        : rel.avgSentiment < -0.15
          ? 'Negative Lean'
          : 'Balanced';

    const title = `${escapeHtml(rel.person)} ↔ ${escapeHtml(rel.organization)}`;
    return createCustomChartTooltip({
      title: title,
      metrics: [
        {
          label: 'Positive Articles',
          value: `${posVol}`,
          color: NEWS_SENTIMENT_COLORS['positive'],
        },
        {
          label: 'Negative Articles',
          value: `${negVol}`,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
        {
          label: 'Total Articles',
          value: `${totalVol}`,
        },
        {
          label: 'Co-occurrence Strength',
          value: `${rel.strength}`,
        },
        {
          label: 'Avg. Sentiment',
          value: `${rel.avgSentiment.toFixed(2)} (${sentimentLabel})`,
          color: sentimentColor,
        },
        {
          label: 'Volatility',
          value: `${rel.volatility.toFixed(2)}`,
        },
      ],
      distribution: {
        segments: [
          {
            label: 'Pos',
            percentage: posPct,
            color: NEWS_SENTIMENT_COLORS['positive'],
          },
          {
            label: 'Conflict',
            percentage: negPct,
            color: NEWS_SENTIMENT_COLORS['negative'],
          },
        ],
      },
    });
  }
  return '';
};