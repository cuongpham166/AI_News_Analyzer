import React, { useMemo, useState } from 'react';
import { Stack, Text, Title, Flex, Box } from '@mantine/core';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import TopRadarLegend
  from '@/components/Overview/TopicRadar/components/TopicRadarChart/components/TopRadarLegend.tsx';
import type { EChartsOption } from 'echarts';
import {
  NEWS_TOPIC_COLORS,
} from '@/shared/constants/NewsTopics.ts';
import {
  createChartTitle,
} from '@/components/Overview/TopicRadar/components/TopicRadarChart/topRadar.utils.ts';
import {
  EMPHASIS
} from '@/components/Overview/TopicRadar/components/TopicRadarChart/topRadar.config.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';


interface TopicRadarChartProps {
  data?: TopicRadarType;
  height?: number | string;
}

const TopicRadarChart = ({ data, height = 420 }: TopicRadarChartProps) => {
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

  const distribution = (data?.distribution ?? [])
    .filter((item) => !hiddenTopics.has(item.name))
    .sort((a, b) => b.count - a.count);

  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  const hasData = distribution.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    return {
      title: createChartTitle(total),

      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
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
                    (${params.percent}%)
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
      grid: GRID_CONFIG,
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
              color: NEWS_TOPIC_COLORS[item.name],
            },
          })),

          label: {
            show: true,
            formatter: '{d}%',
          },

          labelLine: {
            show: true,
          },

          emphasis: EMPHASIS,
        },
      ],
    };
  }, [distribution, total, hasData]);

  return (
    <DashboardSection
      title='Topic Share'
      description="Shows each topic's percentage of the total"
    >
      <Flex direction='column' h='100%' gap='sm'>
        {hasData && chartOption ? (
          <>
            <Box style={{ flex: 1, minHeight: 0 }}>
              <EChartContainer option={chartOption} height={height} />
            </Box>
            <TopRadarLegend
                data={data}
                onToggle={toggleTopic}
                hiddenTopics={hiddenTopics}
            />
          </>
        ) : (
          <EmptyDataCard
            title='No data available'
            description='No topics were found for this selection.'
            height={height}
          />
        )}
      </Flex>
    </DashboardSection>
  );
};

export default TopicRadarChart;