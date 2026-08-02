import React from 'react';
import { Paper, SimpleGrid, Text, Stack, Group } from '@mantine/core';
import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import {
  calculateAverageSentiment, calculateSentimentPercentages,
  calculateTotalArticles,
} from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentSummary/sentimentSummary.utils.ts';

interface SentimentSummaryProps {
  data: TimelineBucket[];
}
const SentimentSummary = ({data}:SentimentSummaryProps) => {
  const avgSentiment = calculateAverageSentiment(data);
  const { positivePercent, negativePercent } =
    calculateSentimentPercentages(data);
  const getSentimentColor = (value: number) => {
    if (value >= 0.5) return 'green';
    if (value <= -0.5) return 'red';
    return 'yellow';
  };

  return (
    <Paper withBorder p='sm' radius='md' mb='md'>
      <SimpleGrid cols={4} spacing='xs'>
        <Stack gap={0}>
          <Text size='sm' c='dimmed'>
            Total Articles
          </Text>
          <Text size='xl' fw={600}>
            {calculateTotalArticles(data)}
          </Text>
        </Stack>
        <Stack gap={0}>
          <Text size='sm' c='dimmed'>
            Positive Articles
          </Text>
          <Text size='xl' fw={600}>
            {positivePercent}%
          </Text>
        </Stack>
        <Stack gap={0}>
          <Text size='sm' c='dimmed'>
            Negative Articles
          </Text>
          <Text size='xl' fw={600}>
            {negativePercent}%
          </Text>
        </Stack>
        <Stack gap={0}>
          <Text size='sm' c='dimmed'>
            Average Sentiment
          </Text>
          <Text size='xl' fw={600} c={getSentimentColor(avgSentiment)}>
            {avgSentiment > 0 ? '+' : ''}
            {avgSentiment.toFixed(2)}
          </Text>
        </Stack>
      </SimpleGrid>
    </Paper>
  );
};

export default SentimentSummary;
