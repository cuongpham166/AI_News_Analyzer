import { Paper, Text, Group, Tooltip, ActionIcon } from '@mantine/core';
import type {
  InfluencerNetworkType,
  InfluencerType,
} from '@/shared/interfaces/analysis/EntityNetworkLab/InfluencerNetworkType.ts';
import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';
import { InfoIcon } from '@phosphor-icons/react';

interface TopInfluencersBarRankingProps {
  data: InfluencerNetworkType[];
  height?: number;
}
const TopInfluencersBarRanking = ({
  data,
  height = 600,
}: TopInfluencersBarRankingProps) => {
  const influencers = useMemo<InfluencerType[]>(() => {
    const influencerMap = new Map<string, InfluencerType>();

    data.forEach((item) => {
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

        // Normalize metrics so one does not dominate
        influenceScore:
          (item.connections / maxConnections) * 50 +
          (item.sharedArticles / maxArticles) * 50,
      }))
      .sort((a, b) => b.influenceScore - a.influenceScore)
      .slice(0, 10);
  }, [data]);

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          const item = influencers[params.dataIndex];

          return `
            <div style="
              font-weight:600;
              margin-bottom:8px;
            ">
              ${item.name}
            </div>

            <div style="font-size:12px;line-height:20px;">
              • <strong>Influence Score:</strong>
              ${item.influenceScore.toFixed(1)}
              <br/>

              • <strong>Connections:</strong>
              ${item.connections}
              <br/>

              • <strong>Shared Articles:</strong>
              ${item.sharedArticles}
            </div>
          `;
        },
      },

      grid: {
        top: 20,
        right: 80,
        bottom: 30,
        left: 140,
      },

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

            itemStyle: {
              color:
                index === 0 ? '#fa5252' : index < 3 ? '#339af0' : '#91a7ff',
            },
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
  }, [influencers]);

  return (
    <Paper withBorder p='sm' radius='md' mb='md'>
      <Group gap='xs'>
        <Text fw={600} size='sm' mb='xs'>
          Top Influencers
        </Text>
        <Tooltip
          label='
          Influence Score combines connection count
          and shared article activity.
          Higher scores indicate stronger presence
          in the entity network.
        '
          multiline
          w={260}
        >
          <ActionIcon variant='subtle' size='xs' color='gray'>
            <InfoIcon size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <EChartContainer option={chartOption} height={height} />
      <Text size='xs' c='dimmed' mb='sm'>
        Ranked by network connections and shared article activity.
      </Text>
    </Paper>
  );
}


export default TopInfluencersBarRanking;