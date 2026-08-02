import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';

export interface SentimentDistributionData {
  timestamp: string;
  positive: number;
  negative: number;
  positivePercent: number;
  negativePercent: number;
  total: number;
}

const calculateSentimentPercent = (sentimentCount:number, total:number):number=> {
  const percent = sentimentCount / total;
  if (total === 0) return 0;
  return Number(((sentimentCount / total) * 100).toFixed(1));
}

const normalizeSentimentDistributionData = (
  timelines: TimelineBucket[],
): SentimentDistributionData[] => {
  return timelines.map((timeline) => {
    const positive = timeline.sentimentBreakdown?.POSITIVE ?? 0;
    const negative = timeline.sentimentBreakdown?.NEGATIVE ?? 0;

    return {
      timestamp: timeline.timestamp,
      positive,
      negative,
      positivePercent: calculateSentimentPercent(
        positive,
        timeline.articleCount,
      ),
      negativePercent: calculateSentimentPercent(
        negative,
        timeline.articleCount,
      ),
      total: timeline.articleCount,
    };
  });
};

export const getSentimentDistributionData = (
  timelines: TimelineBucket[],
): SentimentDistributionData[] => {
  return normalizeSentimentDistributionData(timelines);
};


export const formatTimestamp = (timestamp:string):string => {
  const date = new Date(Number(timestamp) * 1000);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '.');
}


