
import { type ReactNode, useState } from 'react';
import {
  Box,
  Paper,
  Title,
  ColorSwatch,
  Group,
  Text,
  Stack,
  SegmentedControl,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import BubbleTimelineChart
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/BubbleTimelineChart';
import RankingChart from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/RankingChart';
import SentimentChart
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/SentimentChart';
import EntitiesHeatmap
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntitiesHeatmap';

function EntityTrendsCard() {
  const [view, setView] = useState<
    'timeline' | 'heatmap' | 'ranking' | 'sentiment'
  >('timeline');

  const loadView = (viewName:string):ReactNode => {
    if(viewName === 'timeline') {
      return <BubbleTimelineChart />
    }else if(viewName === 'ranking') {
      return <RankingChart/>
    }else if (viewName === 'heatmap') {
      return  <EntitiesHeatmap/>
    } else{
      return  <SentimentChart />;
    }
  }

  return (
    <MetricCard>
      <Stack gap='md'>
        <Group justify='space-between'>
          <Title order={5} mb='xs' c={ThemeColors.primary}>
            Global Entities Trends
          </Title>
          <Group gap='xs'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              View by:
            </Text>
            <SegmentedControl data={['Day', 'Month', 'Year']} />
          </Group>
        </Group>
        <SegmentedControl
          value={view}
          onChange={(val) =>
            setView(val as 'timeline'| 'heatmap' | 'ranking' | 'sentiment')
          }
          data={[
            { label: 'Bubble Timeline', value: 'timeline' },
            { label: 'Heatmap', value: 'heatmap' },
            { label: 'Ranking View', value: 'ranking' },
            { label: 'Sentiment View', value: 'sentiment' },
          ]}
        />

        <Box style={{ flex: 1, minHeight: 0 }}>{loadView(view)}</Box>
      </Stack>
    </MetricCard>
  );
}

export default EntityTrendsCard;
