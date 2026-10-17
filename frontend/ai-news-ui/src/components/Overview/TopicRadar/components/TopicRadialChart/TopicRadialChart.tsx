import DashboardSection from '@/components/generic/DashboardSection';
import { Flex, Box } from '@mantine/core';
import React, { useMemo } from 'react';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import {NEWS_TOPIC_COLORS} from '@/shared/constants/NewsTopics.ts';
import TopicRadialLegend
  from './components/TopicRadialLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';


interface TopicRadialChartProps {
  data?: TopicRadarType;
  height?: number | string;
}

const TopicRadialChart = ({ data, height }: TopicRadialChartProps) => {
  const distribution = data?.distribution ?? [];
  const totalCount = data?.count ?? 0;

  const sortedDistribution = [...distribution].sort(
    (a, b) => a.count - b.count,
  );

  const hasData = sortedDistribution.length > 0;

  const names = sortedDistribution.map((item) => item.name);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    return {
      polar: {
        radius: ['10%', '90%'],
      },

      grid:GRID_CONFIG,

      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percent = ((params.value / totalCount) * 100).toFixed(1);

          const customContent = `
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Mentions</span>
              <strong style="text-align:right;white-space:nowrap;">
                ${params.value}
                <span style="color:#64748B;font-weight:400;">
                    (${percent}%)
                </span>
              </strong>
            </div>
          
          `;
          return createCustomChartTooltip({
            title: params.name.charAt(0).toUpperCase() + params.name.slice(1),
            customContent: customContent,
          });
        },
      },

      angleAxis: {
        max: totalCount,
        startAngle: 90,
        clockwise: true,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },

      radiusAxis: {
        type: 'category',
        data: names,
        inverse: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: false,
          rotate: 0,
          interval: 0,
          fontSize: 11,
          color: '#666',
        },
      },

      series: [
        {
          type: 'bar',
          data: sortedDistribution.map((item) => ({
            name: item.name,
            value: item.count,
            itemStyle: {
              color: NEWS_TOPIC_COLORS[item.name],
            },
          })),
          label: {
            show: true,
            position: 'insideEnd', // or 'inside', 'insideEnd', etc.
            formatter: ({ value }) => `${value}`,
          },
          coordinateSystem: 'polar',
          name: 'Topics',
          roundCap: true,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.15)',
          },
        },
      ],
    };
  }, [hasData, names, sortedDistribution, totalCount]);
  return (
    <DashboardSection
      title='Topic Overview'
      description='Visual overview of topic distribution'
      children={
        <Flex direction='column' h='100%' gap='sm'>
          {hasData && chartOption ? (
            <>
              <Box style={{ flex: 1, minHeight: 0 }}>
                <EChartContainer option={chartOption} height={height} />
              </Box>
              <TopicRadialLegend />
            </>
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No topics were found for this selection.'
              height={height}
            />
          )}
        </Flex>
      }
    />
  );
};

export default TopicRadialChart;
