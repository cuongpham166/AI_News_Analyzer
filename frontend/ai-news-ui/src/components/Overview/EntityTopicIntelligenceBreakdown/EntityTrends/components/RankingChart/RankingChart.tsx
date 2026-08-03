import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import {
  getRankingChartData
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/RankingChart/rankingChart.utils.ts';
import EChartContainer from '@/components/generic/EChartContainer';

interface RankingChartProps {
  data: GlobalEntitiesTrendsType;
  height?: number | string;
}
const RankingChart = ({ data, height = 500 }:RankingChartProps) => {
  const rankingChartData = getRankingChartData(data).slice(0, 20);
  const chartOption = useMemo<EChartsOption>(() => {
    const result = rankingChartData.map(({ entity, mentions, sentiment }) => [
      entity,
      mentions,
      sentiment,
    ]);
    return {
      xAxis: {
        type: 'value',
        name: 'Mentions',
      },
      yAxis: {
        type: 'category',
        inverse: true,
        axisLabel: { interval: 0 },
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },

      dataset: [
        {
          dimensions: ['entity', 'mentions', 'sentiment'],
          source: result,
        },
      ],
      series: {
        type: 'bar',
        encode: { x: 'mentions', y: 'entity' },
        label: {
          show: true,
          position: 'right',
          formatter: (params) => params.value[1],
          color: '#495057',
          fontWeight: 600,
        },
      },
    };
  }, [rankingChartData]);
  return (
    <Stack gap='lg'>
      <Stack gap={2}>
        <Title order={6} c={ThemeColors.primary}>
          Most Mentioned Entities
        </Title>
        <Text size='sm' c='dimmed' lh={1.2}>
          Entities ranked by total mentions across the returned time buckets.
        </Text>
      </Stack>
      <EChartContainer option={chartOption} height={height} />
    </Stack>
  );
};

export default RankingChart;
