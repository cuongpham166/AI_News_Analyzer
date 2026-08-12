import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/AllianceNetwork.ts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EmptyChartState
  from '@/components/NetworkLab/OrganizationConnections/components/OrganizationCoverage/components/EmptyChartState.tsx';
interface OrganizationCoverageProps {
  data: AllianceNetwork[];
  height?: number;
}

function hasVariation(
  data: AllianceNetwork[],
  selector: (item: AllianceNetwork) => number,
) {
  return new Set(data.map(selector)).size > 1;
}

const OrganizationCoverage = ({
  data,
  height = 450,
}: OrganizationCoverageProps) => {

  const hasCoverageVariation = hasVariation(
    data,
    (item) => item.sharedArticles,
  );


  const chartOption = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort(
      (a, b) => b.sharedArticles - a.sharedArticles,
    );

    const getPairLabel = (item: AllianceNetwork) =>
      `${item.orgA} ↔ ${item.orgB}`;


    return {
      animationDuration: 500,

      grid: {
        left: 280,
        right: 40,
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
          Shared articles: <strong>${item.sharedArticles}</strong><br/>
          Avg. sentiment: ${item.avgSentiment.toFixed(2)}
        `;
        },
      },

      xAxis: {
        type: 'value',
        min: 0,
        name: 'Shared articles',
        nameLocation: 'middle',
        nameGap: 30,
        minInterval: 1,
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
          data: sorted.map((item) => item.sharedArticles),
          barMaxWidth: 24,

          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },

          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
          },
        },
      ],

    };


  }, [data]);
  return (
    <DashboardSection
      title='Shared coverage'
      description='See which organizations are most closely connected through shared articles.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default OrganizationCoverage;