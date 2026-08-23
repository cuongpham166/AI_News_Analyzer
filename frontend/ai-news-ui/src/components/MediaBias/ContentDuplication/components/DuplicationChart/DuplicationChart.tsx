import {
  getArticleCount,
  hasCrossPublisherPropagation,
} from '@/components/MediaBias/ContentDuplication/components/contentDuplication.utils.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import type { EchoChamber } from '@/shared/types/analysis/media_bias/EchoChamber.ts';
import React, { useMemo } from 'react';
import { Box, Center, Flex, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import ContentClusterList from '@/components/MediaBias/ContentDuplication/components/ContentClusterList.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import type { EChartsOption } from 'echarts';

interface RepeatedContentProps {
  echoChamber?: EchoChamber[];
  height?: number;
}

const DuplicationChart = ({
  echoChamber, height = 420,
}: RepeatedContentProps) => {
  const hasData = echoChamber && echoChamber.length > 0;

  const duplicated = useMemo(() => {
    if (!hasData) {
      return []
    }
    return echoChamber
      .filter(hasCrossPublisherPropagation)
      .map((item) => ({
        ...item,
        articleCount: getArticleCount(item),
      }))
      .sort((a, b) => b.articleCount - a.articleCount);
  }, [echoChamber, hasData]);


  if (duplicated.length === 0) {
    return (
      <Stack>
        <Text size='sm' fw={500} ta='left' c='red'>
          No cross-publisher duplicates are currently detected. Showing the
          underlying content clusters instead.
        </Text>
        <ContentClusterList data={echoChamber ? echoChamber : []} />
      </Stack>
    );
  }

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

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
  }, [duplicated, hasData]);

  return (
    <DashboardSection
      title='Repeated Content'
      description='See which stories appear multiple times and how widely they are duplicated across publishers.'
      children={
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption  ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No news data were found for this selection.'
            />
          )}
        </Box>
      }
    />
  );
};

export default DuplicationChart