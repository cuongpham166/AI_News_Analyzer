import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/AllianceNetwork.ts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

interface OrganizationNetworkProps {
  data: AllianceNetwork[];
  height?: number;
}

const OrganizationNetwork = ({ data, height = 450 }:OrganizationNetworkProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const nodeMap = new Map<string, {
        id: string;
        name: string;
        value: number;
      }>();

    for (const item of data) {
      if (!nodeMap.has(item.orgA)) {
        nodeMap.set(item.orgA, {
          id: item.orgA,
          name: item.orgA,
          value: 0,
        });
      }

      if (!nodeMap.has(item.orgB)) {
        nodeMap.set(item.orgB, {
          id: item.orgB,
          name: item.orgB,
          value: 0,
        });
      }

      nodeMap.get(item.orgA)!.value += item.sharedArticles;
      nodeMap.get(item.orgB)!.value += item.sharedArticles;
    }

    const nodes = [...nodeMap.values()];

    const links = data.map((item) => ({
      source: item.orgA,
      target: item.orgB,
      value: item.sharedArticles,

      lineStyle: {
        width: Math.max(1, Math.min(8, item.sharedArticles)),
      },
    }));

    return {
      animationDuration: 700,

      tooltip: {
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return `
            <strong>${params.data.name}</strong><br/>
            Connection weight: ${params.data.value}
          `;
          }

          if (params.dataType === 'edge') {
            const item = data.find(
              (d) =>
                (d.orgA === params.data.source &&
                  d.orgB === params.data.target) ||
                (d.orgA === params.data.target &&
                  d.orgB === params.data.source),
            );

            if (!item) return '';

            return `
            <strong>${item.orgA}</strong><br/>
            ${item.orgB}<br/>
            <br/>
            Shared articles: ${item.sharedArticles}<br/>
            Avg. sentiment: ${item.avgSentiment.toFixed(2)}
          `;
          }

          return '';
        },
      },

      series: [
        {
          type: 'graph',
          layout: 'force',

          data: nodes,

          links,

          roam: true,
          draggable: true,

          force: {
            repulsion: 350,
            gravity: 0.05,
            edgeLength: 140,
            friction: 0.1,
          },

          symbolSize: (value: number) =>
            Math.max(24, Math.min(60, 20 + value * 4)),

          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
          },

          lineStyle: {
            color: 'source',
            opacity: 0.6,
            curveness: 0.05,
          },

          emphasis: {
            focus: 'adjacency',

            lineStyle: {
              width: 4,
            },

            label: {
              show: true,
            },
          },
        },
      ],

    };
  }, [data]);

  return (
    <DashboardSection
      title='Organization network'
      description='Explore how organizations connect through shared coverage.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default OrganizationNetwork;