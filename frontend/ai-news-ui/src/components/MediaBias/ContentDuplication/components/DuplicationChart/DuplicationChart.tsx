import {
  getArticleCount,
  getPublisherCount,
  hasCrossPublisherPropagation,
} from '@/components/MediaBias/ContentDuplication/components/contentDuplication.utils.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import type { EchoChamber } from '@/shared/types/analysis/EchoChamber.ts';
import { useMemo } from 'react';
import { Box, Center, Flex, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import ContentDistribution
  from '@/components/MediaBias/ContentDuplication/components/DuplicationChart/components/ContentDistribution.tsx';
import EmptyContentState from '@/components/MediaBias/ContentDuplication/components/EmptyContentState.tsx';
import ContentClusterList from '@/components/MediaBias/ContentDuplication/components/ContentClusterList.tsx';
interface RepeatedContentProps {
  data: EchoChamber[];
  height?: number;
}


const DuplicationChart = ({ data, height = 420 }: RepeatedContentProps) => {
  const duplicated = useMemo(() => {
    return data
      .filter(hasCrossPublisherPropagation)
      .map((item) => ({
        ...item,
        articleCount: getArticleCount(item),
      }))
      .sort((a, b) => b.articleCount - a.articleCount);
  }, [data]);

  if (data.length === 0) {
    return (
      <EmptyContentState
        height={height}
        message='No content clusters are available.'
      />
    );
  }

  if (duplicated.length === 0) {
    return (
      <Stack>
        <Text size='sm' fw={500} ta='left' c='red'>
          No cross-publisher duplicates are currently detected. Showing the
          underlying content clusters instead.
        </Text>
        <ContentClusterList data={data} />
      </Stack>
    );
  }

  const chartOption = useMemo(() => {
    return {
      animationDuration: 500,

      grid: {
        left: 300,
        right: 60,
        top: 20,
        bottom: 40,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const item = duplicated[params[0].dataIndex];

          const publishers = item.publishers
            .map(
              (publisher) =>
                `${publisher.publisher}: ${publisher.articleCount}`,
            )
            .join('<br/>');

          return `
            <strong>${item.sampleTitle}</strong>
            <br/><br/>
            Articles:
            <strong>${item.articleCount}</strong>
            <br/>
            Publishers:
            <strong>${item.publishers.length}</strong>
            <br/><br/>
            ${publishers}
          `;
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        minInterval: 1,
      },

      yAxis: {
        type: 'category',
        inverse: true,

        data: duplicated.map((item) => truncate(item.sampleTitle)),

        axisLabel: {
          width: 280,
          overflow: 'truncate',
        },
      },

      series: [
        {
          type: 'bar',

          data: duplicated.map((item) => item.articleCount),

          barMaxWidth: 26,

          itemStyle: {
            color: '#4dabf7',
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
  }, [duplicated]);

  return (
    <DashboardSection
      title='Repeated Content'
      description='See which stories appear multiple times and how widely they are duplicated across publishers.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default DuplicationChart