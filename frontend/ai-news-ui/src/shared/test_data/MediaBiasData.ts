import type Response from '@/shared/types/Response.ts';
import type { MediaBias } from '@/shared/types/analysis/MediaBias.ts';

const MediaBiasData:Response<MediaBias[]> = {
  success: true,
  message: 'Success',
  data: [
    {
      source: 'UN',
      topic: 'world',
      volume: 191,
      avgSentiment: 0.95,
    },
    {
      source: 'DW',
      topic: 'world',
      volume: 49,
      avgSentiment: 0.94,
    },
    {
      source: 'UN',
      topic: 'politics',
      volume: 31,
      avgSentiment: 0.9,
    },
    {
      source: 'UN',
      topic: 'health',
      volume: 23,
      avgSentiment: 0.94,
    },
    {
      source: 'DW',
      topic: 'economy',
      volume: 22,
      avgSentiment: 0.9,
    },
    {
      source: 'UN',
      topic: 'science',
      volume: 21,
      avgSentiment: 0.97,
    },
    {
      source: 'DW',
      topic: 'sports',
      volume: 17,
      avgSentiment: 0.96,
    },
    {
      source: 'DW',
      topic: 'science',
      volume: 14,
      avgSentiment: 0.98,
    },
    {
      source: 'DW',
      topic: 'politics',
      volume: 13,
      avgSentiment: 0.95,
    },
    {
      source: 'DW',
      topic: 'entertainment',
      volume: 13,
      avgSentiment: 0.98,
    },
    {
      source: 'UN',
      topic: 'economy',
      volume: 9,
      avgSentiment: 0.95,
    },
    {
      source: 'DW',
      topic: 'health',
      volume: 8,
      avgSentiment: 0.89,
    },
    {
      source: 'DW',
      topic: 'technology',
      volume: 5,
      avgSentiment: 0.96,
    },
    {
      source: 'UN',
      topic: 'sports',
      volume: 5,
      avgSentiment: 1.0,
    },
    {
      source: 'UN',
      topic: 'technology',
      volume: 3,
      avgSentiment: 0.98,
    },
    {
      source: 'UN',
      topic: 'entertainment',
      volume: 3,
      avgSentiment: 1.0,
    },
  ],
  timestamp: 1786444649306,
};

export default MediaBiasData;