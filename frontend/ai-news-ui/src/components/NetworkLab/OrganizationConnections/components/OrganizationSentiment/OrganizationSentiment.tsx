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
import {
  buildAllianceSentimentTooltip
} from '@/components/NetworkLab/OrganizationConnections/components/OrganizationSentiment/organizationSentiment.utils.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface OrganizationSentimentProps {
  allianceNetwork?: AllianceNetwork[];
  height?: number;
}

const OrganizationSentiment = ({
  allianceNetwork, height = 450,
}: OrganizationSentimentProps) => {
  const [limit, setLimit] = useState('10');
  const hasData = Boolean(allianceNetwork && allianceNetwork.length > 0);

  const sortedData = useMemo(() => {
    if (!hasData || !allianceNetwork) return [];
    return [...allianceNetwork]
      .sort((a, b) => Math.abs(b.avgSentiment) - Math.abs(a.avgSentiment))
      .slice(0, Number(limit));
  }, [allianceNetwork, hasData, limit]);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !sortedData.length) {
      return undefined;
    }

    const getPairLabel = (item: AllianceNetwork) =>
      `${item.orgA} - ${item.orgB}`;

    return {
      animationDuration: 500,

      grid: {
        top: 20,
        right: 50,
        bottom: 45,
        left: 20,
        containLabel: true,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: any) => {
          const index = params[0]?.dataIndex;
          const item = sortedData[index];
          return buildAllianceSentimentTooltip(item);
        },
      },

      xAxis: {
        type: 'value',
        min: -1.0,
        max: 1.0,
        name: 'Average Sentiment',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#64748B',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLabel: {
          formatter: (value: number) =>
            value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1),
          color: '#475569',
          fontSize: 11,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#CBD5E1',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F1F5F9',
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sortedData.map(getPairLabel),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          width: 180,
          overflow: 'truncate',
          ellipsis: '…',
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
        },
      },

      series: [
        {
          type: 'bar',
          data: sortedData.map((item) => {
            const val = item.avgSentiment ?? 0;
            const isPositive = val >= 0;

            return {
              value: val,
              itemStyle: {
                color: isPositive
                  ? NEWS_SENTIMENT_COLORS['positive']
                  : NEWS_SENTIMENT_COLORS['negative'],
                borderRadius: isPositive ? [0, 4, 4, 0] : [4, 0, 0, 4],
              },
            };
          }),
          barMaxWidth: 20,

          label: {
            show: true,
            position: 'right',
            distance: 8,
            formatter: (params: any) => {
              const val = Number(params.value);
              return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
            },
            color: '#334155',
            fontSize: 11,
            fontWeight: 600,
          },

          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.15)',
            },
          },
        },
      ],
    };
  }, [sortedData, hasData]);
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
