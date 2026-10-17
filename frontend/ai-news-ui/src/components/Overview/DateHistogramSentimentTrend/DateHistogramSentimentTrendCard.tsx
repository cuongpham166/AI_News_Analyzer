import { SegmentedControl, Group,Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import SentimentTrendChart from './components/SentimentTrendChart';
import SentimentDistributionChart from './components/SentimentDistributionChart'
import SentimentSummary from './components/SentimentSummary';
import { useState } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import type {
  DateHistogramSentimentTrendType
} from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import { useSentimentVolumeTimeline } from '@/hooks/queries/analysis.query.ts';
import type { CalendarInterval } from '@/shared/types/DashboardInterval.ts';

interface Props {
  data?: DateHistogramSentimentTrendType;
}
function DateHistogramSentimentTrendCard({data}:Props) {
  const [view, setView] = useState<'trend' | 'distribution'>('distribution');

  const [calendarInterval, setCalendarInterval] =
    useState<CalendarInterval>('month');

  const { data: specificData, isFetching: isSpecificFetching } =
    useSentimentVolumeTimeline(calendarInterval);

  const chartData = specificData ?? data;

  return (
    <DashboardCard
      title='Sentiment Analytics'
      description='Analyze sentiment patterns and changes across the selected dataset over time.'
      headerActions={
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <SegmentedControl
            value={calendarInterval}
            onChange={(value) => setCalendarInterval(value as CalendarInterval)}
            data={[
              { label: 'Day', value: 'day' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
          />
        </Group>
      }
      toolbar={
        <Group justify='space-between'>
          <SentimentSummary data={chartData} />
          <SegmentedControl
            value={view}
            onChange={(val) => setView(val as 'trend' | 'distribution')}
            data={[
              { label: 'Trend Plot', value: 'trend' },
              { label: 'Distribution View', value: 'distribution' },
            ]}
          />
        </Group>
      }
    >
      {view === 'trend' ? (
        <SentimentTrendChart data={chartData} />
      ) : (
        <SentimentDistributionChart data={chartData} />
      )}
    </DashboardCard>
  );
}

export default DateHistogramSentimentTrendCard;
