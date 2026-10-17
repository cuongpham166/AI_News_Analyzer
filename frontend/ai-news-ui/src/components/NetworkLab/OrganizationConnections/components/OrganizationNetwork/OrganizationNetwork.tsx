import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import {
  getSentimentColor,
  getSentimentLabel,
} from '@/components/NetworkLab/OrganizationConnections/components/OrganizationNetwork/organizationNetwork.utils.ts';
import {
  buildTooltipChart
} from '@/components/NetworkLab/OrganizationConnections/components/OrganizationNetwork/organizationNetwork.utils.ts';

interface OrganizationNetworkProps {
  allianceNetwork?: AllianceNetwork[];
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const OrganizationNetwork = ({
  allianceNetwork, height = 450,
}: OrganizationNetworkProps) => {
  const [limit, setLimit] = useState('10');
  const hasData = Boolean(allianceNetwork && allianceNetwork.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !allianceNetwork) {
      return undefined;
    }

    const relationships = allianceNetwork
      .slice()
      .sort((a, b) => b.sharedArticles - a.sharedArticles)
      .slice(0, Number(limit));

    if (!relationships.length) {
      return undefined;
    }

    // Node Metric Maps
    const organizationStrength = new Map<string, number>();
    const connections = new Map<string, number>();
    const nodePositiveCount = new Map<string, number>();
    const nodeConflictCount = new Map<string, number>();

    for (const rel of relationships) {
      const {
        orgA,
        orgB,
        sharedArticles,
        positiveArticles = 0,
        conflictArticles = 0,
      } = rel;

      organizationStrength.set(
        orgA,
        (organizationStrength.get(orgA) ?? 0) + sharedArticles,
      );
      organizationStrength.set(
        orgB,
        (organizationStrength.get(orgB) ?? 0) + sharedArticles,
      );

      connections.set(orgA, (connections.get(orgA) ?? 0) + 1);
      connections.set(orgB, (connections.get(orgB) ?? 0) + 1);

      nodePositiveCount.set(
        orgA,
        (nodePositiveCount.get(orgA) ?? 0) + positiveArticles,
      );
      nodePositiveCount.set(
        orgB,
        (nodePositiveCount.get(orgB) ?? 0) + positiveArticles,
      );

      nodeConflictCount.set(
        orgA,
        (nodeConflictCount.get(orgA) ?? 0) + conflictArticles,
      );
      nodeConflictCount.set(
        orgB,
        (nodeConflictCount.get(orgB) ?? 0) + conflictArticles,
      );
    }

    const maxOrganizationStrength = Math.max(
      ...organizationStrength.values(),
      1,
    );

    const maxSharedArticles = Math.max(
      ...relationships.map((item) => item.sharedArticles),
      1,
    );

    const organizations = [
      ...new Set(relationships.flatMap((item) => [item.orgA, item.orgB])),
    ];

    const nodes = organizations.map((organization) => {
      const strength = organizationStrength.get(organization) ?? 0;
      const normalizedStrength = strength / maxOrganizationStrength;

      return {
        id: organization,
        name: organization,
        symbolSize: 22 + normalizedStrength * 32,
        itemStyle: {
          color: NEWS_ENTITY_COLORS.organization,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: 'rgba(0,0,0,0.1)',
        },
        connectionsCount: connections.get(organization) ?? 0,
        sharedArticlesTotal: strength,
        positiveTotal: nodePositiveCount.get(organization) ?? 0,
        conflictTotal: nodeConflictCount.get(organization) ?? 0,
      };
    });

    const links = relationships.map((relationship) => {
      const normalizedStrength =
        relationship.sharedArticles / maxSharedArticles;
      const sentiment = relationship.avgSentiment ?? 0;
      const strokeColor = getSentimentColor(sentiment);

      return {
        source: relationship.orgA,
        target: relationship.orgB,
        value: relationship.sharedArticles,
        avgSentiment: sentiment,
        relationship,
        lineStyle: {
          color: strokeColor,
          width: 1.5 + normalizedStrength * 5.5,
          opacity: 0.75,
          curveness: 0.08,
        },
      };
    });

    return {
      animationDuration: 800,

      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: any) => buildTooltipChart(params),
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
            repulsion:
              Number(limit) >= 20 ? 450 : Number(limit) >= 10 ? 350 : 300,
            edgeLength: Number(limit) >= 20 ? [120, 200] : [100, 180],
            gravity: 0.1,
            layoutAnimation: true,
          },

          label: {
            show: true,
            position: 'right',
            distance: 6,
            formatter: (params: any) =>
              truncateLabel(params.data.name, Number(limit) >= 20 ? 20 : 28),
            fontSize: Number(limit) >= 20 ? 10 : 11,
            color: '#334155',
            fontWeight: 500,
          },

          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 5,
              opacity: 1,
            },
            label: {
              show: true,
              position: 'right',
              formatter: (params: any) => params.data.name,
              fontSize: 12,
              fontWeight: 600,
            },
          },
        },
      ],
    };
  }, [allianceNetwork, hasData, limit]);

  return (
    <DashboardSection
      title='Organization network'
      description='Explore how organizations connect through shared coverage.'
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
        <Flex direction='column' h='100%'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No organization network data were found.'
              />
            )}
          </Box>
        </Flex>
      }
    />
  );
};

export default OrganizationNetwork;