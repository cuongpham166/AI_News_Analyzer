import DashboardSection from '@/components/generic/DashboardSection';
import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

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
  const hasData = allianceNetwork && allianceNetwork.length > 0;

  const chartOption = useMemo<EChartsOption|undefined>(() => {
    if(!hasData) {
      return undefined;
    }
    const relationships = allianceNetwork
      .slice()
      .sort((a, b) => b.sharedArticles - a.sharedArticles)
      .slice(0, Number(limit));

    if (!relationships.length) {
      return undefined;
    }

    const organizationStrength = new Map<string, number>();

    const connections = new Map<string, number>();

    for (const relationship of relationships) {
      const { orgA, orgB, sharedArticles } = relationship;

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
    }

    const maxOrganizationStrength = Math.max(
      ...organizationStrength.values(),
      1,
    );

    const organizations = [
      ...new Set(relationships.flatMap((item) => [item.orgA, item.orgB])),
    ];

    const nodes = organizations.map((organization) => {
      const normalizedStrength =
        (organizationStrength.get(organization) ?? 0) / maxOrganizationStrength;

      return {
        id: organization,
        name: organization,
        symbolSize: 20 + normalizedStrength * 30,
        itemStyle: {
          color: NEWS_ENTITY_COLORS['organization'],
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
        source: relationship.orgA,
        target: relationship.orgB,
        value: relationship.sharedArticles,
        avgSentiment: relationship.avgSentiment,
        relationship,
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
          if (params.dataType === 'node') {
            const name = params.data.name;

            return `
              <div style="
                min-width: 190px;
                line-height: 1.5;
              ">
                <div style="
                  font-weight: 600;
                  margin-bottom: 6px;
                ">
                  ${escapeHtml(name)}
                </div>

                <div>
                  Connections:
                  <strong>
                    ${connections.get(name) ?? 0}
                  </strong>
                </div>

                <div>
                  Shared articles:
                  <strong>
                    ${organizationStrength.get(name) ?? 0}
                  </strong>
                </div>
              </div>
            `;
          }

          if (params.dataType === 'edge') {
            const relationship = params.data.relationship as AllianceNetwork;

            if (!relationship) {
              return '';
            }

            return `
              <div style="
                min-width: 230px;
                line-height: 1.5;
              ">
                <div style="
                  font-weight: 600;
                  margin-bottom: 4px;
                ">
                  ${escapeHtml(relationship.orgA)}
                </div>

                <div style="
                  color: #6B7280;
                  margin-bottom: 10px;
                ">
                  ↕
                  ${escapeHtml(relationship.orgB)}
                </div>

                <div style="
                  border-top:
                    1px solid #E5E7EB;
                  padding-top: 8px;
                ">
                  <div style="
                    display: flex;
                    justify-content:
                      space-between;
                    gap: 24px;
                  ">
                    <span>
                      Shared articles
                    </span>

                    <strong>
                      ${relationship.sharedArticles}
                    </strong>
                  </div>

                  <div style="
                    display: flex;
                    justify-content:
                      space-between;
                    gap: 24px;
                  ">
                    <span>
                      Avg. sentiment
                    </span>

                    <strong>${relationship.avgSentiment.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
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

          lineStyle: {
            opacity: 0.7,
            curveness: 0.08,
          },

          emphasis: {
            focus: 'adjacency',

            lineStyle: {
              width: 4,
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