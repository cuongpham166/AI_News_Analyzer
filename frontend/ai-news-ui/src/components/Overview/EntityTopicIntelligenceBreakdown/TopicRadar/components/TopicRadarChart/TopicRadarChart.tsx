import React, { useMemo, useState } from 'react';
import { Stack } from '@mantine/core';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import TopRadarLegend
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar/components/TopicRadarChart/components/TopRadarLegend.tsx';
import type { EChartsOption } from 'echarts';
import { topicColors } from '@/shared/constants/ChartColors.ts';
import {
  createChartTitle,
  createTooltip,
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar/components/TopicRadarChart/topRadar.utils.ts';
import {
  EMPHASIS
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar/components/TopicRadarChart/topRadar.config.ts';

interface TopicRadarChartProps {
  data: TopicRadarType;
  height?: number | string;
}
const TopicRadarChart = ({ data, height = 420 }:TopicRadarChartProps) => {
  const [hiddenTopics, setHiddenTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topic: string) => {
    setHiddenTopics((prev) => {
      const next = new Set(prev);

      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }

      return next;
    });
  };

  const chartOption = useMemo<EChartsOption>(() => {
    const distribution = data.distribution
      .filter((item) => !hiddenTopics.has(item.name))
      .sort((a, b) => b.count - a.count);

    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    return {
      title: createChartTitle(total),
      tooltip: createTooltip(),

      series: [
        {
          name: 'Topics',
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '50%'],
          data: distribution.map((item) => ({
            name: item.name,
            value: item.count,
            itemStyle: {
              color: topicColors.get(item.name),
            },
          })),

          label: {
            show: false,
          },

          labelLine: {
            show: false,
          },

          emphasis: EMPHASIS,
        },
      ],
    };
  }, [data, hiddenTopics]);

  return (
    <Stack>
      <EChartContainer option={chartOption} height={height} />
      <TopRadarLegend
        data={data}
        onToggle={toggleTopic}
        hiddenTopics={hiddenTopics}
      />
    </Stack>
  );
};

export default TopicRadarChart;