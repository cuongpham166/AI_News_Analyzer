
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
import EntitiesHeatmap
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntitiesHeatmap';
import globalEntitiesTrendsData from '@/shared/test_data/GlobalEntitiesTrendsData.ts';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import EntitiesImpactMatrix
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntityImpactMatrix';

function EntityTrendsCard() {
  const [view, setView] = useState<
    'timeline' | 'heatmap' | 'ranking' |'impact'
  >('timeline');
  const loadView = (viewName:string):ReactNode => {
    switch (viewName) {
      case 'timeline':
        return <BubbleTimelineChart data={globalEntitiesTrendsData.data} />;
        case 'heatmap':
          return <EntitiesHeatmap data={globalEntitiesTrendsData.data} />;
          case 'ranking':
            return <RankingChart data={globalEntitiesTrendsData.data} />;
              case 'impact':
                return (
                  <EntitiesImpactMatrix data={globalEntitiesTrendsData.data} />
                );
      default:
        return <BubbleTimelineChart data={globalEntitiesTrendsData.data} />;
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
            setView(val as 'timeline' | 'heatmap' | 'ranking' | 'impact')
          }
          data={[
            { label: 'Bubble Timeline', value: 'timeline' },
            { label: 'Heatmap', value: 'heatmap' },
            { label: 'Ranking View', value: 'ranking' },
            { label: 'Impact Matrix', value: 'impact' },
          ]}
        />

        <Box style={{ flex: 1, minHeight: 0 }}>{loadView(view)}</Box>
      </Stack>
    </MetricCard>
  );
}

export default EntityTrendsCard;
