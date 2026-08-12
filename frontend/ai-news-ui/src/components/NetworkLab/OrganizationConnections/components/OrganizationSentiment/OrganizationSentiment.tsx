import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/AllianceNetwork.ts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

interface OrganizationSentimentProps {
  data: AllianceNetwork[];
  height?: number;
}

const OrganizationSentiment = ({ data, height = 450 }:OrganizationSentimentProps) => {

  const chartOption = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort((a, b) => b.avgSentiment - a.avgSentiment);
    const getPairLabel = (item: AllianceNetwork) =>
      `${item.orgA} ↔ ${item.orgB}`;

    return {
      animationDuration: 500,

      grid: {
        left: 280,
        right: 50,
        top: 20,
        bottom: 40,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const item = sorted[index];

          return `
          <strong>${item.orgA}</strong><br/>
          ${item.orgB}<br/>
          <br/>
          Avg. sentiment: <strong>${item.avgSentiment.toFixed(2)}</strong><br/>
          Shared articles: ${item.sharedArticles}
        `;
        },
      },

      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Average sentiment',
        nameLocation: 'middle',
        nameGap: 30,

        axisLabel: {
          formatter: (value: number) => value.toFixed(1),
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sorted.map(getPairLabel),

        axisLabel: {
          width: 260,
          overflow: 'truncate',
        },
      },

      series: [
        {
          type: 'bar',
          data: sorted.map((item) => item.avgSentiment),
          barMaxWidth: 24,

          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => Number(params.value).toFixed(2),
          },
        },
      ],

    };
  }, [data]);
  return (
    <DashboardSection
      title='Shared coverage sentiment'
      description='Compare the sentiment associated with coverage shared between organizations.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default OrganizationSentiment;
