import type {InfluencerNetworkType} from '@/shared/interfaces/analysis/EntityNetworkLab/InfluencerNetworkType.ts';
import type { EChartsOption } from 'echarts';
import React, { useMemo, useState } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { escapeHtml, createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
interface InfluencerDiscoveryChartProps {
  influencerNetwork?: InfluencerNetworkType[];
  height?: number;
}

const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];


const truncateLabel = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
};

const InfluencerDiscoveryChart = ({
  height = 600,
  influencerNetwork,
}: InfluencerDiscoveryChartProps) => {
  const [limit, setLimit] = useState('10');
  const hasData = influencerNetwork && influencerNetwork.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    const relationships = influencerNetwork
      .slice()
      .sort((a, b) => b.sharedArticles - a.sharedArticles)
      .slice(0, Number(limit));

    const connections = new Map<string, number>();
    const personStrength = new Map<string, number>();

    for (const relationship of relationships) {
      const { personA, personB, sharedArticles } = relationship;

      connections.set(personA, (connections.get(personA) ?? 0) + 1);

      connections.set(personB, (connections.get(personB) ?? 0) + 1);

      personStrength.set(
        personA,
        (personStrength.get(personA) ?? 0) + sharedArticles,
      );

      personStrength.set(
        personB,
        (personStrength.get(personB) ?? 0) + sharedArticles,
      );
    }

    const maxPersonStrength = Math.max(...personStrength.values(), 1);

    const people = [
      ...new Set(relationships.flatMap((item) => [item.personA, item.personB])),
    ];

    const nodes = people.map((person) => {
      const normalizedStrength =
        (personStrength.get(person) ?? 0) / maxPersonStrength;

      return {
        id: person,
        name: person,
        symbolSize: 20 + normalizedStrength * 30,
        itemStyle: {
          color: NEWS_ENTITY_COLORS['person'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      };
    });

    const maxSharedArticles = Math.max(
      ...relationships.map((item) => item.sharedArticles),
      1,
    );

    const links = relationships.map((relationship) => {
      const normalizedStrength =
        relationship.sharedArticles / maxSharedArticles;

      return {
        source: relationship.personA,
        target: relationship.personB,

        value: relationship.sharedArticles,

        avgSentiment: relationship.avgSentiment,

        volatility: relationship.volatility,

        lineStyle: {
          width: 1 + normalizedStrength * 5,
          opacity: 0.7,
        },
      };
    });

    return {
      animationDuration: 800,

      tooltip: {
        trigger: 'item',
        confine: true,

        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            const item = params.data;
            const title = `${escapeHtml(item.source)} ↔ ${escapeHtml(item.target)}`
            const sentimentColor = item.avgSentiment > 0 ? NEWS_SENTIMENT_COLORS["positive"] : NEWS_SENTIMENT_COLORS["negative"];
            const customContent = `
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Shared articles</span>
                    <strong style="text-align:right;white-space:nowrap;">${item.value}</strong>
             </div>
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Avg. sentiment</span>
                    <strong style="text-align:right;white-space:nowrap; color: ${sentimentColor}">${item.avgSentiment.toFixed(2)}</strong>
             </div>
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Volatility</span>
                    <strong style="text-align:right;white-space:nowrap;">${item.volatility.toFixed(2)}</strong>
             </div>
            `;
            return createCustomChartTooltip({
              title: title,
              customContent: customContent,
            });
          }

          const name = params.data.name;
          const customContent = `
            <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Connection${(connections.get(name) ?? 0) === 1 ? '' : 's'}</span>
                    <strong style="text-align:right;white-space:nowrap;">${connections.get(name) ?? 0}</strong>
            </div>
            <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Shared articles</span>
                    <strong style="text-align:right;white-space:nowrap;">${personStrength.get(name) ?? 0}</strong>
            </div>
          `;
          return createCustomChartTooltip({
            title: escapeHtml(name),
            customContent: customContent,
          });
        },
      },

      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,
          data: nodes,
          links,
          force: {
            repulsion:
              Number(limit) >= 20 ? 450 : Number(limit) >= 10 ? 350 : 300,
            edgeLength: Number(limit) >= 20 ? [120, 200] : [100, 180],
            gravity: 0.1,
            layoutAnimation: true,
          },

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) =>
              truncateLabel(params.data.name, Number(limit) >= 20 ? 20 : 28),
            fontSize: Number(limit) >= 20 ? 10 : 11,
            color: '#374151',
          },

          emphasis: {
            focus: 'adjacency',
            label: {
              show: true,
              position: 'right',
              formatter: (params: any) => params.data.name,
              fontSize: 12,
              fontWeight: 600,
            },

            lineStyle: {
              width: 4,
              opacity: 1,
            },
          },

          lineStyle: {
            width: 2,
            opacity: 0.7,
            curveness: 0.1,
          },
        },
      ],
    };
  }, [hasData, influencerNetwork, limit]);

  if (!hasData) {
    return (
      <Text size='sm' c='dimmed' ta='center' py='xl'>
        No influencer network data available.
      </Text>
    );
  }

  return (
    <DashboardSection
      title='Influencer Network'
      description='Explore how entities are connected through shared article coverage, with nodes representing entities and links representing their relationships.'
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
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No influencer data were found.'
              />
            )}
          </Box>
        </Flex>
      }
    />
  );
};



export default InfluencerDiscoveryChart;