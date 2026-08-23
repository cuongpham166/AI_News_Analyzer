import {
  Grid,
  Group,
  SegmentedControl,
  Text,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import DeepVelocityChart from '@/components/Overview/DeepVelocity/components/DeepVelocityChart';
import {calculateMomentumScore,calculateTrendDirection} from '@/shared/utils/calculateDeepVelocityMetrics.ts';
import { useMemo, useState } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import type { DeepVelocity } from '@/shared/types/analysis';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface Props {
  data?: DeepVelocity[];
}
function DeepVelocityCard({ data }:Props) {
  const hasData = (data?.length ?? 0) > 0;

  const [selectedTrendDirection, setSelectedTrendDirection] =
    useState<string>('Rising');

  const chartData = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return data.map((item) => ({
      entity: item.entity,
      currentMentions: item.currentMentions,
      previousMentions: item.previousMentions,
      velocityPercentage: item.velocityPercentage,
      momentumScore: calculateMomentumScore(
        item.currentMentions,
        item.velocityPercentage,
      ),
      trendDirection: calculateTrendDirection(
        item.currentMentions,
        item.previousMentions,
      ),
    }));
  }, [data]);

  const filteredData =
    selectedTrendDirection === 'All'
      ? chartData
      : chartData.filter(
          (item) => item.trendDirection === selectedTrendDirection,
        );

  if (!hasData) {
    return (
      <EmptyDataCard
        title='No data available'
        description='No velocity data were found for this selection.'
      />
    );
  }

  return (
    <Grid gutter='md'>
      <Grid.Col span={12}>
        <DashboardCard
          title='Deep Velocity Analytics Matrix'
          description=''
          headerActions={
            <Group gap='xs'>
              <Text size='sm' c={ThemeColors.primary} fw={500}>
                Trend Direction:
              </Text>

              <SegmentedControl
                value={selectedTrendDirection}
                onChange={setSelectedTrendDirection}
                data={[
                  { label: 'All', value: 'All' },
                  { label: 'Rising', value: 'Rising' },
                  { label: 'Falling', value: 'Falling' },
                  { label: 'Stable', value: 'Stable' },
                ]}
              />
            </Group>
          }
          children={<DeepVelocityChart data={filteredData} />}
        />
      </Grid.Col>
    </Grid>
  );
}

export default DeepVelocityCard;
