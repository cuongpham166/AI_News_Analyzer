import {
  Box,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import DeepVelocityChart from '@/components/Overview/DeepVelocity/components/DeepVelocityChart';
import deepVelocityData from '@/shared/test_data/DeepVelocityData.ts';
import {calculateMomentumScore,calculateTrendDirection} from '@/shared/utils/calculateDeepVelocityMetrics.ts';
import { useMemo, useState } from 'react';

function DeepVelocityCard() {
  const chartData = useMemo(() => {
    return deepVelocityData.data.map((item) => ({
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
  }, []);

  const [selectedTrendDirection, setSelectedTrendDirection] =
    useState<string>('Rising');

  const filteredData = useMemo(() => {
    if (selectedTrendDirection === 'All') return chartData;
    return chartData.filter(
      (item) => item.trendDirection === selectedTrendDirection,
    );
  }, [chartData, selectedTrendDirection]);

  return (
    <Grid gutter='md'>
      <Grid.Col span={12}>
        <MetricCard>
          <Stack gap='md'>
            <Group justify='space-between'>
              <Title order={5} mb='xs' c={ThemeColors.primary}>
                Deep Velocity Analytics Matrix
              </Title>
              <Group gap='xs'>
                <Text size='sm' c={ThemeColors.primary} fw={500}>
                  Trend Direction:
                </Text>
                <SegmentedControl
                  value={selectedTrendDirection}
                  onChange={(val) => setSelectedTrendDirection(val)}
                  data={[
                    { label: 'All', value: 'All' },
                    { label: 'Rising', value: 'Rising' },
                    { label: 'Falling', value: 'Falling' },
                    { label: 'Stable', value: 'Stable' },
                  ]}
                />
              </Group>
            </Group>

            <Box style={{ flex: 1, minHeight: 0 }}>
              <DeepVelocityChart data={filteredData} />
            </Box>
          </Stack>
        </MetricCard>
      </Grid.Col>
    </Grid>
  );
}

export default DeepVelocityCard;
