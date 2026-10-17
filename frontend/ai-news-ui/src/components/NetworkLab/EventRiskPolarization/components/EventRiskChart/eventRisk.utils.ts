import { RISK_LEVEL_COLORS } from '@/shared/constants/RiskLevel.ts';
import type { EventRisk } from '@/shared/types/analysis/network_lab/EventRisk.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  escapeHtml,
  createCustomChartTooltip,
} from '@/shared/utils/createChartTooltip.ts';

export const truncateLabel = (str: string, maxLen = 22): string => {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}…` : str;
};

export const getRiskLevelColor = (riskScore: number): string => {
  if (riskScore >= 0.6) return RISK_LEVEL_COLORS['high'];
  if (riskScore >= 0.3) return RISK_LEVEL_COLORS['moderate'];
  return RISK_LEVEL_COLORS['low'];
};

export const buildEventRiskChartTooltip = (
  chartData: EventRisk[],
  params: any[],
) => {
  if (!params || params.length === 0) return '';
  const dataIndex = params[0].dataIndex;
  const item = chartData[dataIndex];

  const posRatio =
    item.frequency > 0
      ? Math.round((item.positiveVolume / item.frequency) * 100)
      : 0;
  const negRatio =
    item.frequency > 0
      ? Math.round((item.negativeVolume / item.frequency) * 100)
      : 0;

  const riskPercent = Math.round((item.riskScore ?? 0) * 100);
  const polarizationPercent = Math.round((item.polarizationScore ?? 0) * 100);
  const riskColor = getRiskLevelColor(item.riskScore ?? 0);

  const sentimentColor =
    item.avgSentiment > 0
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'];

  return createCustomChartTooltip({
    title: escapeHtml(item.event),
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
        label: 'Total Coverage',
        value: `${item.frequency}`,
      },
      {
        label: 'Risk Score',
        value: `${riskPercent}%`,
        color: riskColor,
      },
      {
        label: 'Polarization Signal',
        value: `${polarizationPercent}%`,
      },
      {
        label: 'Avg. Sentiment',
        value: `${item.avgSentiment.toFixed(2)}`,
        color: sentimentColor,
      },
    ],
    distribution: {
      segments: [
        {
          label: 'Positive',
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
