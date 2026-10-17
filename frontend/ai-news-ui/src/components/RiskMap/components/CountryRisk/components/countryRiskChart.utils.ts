import { RISK_LEVEL_COLORS } from '@/shared/constants/RiskLevel.ts';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
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

export const buildCountryRiskChartTooltip = (params: any) => {
  const item: CountryRisk = params.data?.rawItem;

  if (!item) {
    return `
        <div style="font-family: sans-serif; padding: 2px 4px; color: #0F172A;">
            <div style="font-weight: 600; font-size: 13px;">${escapeHtml(params.name)}</div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">No coverage data</div>
        </div>
    `;
  }

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

  const countryCodeStr = item.countryCode
    ? ` (${escapeHtml(item.countryCode)})`
    : '';

  return createCustomChartTooltip({
    title: escapeHtml(item.country) + '' + countryCodeStr,
    subtitle: 'Country Risk Analysis',
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
        label: 'Total Mentions',
        value: `${item.frequency.toLocaleString()}`,
      },
      {
        label: 'Global Share',
        value: `${(item.coveragePercent ?? 0).toFixed(1)}%`,
      },
      {
        label: 'Risk Index',
        value: `${riskPercent}%`,
        color:
          riskPercent > 40
            ? NEWS_SENTIMENT_COLORS['negative']
            : NEWS_SENTIMENT_COLORS['positive'],
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
