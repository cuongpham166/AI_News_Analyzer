import type { DateHistogramSentimentTrendType, TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';

export interface SentimentPercentages {
  positivePercent: number;
  negativePercent: number;
}

export function calculateAverageSentiment(
  data: DateHistogramSentimentTrendType,
): number {
  const totalArticles = data.timeline.reduce(
    (sum, item) => sum + item.articleCount,
    0,
  );

  if (totalArticles === 0) {
    return 0;
  }

  const weightedSentiment = data.timeline.reduce(
    (sum, item) => sum + item.averageSentiment * item.articleCount,
    0,
  );

  return weightedSentiment / totalArticles;
}

export function calculateTotalArticles(data: DateHistogramSentimentTrendType): number {
  return data.timeline.reduce((sum, item) => sum + item.articleCount, 0);
}

export function calculateSentimentPercentages(
  data: DateHistogramSentimentTrendType,
): SentimentPercentages {
  const { positive, negative } = data.timeline.reduce(
    (acc, item) => {
      acc.positive += item.sentimentBreakdown.POSITIVE ?? 0;
      acc.negative += item.sentimentBreakdown.NEGATIVE ?? 0;
      return acc;
    },
    { positive: 0, negative: 0 },
  );

  const totalSentimentArticles = positive + negative;

  if (totalSentimentArticles === 0) {
    return {
      positivePercent: 0,
      negativePercent: 0,
    };
  }

  return {
    positivePercent: Math.round((positive / totalSentimentArticles) * 100),
    negativePercent: Math.round((negative / totalSentimentArticles) * 100),
  };
}