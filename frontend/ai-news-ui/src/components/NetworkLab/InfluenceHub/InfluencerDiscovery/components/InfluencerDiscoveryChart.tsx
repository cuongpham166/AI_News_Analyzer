import type {InfluencerNetworkType} from '@/shared/interfaces/analysis/EntityNetworkLab/InfluencerNetworkType.ts';
import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';

interface InfluencerDiscoveryChartProps {
  data: InfluencerNetworkType[];
  height?: number;
}
const InfluencerDiscoveryChart = ({data, height = 600,}:InfluencerDiscoveryChartProps) => {

  const chartOption = useMemo<EChartsOption>(() => {
    const nodesMap = new Map<string, any>();
    const links: any[] = [];

    const connections: Record<string, number> = {};

    data.forEach((item) => {
      if (!nodesMap.has(item.personA)) {
        nodesMap.set(item.personA, {
          name: item.personA,
        });
      }

      if (!nodesMap.has(item.personB)) {
        nodesMap.set(item.personB, {
          name: item.personB,
        });
      }

      links.push({
        source: item.personA,
        target: item.personB,
        value: item.sharedArticles,
        avgSentiment: item.avgSentiment,
        volatility: item.volatility,
      });

      connections[item.personA] =
        (connections[item.personA] || 0) + 1;

      connections[item.personB] =
        (connections[item.personB] || 0) + 1;
    });

    const nodes = Array.from(nodesMap.values()).map((node) => ({
      ...node,
      symbolSize: Math.min(
        Math.max((connections[node.name] || 1) * 12, 20),
        60
      ),
    }));

    // sentiment color for relationships
    links.forEach((link) => {
      if (link.avgSentiment >= 0.8) {
        link.lineStyle = {
          color: '#51cf66',
        };
      } else if (link.avgSentiment >= 0.5) {
        link.lineStyle = {
          color: '#fcc419',
        };
      } else {
        link.lineStyle = {
          color: '#ff6b6b',
        };
      }
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            const item = params.data;

            return `
              <div style="font-weight:600;margin-bottom:6px;">
                ${item.source} ↔ ${item.target}
              </div>

              <div style="font-size:12px;">
                • <strong>Shared Articles:</strong>
                ${item.value}<br/>

                • <strong>Avg Sentiment:</strong>
                ${item.avgSentiment}<br/>

                • <strong>Volatility:</strong>
                ${item.volatility}
              </div>
            `;
          }

          return `
            <div style="font-weight:600;">
              ${params.data.name}
            </div>
            <div style="font-size:12px;">
              Connections:
              ${connections[params.data.name] || 0}
            </div>
          `;
        },
      },

      animationDuration: 1500,

      series: [
        {
          type: 'graph',

          layout: 'force',

          roam: true,

          draggable: true,

          force: {
            repulsion: 300,
            edgeLength: [80, 160],
            gravity: 0.15,
          },

          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 11,
          },

          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
            },
          },

          data: nodes,

          links,

          lineStyle: {
            width: 2,
            opacity: 0.8,
            curveness: 0.1,
          },

          itemStyle: {
            color: '#339af0',
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ],
    };
  }, [data]);

  return (
    <EChartContainer
      option={chartOption}
      height={height}
    />
  );
}



export default InfluencerDiscoveryChart;