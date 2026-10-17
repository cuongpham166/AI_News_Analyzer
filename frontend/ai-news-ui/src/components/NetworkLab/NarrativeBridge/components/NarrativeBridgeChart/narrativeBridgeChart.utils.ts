import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

export interface SankeyNode {
  name: string;
  category: 'person' | 'keyphrase';
  itemStyle?: {
    color?: string;
  };
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  positiveVolume: number;
  negativeVolume: number;
  avgSentiment: number;
  stabilityScore: number;
  lineStyle?: {
    color?: string;
    opacity?: number;
  };
}

export const getSentimentColor = (avgSentiment: number): string => {
  if (avgSentiment > 0) return NEWS_SENTIMENT_COLORS['positive'];
  if (avgSentiment < 0) return NEWS_SENTIMENT_COLORS['negative'];
  return NEWS_SENTIMENT_COLORS['default'];
};

export const buildNarrativeBridgeChartTooltip = (params: any) => {
  if (params.dataType === 'edge') {
    const link: SankeyLink = params.data;
    const posRatio =
      link.value > 0 ? Math.round((link.positiveVolume / link.value) * 100) : 0;
    const negRatio =
      link.value > 0 ? Math.round((link.negativeVolume / link.value) * 100) : 0;

    const sentimentColor = getSentimentColor(link.avgSentiment);
    const sourceName = escapeHtml(link.source);
    const targetName = escapeHtml(link.target.trim());
    const title = `${sourceName} → ${targetName}`;

    return createCustomChartTooltip({
      title: title,
      metrics: [
        {
          label: 'Positive Articles',
          value: `${link.positiveVolume}`,
          color: NEWS_SENTIMENT_COLORS['positive'],
        },
        {
          label: 'Negative Articles',
          value: `${link.negativeVolume}`,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
        {
          label: 'Total Articles',
          value: `${link.value}`,
        },
        {
          label: 'Avg. Sentiment',
          value: `${link.avgSentiment.toFixed(2)}`,
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
  }
};
