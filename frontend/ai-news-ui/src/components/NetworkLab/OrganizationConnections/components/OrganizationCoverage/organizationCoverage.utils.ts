import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

export const buildCoverageTooltip = (item: AllianceNetwork) => {
  if (!item) return '';

  const totalShared = item.sharedArticles || 1;
  const posPct = Math.round(((item.positiveArticles || 0) / totalShared) * 100);
  const conflictPct = Math.round(
    ((item.conflictArticles || 0) / totalShared) * 100,
  );

  const sentiment = item.avgSentiment ?? 0;
  const sentimentColor =
    sentiment > 0
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'];

  const sentimentLabel =
    sentiment > 0.15 ? 'Positive' : sentiment < -0.15 ? 'Conflict' : 'Neutral';

  const title = `${escapeHtml(item.orgA)} ↔ ${escapeHtml(item.orgB)}`;
  return createCustomChartTooltip({
    title: title,
    metrics: [
      {
        label: 'Positive Articles',
        value: `${item.positiveArticles}`,
        color: NEWS_SENTIMENT_COLORS['positive'],
      },
      {
        label: 'Negative Articles',
        value: `${item.conflictArticles}`,
        color: NEWS_SENTIMENT_COLORS['negative'],
      },
      {
        label: 'Shared Articles',
        value: `${item.sharedArticles}`,
      },
      {
        label: 'Avg. Sentiment',
        value: `${sentiment.toFixed(2)} (${sentimentLabel})`,
        color: sentimentColor,
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
          percentage: conflictPct,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
      ],
    },
  });
};
