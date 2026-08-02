import React, { useMemo } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import type { GlobalTrendType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import { NEWS_TOPIC_COLORS, NEWS_TOPICS } from '@/shared/constants/NewsTopics.ts';
import {
  formatDate,
  getGlobalTrendsData,
} from '@/components/Overview/PrimaryMacroTrends/GlobalTrends/components/GlobalTrendsChart/globalTrendsChart.utils.ts';
import GlobalTrendsLegend
  from '@/components/Overview/PrimaryMacroTrends/GlobalTrends/components/GlobalTrendsChart/components/GlobalTrendsLegend.tsx';
import { Stack } from '@mantine/core';
import {GRID} from './globalTrendChart.config.ts'


interface GlobalTrendsChartProps {
  data: GlobalTrendType;
  height?: number | string;
}

const GlobalTrendsChart = ({ data, height = 550 }: GlobalTrendsChartProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const { counts, percentages } = getGlobalTrendsData(data);

    const dates = data.timeline.map((item) => formatDate(item.date));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const monthIndex = params[0].dataIndex;

          let content = `<strong>${params[0].axisValue}</strong><br/>`;

          params.forEach((item: any) => {
            const count = counts[item.seriesIndex][monthIndex];

            if (count > 0) {
              content += `
                ${item.marker}
                ${item.seriesName.charAt(0).toUpperCase() + item.seriesName.slice(1)}: 
                ${count} articles 
                (${(item.value * 100).toFixed(1)}%)
                <br/>
              `;
            }
          });

          return content;
        },
      },

      grid: GRID,

      yAxis: {
        type: 'category',
        data: dates,
      },

      xAxis: {
        type: 'value',
        max: 1,
        axisLabel: {
          formatter: (value: number) => `${Math.round(value * 100)}%`,
        },
      },

      series: NEWS_TOPICS.map((topic, index) => ({
        name: topic,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        itemStyle: {
          color: NEWS_TOPIC_COLORS[topic],
        },
        data: percentages[index],

        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const value = params.value;
            if (value < 0.03) {
              return '';
            }

            return `${Math.round(value * 100)}%`;
          },
        },
      })),
    };
  }, [data]);

  return <Stack>
    <EChartContainer option={chartOption} height={height} />
    <GlobalTrendsLegend/>
  </Stack>;
};

export default GlobalTrendsChart;
