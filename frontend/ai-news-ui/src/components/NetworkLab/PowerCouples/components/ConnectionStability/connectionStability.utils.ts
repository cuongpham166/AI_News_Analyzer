import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  escapeHtml,
  createCustomChartTooltip,
} from '@/shared/utils/createChartTooltip.ts';

export interface ConnectionStabilityNode {
  value: [number, number]; // [avgSentiment, volatility]
  person: string;
  organization: string;
  strength: number;
  positiveCoOccurrences: number;
  negativeCoOccurrences: number;
  avgSentiment: number;
  volatility: number;
  symbolSize: number;
  itemStyle: {
    color: string;
    borderColor: string;
    borderWidth: number;
  };
}

export const getConnectionStabilityData = (
  data: PowerCouple[],
): ConnectionStabilityNode[] => {
  const maxStrength = Math.max(...data.map((d) => d.strength), 1);

  return data.map((d) => {
    const normalizedStrength = d.strength / maxStrength;
    const sentiment = d.avgSentiment ?? 0;

    const jitterX = (Math.random() - 0.5) * 0.015;
    const jitterY = (Math.random() - 0.5) * 0.015;

    return {
      value: [d.avgSentiment + jitterX, d.volatility + jitterY],
      person: d.person,
      organization: d.organization,
      strength: d.strength,
      positiveCoOccurrences: d.positiveCoOccurrences,
      negativeCoOccurrences: d.negativeCoOccurrences,
      avgSentiment: d.avgSentiment,
      volatility: d.volatility,
      symbolSize: 12 + normalizedStrength * 24,
      itemStyle: {
        color:
          sentiment > 0.15
            ? NEWS_SENTIMENT_COLORS['positive']
            : sentiment < -0.15
              ? NEWS_SENTIMENT_COLORS['negative']
              : NEWS_SENTIMENT_COLORS['default'],
        borderColor: '#FFFFFF',
        borderWidth: 1.5,
        opacity: 0.85,
      },
    };
  });
};

export const buildConnectionStabilityChartTooltip = (
  data: ConnectionStabilityNode,
) => {
  if (!data) return '';

  const posVol = data.positiveCoOccurrences ?? 0;
  const negVol = data.negativeCoOccurrences ?? 0;
  const totalVol = posVol + negVol || 1;

  const posPct = Math.round((posVol / totalVol) * 100);
  const negPct = Math.round((negVol / totalVol) * 100);

  const sentiment = data.avgSentiment ?? 0;

  const sentimentColor =
    sentiment > 0
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'];

  const sentimentLabel =
    sentiment > 0.15
      ? 'Positive Lean'
      : sentiment < -0.15
        ? 'Negative Lean'
        : 'Balanced';

  const title = `${escapeHtml(data.person)} ↔ ${escapeHtml(data.organization)}`;
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
        label: 'Avg. Sentiment',
        color: sentimentColor,
        value: `${sentiment.toFixed(2)} (${sentimentLabel})`,
      },
      {
        label: 'Volatility',
        value: `${data.volatility.toFixed(2)}`,
      },
      {
        label: 'Strength',
        value: `${data.strength}`,
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
};
