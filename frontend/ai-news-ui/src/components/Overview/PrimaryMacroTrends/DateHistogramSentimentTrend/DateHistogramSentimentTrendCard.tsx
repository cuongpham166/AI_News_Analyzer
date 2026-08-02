import { Box, Title, Stack, SegmentedControl, Group,Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import SentimentTrendChart
  from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentTrendChart';
import SentimentDistributionChart
  from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentDistributionChart';
import SentimentSummary
  from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentSummary';
import { useState } from 'react';
import DateHistogramSentimentData from '@/shared/test_data/DateHistogramSentimentData.ts';
function DateHistogramSentimentTrendCard() {
  const [view, setView] = useState<'trend' | 'distribution'>('distribution');
  return (
    <MetricCard>
      <Stack gap='md'>
        <Stack gap='sm'>
          <Group justify='space-between'>
            <Title order={5} mb='xs' c={ThemeColors.primary}>
              Sentiment Analytics
            </Title>
            <Group gap='xs'>
              <Text size='sm' c={ThemeColors.primary} fw={500}>
                View by:
              </Text>
              <SegmentedControl data={['Day', 'Month', 'Year']} />
            </Group>
          </Group>
          <Box mt='auto'>
            <SentimentSummary data={DateHistogramSentimentData.data.timeline} />
          </Box>
          <SegmentedControl
            value={view}
            onChange={(val) => setView(val as 'trend' | 'distribution')}
            data={[
              { label: 'Trend Plot', value: 'trend' },
              { label: 'Distribution View', value: 'distribution' },
            ]}
          />
        </Stack>
        <Box style={{ flex: 1, minHeight: 0 }}>
          {view === 'trend' ? (
            <SentimentTrendChart
              data={DateHistogramSentimentData.data.timeline}
            />
          ) : (
            <SentimentDistributionChart
              data={DateHistogramSentimentData.data.timeline}
            />
          )}
        </Box>
      </Stack>
    </MetricCard>
  );
}

export default DateHistogramSentimentTrendCard;
