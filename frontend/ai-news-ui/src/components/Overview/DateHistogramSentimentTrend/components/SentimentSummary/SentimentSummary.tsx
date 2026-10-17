import React from 'react';
import { Paper, SimpleGrid, Text, Stack, Card } from '@mantine/core';
import type { DateHistogramSentimentTrendType, TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import {
  calculateAverageSentiment, calculateSentimentPercentages,
  calculateTotalArticles,
} from '@/components/Overview/DateHistogramSentimentTrend/components/SentimentSummary/sentimentSummary.utils.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface SentimentSummaryProps {
  data?: DateHistogramSentimentTrendType;
}
const SentimentSummary = ({data}:SentimentSummaryProps) => {
  if (!data?.timeline?.length) {
    return (
      <EmptyDataCard
        title='No data available'
        description='No summary data were found for this selection.'
      />
    );
  }

  const avgSentiment = calculateAverageSentiment(data);
  const { positivePercent, negativePercent } = calculateSentimentPercentages(data);

  const getSentimentColor = (value: number) => {
    if (value >= 0.5) return ThemeColors.success;
    if (value <= -0.5) return ThemeColors.error;
    return ThemeColors.warning;
  };

  const metrics = [
    {
      label: 'Articles Analyzed',
      value: calculateTotalArticles(data) ?? 0,
    },
    {
      label: 'Positive Sentiment',
      value: `${positivePercent}%`,
    },
    {
      label: 'Negative Sentiment',
      value: `${negativePercent}%`,
    },
    {
      label: 'Average Sentiment',
      value: `${avgSentiment > 0 ? '+' : ''}${avgSentiment.toFixed(2)}`,
      color: getSentimentColor(avgSentiment),
    },
  ];

  return (
    <SimpleGrid
      cols={{
        base: 2,
        sm: 4,
      }}
      spacing='md'
    >
      {metrics.map((metric) => (
        <Stack key={metric.label} gap={2}>
          <Text
            size='xs'
            fw={600}
            tt='uppercase'
            c={ThemeColors.textSecondary}
          >
            {metric.label}
          </Text>

          <Text size='xl' fw={700} c={metric.color ?? ThemeColors.text}>
            {metric.value}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  );
};

export default SentimentSummary;
