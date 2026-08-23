import type { EchoChamber } from '@/shared/types/analysis/media_bias/EchoChamber.ts';
import { Box, Flex, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import ContentDistribution
  from '@/components/MediaBias/ContentDuplication/components/DuplicationChart/components/ContentDistribution.tsx';
import EChartContainer from '@/components/generic/EChartContainer';
import DashboardSection from '@/components/generic/DashboardSection';

interface PropagationFallbackProps {
  data: EchoChamber[];
  height?: number;
}

const PropagationFallback = ({
  data,
  height = 500,
}: PropagationFallbackProps) => {
  const publisherData = useMemo(() => {
    const map = new Map<
      string,
      {
        articles: number;
        clusters: number;
      }
    >();

    for (const item of data) {
      for (const publisher of item.publishers) {
        const existing = map.get(publisher.publisher) ?? {
          articles: 0,
          clusters: 0,
        };

        existing.articles += publisher.articleCount;

        existing.clusters += 1;

        map.set(publisher.publisher, existing);
      }
    }

    return [...map.entries()]
      .map(([publisher, value]) => ({
        publisher,
        ...value,
      }))
      .sort((a, b) => b.articles - a.articles);
  }, [data]);

  const chartOption = useMemo(() => {
    return {
      animationDuration: 500,

      grid: {
        left: 100,
        right: 70,
        top: 20,
        bottom: 40,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const item = publisherData[params[0].dataIndex];

          return `
            <strong>${item.publisher}</strong>
            <br/>
            Articles:
            <strong>${item.articles}</strong>
            <br/>
            Content clusters:
            <strong>${item.clusters}</strong>
          `;
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
        nameLocation: 'middle',
        nameGap: 30,
        minInterval: 1,
      },

      yAxis: {
        type: 'category',
        inverse: true,

        data: publisherData.map((item) => item.publisher),
      },

      series: [
        {
          type: 'bar',

          data: publisherData.map((item) => item.articles),

          barMaxWidth: 28,

          itemStyle: {
            color: '#69db7c',
            borderRadius: [0, 5, 5, 0],
          },

          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
          },
        },
      ],
    };
  }, [publisherData]);

  return (
      <DashboardSection
        title='Publisher Propagation'
        description='Trace how shared stories spread across publishers and reveal connections between content sources.'
        children={
          <Flex direction='column' h='100%'>
            <EChartContainer option={chartOption} height={height} />
            <Box mt='auto'>
              {' '}
              <Text size='xs' c='dimmed'>
                No stories are currently shared across multiple publishers.
                Showing publisher coverage instead.
              </Text>
            </Box>
          </Flex>
        }
      />
  );
};


export default PropagationFallback;