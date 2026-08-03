
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import {
  getEntitiesHeatmapData
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntitiesHeatmap/entitiesHeatmap.utils.ts';
import type { EChartsOption } from 'echarts';
{
  /*Color intensity = number of mentions*/
}
interface EntitiesHeatmapProps {
  data: GlobalEntitiesTrendsType;
  height?: number | string;
}
const EntitiesHeatmap = ({data,height=400}:EntitiesHeatmapProps) => {
  const { dates, entities, data: chartData } = getEntitiesHeatmapData(data, 20);
  const maxMentions = Math.max(...chartData.map((item) => item[2]), 1);

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [xIndex, yIndex, mentions, sentiment] = params.data;

          return `
            <strong>${entities[yIndex]}</strong><br/>
            Date: ${dates[xIndex]}<br/>
            Mentions: ${mentions}<br/>
            ${
              sentiment !== null
                ? `Average sentiment: ${sentiment.toFixed(3)}`
                : ''
            }
          `;
        },
      },
      grid: {
        height: '70%',
        top: '10%',
      },

      xAxis: {
        type: 'category',
        data: dates,
        splitArea: {
          show: true,
        },
      },

      yAxis: {
        type: 'category',
        data: entities,
        splitArea: {
          show: true,
        },
      },

      visualMap: {
        min: 0,
        max: maxMentions,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
      },

      series: [
        {
          name: 'Entity Mentions',
          type: 'heatmap',
          data: chartData,

          label: {
            show: true,
            formatter: (params: any) => {
              return params.data[2] || '';
            },
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.5)',
            },
          },
        },
      ],
    };
  }, [chartData, dates, entities, maxMentions]);
  return (
    <Stack gap='lg'>
      <Stack gap={2}>
        <Title order={6} c={ThemeColors.primary}>
          Entity Activity Heatmap
        </Title>
        <Text size='sm' c='dimmed' lh={1.2}>
          Color intensity indicates the number of news articles mentioning each
          entity in each time period.
        </Text>
      </Stack>
      <EChartContainer option={chartOption} height={height} />
    </Stack>
  );
};

export default EntitiesHeatmap;
