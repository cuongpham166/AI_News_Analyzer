import DashboardSection from '@/components/generic/DashboardSection';
import type { EchoChamber } from '@/shared/types/analysis/EchoChamber.ts';
import { useMemo } from 'react';
import {
  getArticleCount,
  truncate,
} from '@/components/MediaBias/ContentDuplication/components/contentDuplication.utils.ts';
import { Box, Center, Flex, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import EmptyContentState from '@/components/MediaBias/ContentDuplication/components/EmptyContentState.tsx';
import ContentClusterList from '@/components/MediaBias/ContentDuplication/components/ContentClusterList.tsx';
interface PublisherPropagationProps {
  data: EchoChamber[];
  height?: number;
}
const NarrativeSpreadChart = ({
  data,
  height = 500,
}: PublisherPropagationProps) => {
  const propagationData = useMemo(() => {
    return data.filter(
      (item) => item.publishers.length > 1 && getArticleCount(item) > 1,
    );
  }, [data]);

  if (data.length === 0) {
    return (
      <EmptyContentState
        height={height}
        message='No content clusters are available.'
      />
    );
  }

  if (propagationData.length === 0) {
    return (
      <Stack>
        <Text size='sm' fw={500} ta='left' c='red'>
          No cross-publisher propagation is currently detected. Showing the
          underlying stories and their publishers instead.
        </Text>
        <ContentClusterList data={data} />
      </Stack>
    );
  }


  const chartOption = useMemo(() => {
    const storyNodes = propagationData.map((item) => ({
      name: item.contentHash,

      itemStyle: {
        color: '#74c0fc',
      },

      label: {
        formatter: truncate(item.sampleTitle, 45),
      },
    }));

    const publisherNames = [
      ...new Set(
        propagationData.flatMap((item) =>
          item.publishers.map((publisher) => publisher.publisher),
        ),
      ),
    ];

    const publisherNodes = publisherNames.map((publisher) => ({
      name: publisher,

      itemStyle: {
        color: '#69db7c',
      },
    }));

    const links = propagationData.flatMap((item) =>
      item.publishers.map((publisher) => ({
        source: item.contentHash,
        target: publisher.publisher,
        value: publisher.articleCount,
      })),
    );

    return {
      animationDuration: 500,

      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            const story = propagationData.find(
              (item) => item.contentHash === params.data.source,
            );

            const publisher = params.data.target;

            const publisherData = story?.publishers.find(
              (item) => item.publisher === publisher,
            );

            return `
              <strong>${story?.sampleTitle ?? ''}</strong>
              <br/><br/>
              Publisher:
              <strong>${publisher}</strong>
              <br/>
              Articles:
              <strong>${publisherData?.articleCount ?? 0}</strong>
            `;
          }

          if (params.dataType === 'node') {
            const story = propagationData.find(
              (item) => item.contentHash === params.name,
            );

            if (story) {
              return `
                <strong>${story.sampleTitle}</strong>
                <br/><br/>
                Articles:
                <strong>${getArticleCount(story)}</strong>
                <br/>
                Publishers:
                <strong>${story.publishers.length}</strong>
              `;
            }

            return `
              <strong>${params.name}</strong>
            `;
          }

          return '';
        },
      },

      series: [
        {
          type: 'sankey',

          left: 20,
          right: 120,
          top: 20,
          bottom: 20,

          nodeWidth: 18,
          nodeGap: 18,

          draggable: true,

          emphasis: {
            focus: 'adjacency',
          },

          data: [...storyNodes, ...publisherNodes],

          links,

          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
            opacity: 0.35,
          },

          label: {
            color: 'inherit',

            formatter: (params: any) => {
              const story = propagationData.find(
                (item) => item.contentHash === params.name,
              );

              if (story) {
                return truncate(story.sampleTitle, 45);
              }

              return params.name;
            },
          },
        },
      ],
    };
  }, [propagationData]);


  return (
    <DashboardSection
      title='Publisher Propagation'
      description='Trace how shared stories spread across publishers and reveal connections between content sources.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default NarrativeSpreadChart