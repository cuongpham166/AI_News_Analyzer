import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  TOP_N_OPTIONS,
  truncateLabel,
} from '@/components/NetworkLab/PowerCouples/components/powerCouples.utils.ts';

interface OrganizationSentimentProps {
  allianceNetwork?: AllianceNetwork[];
  height?: number;
}

const OrganizationSentiment = ({
  allianceNetwork, height = 450,
}: OrganizationSentimentProps) => {
  const [limit, setLimit] = useState('10');

  const hasData = allianceNetwork && allianceNetwork.length > 0;

  const chartOption = useMemo<EChartsOption|undefined>(() => {
    if (!hasData) {
      return undefined;
    }
    const sorted = [...allianceNetwork]
      .sort((a, b) => b.avgSentiment - a.avgSentiment)
      .slice(0, Number(limit));

    const getPairLabel = (item: AllianceNetwork) =>
      truncateLabel(item.orgA, 28);

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
  }, [allianceNetwork, hasData, limit]);
  return (
    <DashboardSection
      title='Shared coverage sentiment'
      description='Compare the sentiment associated with coverage shared between organizations.'
      actions={
        <Group gap='sm'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            Show:
          </Text>
          <Select
            value={limit}
            onChange={(value) => setLimit(value ?? '10')}
            data={TOP_N_OPTIONS}
            w={120}
            allowDeselect={false}
          />
        </Group>
      }
      children={
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No organization sentiment data were found.'
            />
          )}
        </Box>
      }
    />
  );
};

export default OrganizationSentiment;
