import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  escapeHtml,
  createCustomChartTooltip,
} from '@/shared/utils/createChartTooltip.ts';

export const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

export interface ConnectionSentimentData extends PowerCouple {
  label: string;
}

export const getConnectionSentimentData = (
  data: PowerCouple[],
  limit = 10,
): ConnectionSentimentData[] => {
  return data
    .slice()
    .sort((a, b) => Math.abs(b.avgSentiment) - Math.abs(a.avgSentiment))
    .slice(0, limit)
    .map((item) => ({
      ...item,
      label: `${item.person} - ${item.organization}`,
    }));
};

export const buildConnectionSentimentChartTooltip = (
  data: ConnectionSentimentData,
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
        label: 'Strength',
        value: `${data.strength}`,
      },
      {
        label: 'Volatility',
        value: `${data.volatility.toFixed(2)}`,
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
