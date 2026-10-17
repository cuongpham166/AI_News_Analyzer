import type { NarrativeBridge } from '@/shared/types/analysis/network_lab/NarrativeBridge.ts';
import {
  Text,
  Box,
  Flex,
} from '@mantine/core';
import React, { useMemo, useState } from 'react';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import DashboardSection from '@/components/generic/DashboardSection';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import {
  getSentimentColor,
  buildNarrativeBridgeChartTooltip,
  type SankeyNode,
  type SankeyLink,
} from '@/components/NetworkLab/NarrativeBridge/components/NarrativeBridgeChart/narrativeBridgeChart.utils.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

interface NarrativeBridgeProps {
  narrativeBridge?: NarrativeBridge[];
  height?: number | string;
  limit?: string;
}

const NarrativeBridgeChart = ({
  height = 500,
  limit = '10',
  narrativeBridge,
}: NarrativeBridgeProps) => {
  const hasData = Boolean(narrativeBridge && narrativeBridge.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !narrativeBridge) {
      return undefined;
    }

    const parsedLimit =
      typeof limit === 'string' ? parseInt(limit, 10) || 15 : limit;

    const topData = [...narrativeBridge]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, parsedLimit);

    const personNodesSet = new Set<string>();
    const keyphraseNodesSet = new Set<string>();

    topData.forEach((item) => {
      personNodesSet.add(item.person);
      keyphraseNodesSet.add(`${item.keyPhrase} `);
    });

    const nodes: SankeyNode[] = [
      ...Array.from(personNodesSet).map((name) => ({
        name,
        category: 'person' as const,
        itemStyle: { color: NEWS_ENTITY_COLORS['person'] },
      })),
      ...Array.from(keyphraseNodesSet).map((name) => ({
        name,
        category: 'keyphrase' as const,
        itemStyle: { color: NEWS_ENTITY_COLORS['keyphrase'] },
      })),
    ];

    const links: SankeyLink[] = topData.map((item) => {
      const linkColor = getSentimentColor(item.avgSentiment);

      return {
        source: item.person,
        target: `${item.keyPhrase} `,
        value: item.frequency,
        positiveVolume: item.positiveVolume,
        negativeVolume: item.negativeVolume,
        avgSentiment: item.avgSentiment,
        stabilityScore: item.stabilityScore,
        lineStyle: {
          color: linkColor,
          opacity: 0.45,
        },
      };
    });

    return {
      animationDuration: 600,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',
        formatter: (params: any) => buildNarrativeBridgeChartTooltip(params),
      },

      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency',
          },
          nodeWidth: 14,
          nodeGap: 18,
          draggable: true,
          label: {
            color: '#334155',
            fontSize: 12,
            fontWeight: 500,
            formatter: (params: any) => params.name.trim(),
          },
          lineStyle: {
            curveness: 0.5,
          },
          data: nodes,
          links: links,
        },
      ],
    };
  }, [hasData, narrativeBridge, limit]);

  if (!hasData) {
    return (
      <Text size='sm' c='dimmed' ta='center' py='xl'>
        No influencer network data available.
      </Text>
    );
  }

  return (
    <DashboardSection
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No narrative bridge data available.'
              />
            )}
          </Box>
        </Flex>
      }
    />
  );
};

export default NarrativeBridgeChart;
