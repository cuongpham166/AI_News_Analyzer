import { Paper, Text, Group, Tooltip, ActionIcon, Flex, Box } from '@mantine/core';
import type {
  InfluencerNetworkType,
  InfluencerType,
} from '@/shared/interfaces/analysis/EntityNetworkLab/InfluencerNetworkType.ts';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';
import { InfoIcon } from '@phosphor-icons/react';
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import {
  escapeHtml,
  createCustomChartTooltip,
} from '@/shared/utils/createChartTooltip.ts';

interface TopInfluencersBarRankingProps {
  influencerNetwork?: InfluencerNetworkType[];
  height?: number;
}
const TopInfluencersBarRanking = ({
  influencerNetwork,
  height = 600,
}: TopInfluencersBarRankingProps) => {
  const hasData = influencerNetwork && influencerNetwork.length > 0

  const influencers = useMemo<InfluencerType[]>(() => {
    const influencerMap = new Map<string, InfluencerType>();

    if (influencerNetwork)
      influencerNetwork.forEach((item) => {
        [item.personA, item.personB].forEach((person) => {
          if (!influencerMap.has(person)) {
            influencerMap.set(person, {
              name: person,
              connections: 0,
              sharedArticles: 0,
              influenceScore: 0,
            });
          }

          const influencer = influencerMap.get(person)!;

          influencer.connections += 1;
          influencer.sharedArticles += item.sharedArticles;
        });
      });

    const values = Array.from(influencerMap.values());

    const maxConnections = Math.max(...values.map((x) => x.connections), 1);

    const maxArticles = Math.max(...values.map((x) => x.sharedArticles), 1);

    return values
      .map((item) => ({
        ...item,

        influenceScore:
          (item.connections / maxConnections) * 50 +
          (item.sharedArticles / maxArticles) * 50,
      }))
      .sort((a, b) => b.influenceScore - a.influenceScore)
      .slice(0, 10);
  }, [influencerNetwork]);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if(!hasData) {
      return undefined;
    }

    return {
      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          const item = influencers[params.dataIndex];
          const customContent = `
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Influence Score</span>
                    <strong style="text-align:right;white-space:nowrap;">${item.influenceScore.toFixed(1)}</strong>
             </div>
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Shared Articles</span>
                    <strong style="text-align:right;white-space:nowrap;">${item.sharedArticles}</strong>
             </div>
             <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                    <span style="color:#475569;">Connection${(item.connections ?? 0) === 1 ? '' : 's'}</span>
                    <strong style="text-align:right;white-space:nowrap;">${item.connections}</strong>
             </div>
            `;

          return createCustomChartTooltip({
            title: item.name,
            customContent: customContent,
          });
        },
      },

      grid: GRID_CONFIG,

      xAxis: {
        type: 'value',

        max: 100,

        axisLabel: {
          formatter: '{value}',
        },

        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,

        data: influencers.map((item) => item.name),

        axisLabel: {
          width: 120,
          overflow: 'truncate',
        },
      },

      series: [
        {
          type: 'bar',

          data: influencers.map((item, index) => ({
            value: Number(item.influenceScore.toFixed(1)),
            name: item.name,
          })),

          barWidth: 18,

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              const item = influencers[params.dataIndex];

              return `${item.influenceScore.toFixed(1)} (${item.connections})`;
            },
          },

          itemStyle: {
            borderRadius: [0, 6, 6, 0],
          },

          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  }, [hasData, influencers]);

  return (
    <DashboardSection
      title='Top Influencers by Network Influence'
      description='Rank the most influential entities by an influence score combining connection count and shared article activity. Higher scores indicate a stronger presence in the entity network.'
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No top influencers data were found for this publisher.'
              />
            )}
          </Box>
          <Text size='xs' c='dimmed' mb='sm'>
            Ranked by network connections and shared article activity.
          </Text>
        </Flex>
      }
    />
  );
}


export default TopInfluencersBarRanking;