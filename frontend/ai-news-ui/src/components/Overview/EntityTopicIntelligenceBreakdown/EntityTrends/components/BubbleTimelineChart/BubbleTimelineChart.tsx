import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';

import {getBubbleTimelineData} from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/BubbleTimelineChart/bubbleTimeline.utils.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';

interface BubbleTimelineChartProps {
  data: GlobalEntitiesTrendsType;
  height?: number | string;
}
const BubbleTimelineChart = ({
  data,
  height = 500,
}: BubbleTimelineChartProps) => {
  const bubbleTimelineData = getBubbleTimelineData(data);

  const chartOption = useMemo<EChartsOption>(() => {
    const dates = bubbleTimelineData.map((item) => item.date);
    const entities = [
      ...new Set(bubbleTimelineData.map((item) => item.entity)),
    ];
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const item = params.data;

          return `
          <strong>${item[3]}</strong><br/>
          Date: ${dates[item[0]]}<br/>
          Mentions: ${item[2]}<br/>
          Sentiment: ${item[4].toFixed(2)}
        `;
        },
      },

      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'category',
        data: entities,
        inverse: true,
      },
      visualMap: {
        min: 0,
        max: 1,
        dimension: 4,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        text: ['Positive', 'Negative'],
        inRange: {
          color: ['#d73027', '#fee08b', '#1a9850'],
        },
      },

      series: [
        {
          type: 'scatter',
          emphasis: {
            scale: true,
            itemStyle: {
              borderColor: '#000',
              borderWidth: 2,
            },
          },
          data: bubbleTimelineData.map((item) => [
            dates.indexOf(item.date),
            entities.indexOf(item.entity),
            item.count,
            item.entity,
            item.sentiment,
          ]),

          symbolSize: (value) => {
            return Math.sqrt(value[2]) * 15;
          },
        },
      ],
    };
  }, [bubbleTimelineData]);
  return (
    <Stack gap='lg'>
      <Stack gap={2}>
        <Title order={6} c={ThemeColors.primary}>
          Global Entity Trends Over Time
        </Title>
        <Text size='sm' c='dimmed' lh={1.2}>
          Top entities by news mentions for each time period. Bubble size
          represents mention count; color represents average article sentiment.
        </Text>
      </Stack>
      <EChartContainer option={chartOption} height={height} />
    </Stack>
  );
};

export default BubbleTimelineChart;
