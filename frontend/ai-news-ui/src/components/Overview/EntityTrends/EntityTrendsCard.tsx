
import { type ReactNode, useState } from 'react';
import {
  Group,
  Text,
  SegmentedControl,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import BubbleTimelineChart
  from '@/components/Overview/EntityTrends/components/BubbleTimelineChart';
import RankingChart from '@/components/Overview/EntityTrends/components/RankingChart';
import EntitiesHeatmap
  from '@/components/Overview/EntityTrends/components/EntitiesHeatmap';
import EntitiesImpactMatrix
  from '@/components/Overview/EntityTrends/components/EntityImpactMatrix';
import DashboardCard from '@/components/generic/DashboardCard';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';
import {
  useGlobalEntityTrend,
  useSentimentVolumeTimeline,
} from '@/hooks/queries/analysis.query.ts';
import type { CalendarInterval } from '@/shared/types/DashboardInterval.ts';

interface Props {
  data?: GlobalEntitiesTrends;
}
function EntityTrendsCard({ data }: Props) {
  const [view, setView] = useState<
    'timeline' | 'heatmap' | 'ranking' | 'impact'
  >('timeline');

  const [calendarInterval, setCalendarInterval] =
    useState<CalendarInterval>('month');

  const { data: specificData, isFetching: isSpecificFetching } = useGlobalEntityTrend(calendarInterval);

  const chartData = specificData ?? data;

  const loadView = (viewName: string): ReactNode => {
    switch (viewName) {
      case 'timeline':
        return <BubbleTimelineChart data={chartData} />;
      case 'heatmap':
        return <EntitiesHeatmap data={chartData} />;
      case 'ranking':
        return <RankingChart data={chartData} />;
      case 'impact':
        return <EntitiesImpactMatrix data={chartData} />;
      default:
        return <BubbleTimelineChart data={data} />;
    }
  };

  return (
    <DashboardCard
      title='Global Entities Trends'
      description=''
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
            setView(val as 'timeline' | 'heatmap' | 'ranking' | 'impact')
          }
          data={[
            { label: 'Bubble Timeline', value: 'timeline' },
            { label: 'Heatmap', value: 'heatmap' },
            { label: 'Ranking View', value: 'ranking' },
            { label: 'Impact Matrix', value: 'impact' },
          ]}
        />
      }
      children={data && loadView(view)}
    />
  );
}

export default EntityTrendsCard;
