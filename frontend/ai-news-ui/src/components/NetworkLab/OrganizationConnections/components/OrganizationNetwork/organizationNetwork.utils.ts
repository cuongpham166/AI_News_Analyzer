import {
  NEWS_SENTIMENT_COLORS,
  NEWS_SENTIMENTS,
} from '@/shared/constants/NewsSentiments.ts';
import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

export const getSentimentColor = (sentiment: number) => {
  if (sentiment > 0) return NEWS_SENTIMENT_COLORS['positive'];
  if (sentiment < 0) return NEWS_SENTIMENT_COLORS['negative'];
  return NEWS_SENTIMENT_COLORS['default'];
};

export const getSentimentLabel = (sentiment: number) => {
  if (sentiment > 0.15) return 'Positive Alliance';
  if (sentiment < -0.15) return 'High Conflict';
  return 'Neutral / Mixed';
};

export const buildTooltipChart = (params: any) => {
  if (params.dataType === 'node') {
    const data = params.data;
    const name = data.name;

    const totalShared = data.sharedArticlesTotal || 1;
    const posPct = Math.round(((data.positiveTotal || 0) / totalShared) * 100);
    const conflictPct = Math.round(
      ((data.conflictTotal || 0) / totalShared) * 100,
    );
    return createCustomChartTooltip({
      title: escapeHtml(name),
      metrics: [
        {
          label: 'Positive Articles',
          value: `${data.positiveTotal}`,
          color: NEWS_SENTIMENT_COLORS['positive'],
        },
        {
          label: 'Conflict Articles',
          value: `${data.conflictTotal}`,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
        {
          label: 'Total Shared Articles',
          value: `${data.sharedArticlesTotal}`,
        },
        {
          label: 'Direct Connections',
          value: `${data.connectionsCount}`,
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
  }

  if (params.dataType === 'edge') {
    const relationship = params.data.relationship as AllianceNetwork;

    if (!relationship) {
      return '';
    }

    const totalShared = relationship.sharedArticles || 1;
    const posPct = Math.round(
      ((relationship.positiveArticles || 0) / totalShared) * 100,
    );
    const conflictPct = Math.round(
      ((relationship.conflictArticles || 0) / totalShared) * 100,
    );

    const sentiment = relationship.avgSentiment ?? 0;
    const sentimentColor =
      sentiment > 0
        ? NEWS_SENTIMENT_COLORS['positive']
        : NEWS_SENTIMENT_COLORS['negative'];
    const title = `${escapeHtml(relationship.orgA)} ↔ ${escapeHtml(relationship.orgB)}`;
    return createCustomChartTooltip({
      title: title,
      metrics: [
        {
          label: 'Positive Articles',
          value: `${relationship.positiveArticles}`,
          color: NEWS_SENTIMENT_COLORS['positive'],
        },
        {
          label: 'Negative Articles',
          value: `${relationship.conflictArticles}`,
          color: NEWS_SENTIMENT_COLORS['negative'],
        },
        {
          label: 'Shared Articles',
          value: `${relationship.sharedArticles}`,
        },
        {
          label: 'Avg. Sentiment',
          value: `${sentiment.toFixed(2)}`,
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
  }

  return '';
};
