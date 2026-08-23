import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import {
  buildTooltipChart,
  escapeHtml,
  getConnectionNetworkData,
  type NetworkLink,
  type NetworkNode,
} from './connectionNetwork.utils.tsx';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import ConnectionNetworkLegend
  from '@/components/NetworkLab/PowerCouples/components/ConnectionNetwork/components/ConnectionNetworkLegend.tsx';
import { TOP_N_OPTIONS } from '@/components/NetworkLab/PowerCouples/components/powerCouples.utils.ts';
interface ConnectionNetworkProps {
  powerCouple?: PowerCouple[];
  height?: number | string;
}

const ConnectionNetwork = ({
  powerCouple,height = 420,
}: ConnectionNetworkProps) => {
  const [limit, setLimit] = useState('10');


  const { people, organizations, relationships, nodes, links } = useMemo(
    () => getConnectionNetworkData(powerCouple ?? [], Number(limit)),
    [powerCouple, limit],
  );

  const truncateLabel = (value: string, maxLength = 24) => {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength - 1)}…`;
  };

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!nodes.length || !links.length) {
      return undefined;
    }

    return {
      animation: true,

      tooltip: {
        trigger: 'item',
        confine: true,

        formatter: (params: any) => {
          return buildTooltipChart(params);
        },
      },

      grid: {
        top: 35,
        right: 20,
        bottom: 20,
        left: 20,
      },

      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,
          data: nodes,
          links: links,
          categories: [
            {
              name: 'Person',
              itemStyle: {
                color: NEWS_ENTITY_COLORS['person'],
              },
            },
            {
              name: 'Organization',
              itemStyle: {
                color: NEWS_ENTITY_COLORS['organization'],
              },
            },
          ],

          force: {
            repulsion: 350,

            edgeLength: [100, 180],

            gravity: 0.12,

            layoutAnimation: true,
          },

          lineStyle: {
            opacity: 0.65,
            curveness: 0.08,
          },

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              return truncateLabel(
                params.data.name,
                Number(limit) >= 20 ? 20 : 28,
              );
            },
            fontSize: Number(limit) >= 20 ? 10 : 11,
            color: '#374151',
          },

          emphasis: {
            focus: 'adjacency',
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              fontSize: 12,
              fontWeight: 600,
            },

            lineStyle: {
              width: 4,
              opacity: 1,
            },
          },
        },
      ],
    };
  }, [nodes, links, limit]);

  return (
    <DashboardSection
      title='Connection network'
      description='Explore the links between people and organizations and discover shared connections.'
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
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            <EChartContainer option={chartOption} height={height} />
          </Box>
          <ConnectionNetworkLegend/>
        </Flex>
      }
    />
  );
};


export default ConnectionNetwork;