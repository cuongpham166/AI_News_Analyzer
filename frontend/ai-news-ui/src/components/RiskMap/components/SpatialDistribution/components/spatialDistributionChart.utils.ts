import { RISK_LEVEL_COLORS } from '@/shared/constants/RiskLevel.ts';
import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

export const getSentimentColor = (avgSentiment: number): string => {
  if (avgSentiment >= 0.1) return RISK_LEVEL_COLORS['low'];
  if (avgSentiment <= -0.1) return RISK_LEVEL_COLORS['high'];
  return RISK_LEVEL_COLORS['moderate'];
};

export const buildSpatialDistributionChart = (params: any) => {
  const item: SpatialMap = params.data?.rawItem;
  if (!item) return params.name;

  const posRatio =
    item.frequency > 0
      ? Math.round((item.positiveVolume / item.frequency) * 100)
      : 0;
  const negRatio =
    item.frequency > 0
      ? Math.round((item.negativeVolume / item.frequency) * 100)
      : 0;

  const riskPercent = Math.round((item.riskScore ?? 0) * 100);

  const sentimentColor = getSentimentColor(item.avgSentiment);
  const formattedSentiment =
    item.avgSentiment > 0
      ? `+${item.avgSentiment.toFixed(2)}`
      : item.avgSentiment.toFixed(2);

  const countryDisplay = item.country
    ? `${escapeHtml(item.country)}${
        item.countryCode ? ` (${escapeHtml(item.countryCode)})` : ''
      }`
    : 'Unspecified Region';

  return createCustomChartTooltip({
    title: escapeHtml(item.location),
    subtitle: countryDisplay,
    metrics: [
      {
        label: 'Positive Articles',
        value: `${item.positiveVolume}`,
        color: NEWS_SENTIMENT_COLORS['positive'],
      },
      {
        label: 'Negative Articles',
        value: `${item.negativeVolume}`,
        color: NEWS_SENTIMENT_COLORS['negative'],
      },
      {
        label: 'Risk Index',
        value: `${riskPercent}%`,
        color: riskPercent > 40 ? NEWS_SENTIMENT_COLORS['negative'] : '#64748B',
      },
      {
        label: 'Avg. Sentiment',
        value: `${formattedSentiment}`,
        color: sentimentColor,
      },
    ],

    distribution: {
      segments: [
        {
          label: 'Pos',
          percentage: posRatio,
          color: NEWS_SENTIMENT_COLORS['positive'],
        },
        {
          label: 'Conflict',
          percentage: negRatio,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
      ],
    },
  });
};
