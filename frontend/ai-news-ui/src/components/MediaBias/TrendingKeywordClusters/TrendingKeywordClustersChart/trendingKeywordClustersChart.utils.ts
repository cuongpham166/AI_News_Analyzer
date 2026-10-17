import type { TrendingKeywords } from '@/shared/types/analysis/media_bias/TrendingKeywords.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';

export const buildTrendingKeywordClustersTooltip = (
  sorted: TrendingKeywords[],
  params: any,
) => {
  if (!params || params.length === 0) return '';
  const dataIndex = params[0].dataIndex;
  const item = sorted[dataIndex];

  const posRatio =
    item.coOccurrence > 0
      ? Math.round((item.positiveCoOccurrence / item.coOccurrence) * 100)
      : 0;
  const negRatio =
    item.coOccurrence > 0
      ? Math.round((item.negativeCoOccurrence / item.coOccurrence) * 100)
      : 0;

  const sentimentColor =
    item.avgSentiment > 0
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'];

  const formattedSentiment =
    item.avgSentiment > 0
      ? `+${item.avgSentiment.toFixed(2)}`
      : item.avgSentiment.toFixed(2);

  const topic = escapeHtml(
    item.topic.charAt(0).toUpperCase() + item.topic.slice(1).toLowerCase(),
  );

  return createCustomChartTooltip({
    title: escapeHtml(item.keyPhrase),
    subtitle: `Topic: ${topic}`,
    badge: String(item.topic).toUpperCase(),
    badgeBgColor: NEWS_TOPIC_COLORS[item.topic],
    metrics: [
      {
        label: 'Positive Co-occurrence',
        value: `${item.positiveCoOccurrence}`,
        color: NEWS_SENTIMENT_COLORS['positive'],
      },
      {
        label: 'Negative Co-occurrence',
        value: `${item.negativeCoOccurrence}`,
        color: NEWS_SENTIMENT_COLORS['negative'],
      },
      {
        label: 'Total Co-occurrences',
        value: `${item.coOccurrence}`,
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
