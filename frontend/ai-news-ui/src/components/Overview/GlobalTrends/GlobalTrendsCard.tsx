import React, { useState } from 'react';
import {
  Group,
  Text,
  SegmentedControl,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import DashboardCard from '@/components/generic/DashboardCard';
import TopicDistributionPeriod
  from '@/components/Overview/GlobalTrends/components/TopicDistributionPeriod';
import TopicGrowth from '@/components/Overview/GlobalTrends/components/TopicGrowth';
import TopicMomentum from '@/components/Overview/GlobalTrends/components/TopicMomentum';
import TopicShare from '@/components/Overview/GlobalTrends/components/TopicShare';
import type { GlobalTimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import { useGlobalTrend } from '@/hooks/queries/analysis.query.ts';
import type { CalendarInterval } from '@/shared/types/DashboardInterval.ts';

interface Props {
  data: GlobalTimelineBucket[];
}
function GlobalTrendsCard({ data }:Props) {
  const [view, setView] = useState<
    'distribution' | 'growth' | 'share' | 'momentum '
  >('distribution');

  const [calendarInterval, setCalendarInterval] =
    useState<CalendarInterval>('month');

  const { data: specificData, isFetching: isSpecificFetching } = useGlobalTrend(calendarInterval);

  const chartData = specificData ?? data;
  //const chartData =  data;

  const loadView = () => {
    if (view === 'distribution') {
      return <TopicDistributionPeriod data={chartData} />;
    } else if (view === 'growth') {
      return <TopicGrowth data={chartData} />;
    } else if (view === 'share') {
      return <TopicShare data={chartData} />;
    } else {
      return <TopicMomentum data={chartData} />;
    }
  };

  return (
    <DashboardCard
      title='Global Topic Trends'
      description='Track how global news coverage evolves across topics, highlighting
            shifts in attention and emerging narratives.'
      headerActions={
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <SegmentedControl
            value={calendarInterval}
            onChange={(value) =>
              setCalendarInterval(value as 'day' | 'month' | 'year')
            }
            data={[
              { label: 'Day', value: 'day' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
          />
        </Group>
      }
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(val) =>
            setView(val as 'distribution' | 'growth' | 'share' | 'momentum ')
          }
          data={[
            { label: 'Distribution', value: 'distribution' },
            { label: 'Growth', value: 'growth' },
            { label: 'Share', value: 'share' },
            { label: 'Momentum', value: 'momentum' },
          ]}
        />
      }
      children={loadView()}
    />
  );
}

export default GlobalTrendsCard;
