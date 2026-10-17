import type { PublisherFocus } from '@/shared/types/analysis/media_bias/PublisherFocus.ts';
import React, { useEffect, useMemo, useState } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import type { EChartsOption } from 'echarts';
import {
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_FULL_NAMES,
  NEWS_SOURCES_NAMES,
} from '@/shared/constants/NewsSources.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  truncateLabel,
} from '@/components/MediaBias/PublisherFocusChart/publisherFocusChart.utils.ts';
import PublisherFocusLegends from '@/components/MediaBias/PublisherFocusChart/components/PublisherFocusLegends.tsx';
import {
  createCustomChartTooltip,
} from '@/shared/utils/createChartTooltip.ts';


interface PublisherFocusChartProps {
  publisherFocus?: PublisherFocus[];
  height?: number | string;
}

const PublisherFocusChart = ({
  publisherFocus,
  height = 450,
}: PublisherFocusChartProps) => {
  const hasData = Boolean(publisherFocus && publisherFocus.length > 0);
  const TOP_N = 10;

  const availablePublishers = useMemo(() => {
    if (!hasData || !publisherFocus) return [];
    return Array.from(new Set(publisherFocus.map((item) => item.publisher)));
  }, [hasData, publisherFocus]);

  const [selectedPublisher, setSelectedPublisher] = useState<string>('UN');

  useEffect(() => {
    if (
      availablePublishers.length > 0 &&
      !availablePublishers.includes(selectedPublisher)
    ) {
      setSelectedPublisher(availablePublishers[0]);
    }
  }, [availablePublishers, selectedPublisher]);

  const selectOptions = useMemo(() => {
    return availablePublishers
      .map((key) => ({
        label: NEWS_SOURCES_NAMES[key] || key,
        value: key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [availablePublishers]);

  const onChangePublisher = (publisher: string) => {
    setSelectedPublisher(publisher);
  };

  const selectedPublisherData = useMemo(() => {
    if (!hasData || !publisherFocus) {
      return [];
    }

    return publisherFocus
      .filter((item) => item.publisher === selectedPublisher)
      .sort((a, b) => b.coverageVolume - a.coverageVolume)
      .slice(0, TOP_N);
  }, [hasData, publisherFocus, selectedPublisher]);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!selectedPublisherData.length) {
      return undefined;
    }

    const organizations = selectedPublisherData.map((item) =>
      truncateLabel(item.organization),
    );

    return {
      animationDuration: 500,

      grid: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 170,
        containLabel: false,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',

        formatter: (params: any[]) => {
          if (!params || params.length === 0) return '';
          const dataIndex = params[0].dataIndex;
          const item = selectedPublisherData[dataIndex];

          const posRatio =
            item.coverageVolume > 0
              ? Math.round((item.positiveVolume / item.coverageVolume) * 100)
              : 0;

          const negRatio =
            item.coverageVolume > 0
              ? Math.round((item.negativeVolume / item.coverageVolume) * 100)
              : 0;

          const sentimentColor =
            item.avgSentiment > 0
              ? NEWS_SENTIMENT_COLORS['positive']
              : NEWS_SENTIMENT_COLORS['negative']

          const formattedSentiment =
            item.avgSentiment > 0
              ? `+${item.avgSentiment.toFixed(2)}`
              : item.avgSentiment.toFixed(2);

          return createCustomChartTooltip({
            title: item.organization,
            subtitle: `Publisher: ${NEWS_SOURCES_FULL_NAMES[item.publisher]}`,
            badge: String(item.publisher).toUpperCase(),
            badgeBgColor: NEWS_SOURCES_COLORS[item.publisher],
            metrics: [
              {
                label: 'Positive Articles',
                value: `${item.positiveVolume}`,
                color: NEWS_SENTIMENT_COLORS['positive'],
              },
              {
                label: 'Negative Articles',
                value: `${item.negativeVolume}`,
                color: NEWS_SENTIMENT_COLORS['negative'],
              },
              {
                label: 'Total Coverage',
                value: `${item.coverageVolume}`,
              },
              {
                label: 'Avg. Sentiment',
                value: `${item.avgSentiment.toFixed(2)}`,
                color: sentimentColor,
              },
            ],
            distribution: {
              segments: [
                {
                  label: 'Positive',
                  percentage: posRatio,
                  color: NEWS_SENTIMENT_COLORS['positive'],
                },
                {
                  label: 'Conflict',
                  percentage: negRatio,
                  color: NEWS_SENTIMENT_COLORS['negative'],
                },
              ],
            },
          });
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles Count',
        nameLocation: 'middle',
        nameGap: 28,
        min: 0,
        minInterval: 1,
        axisLabel: {
          color: '#64748B',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E2E8F0',
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: organizations,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
        },
      },

      series: [
        {
          name: 'Positive Volume',
          type: 'bar',
          stack: 'volume',
          data: selectedPublisherData.map((item) => item.positiveVolume),
          barMaxWidth: 24,
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS['positive'],
          },
        },
        {
          name: 'Negative Volume',
          type: 'bar',
          stack: 'volume',
          data: selectedPublisherData.map((item) => item.negativeVolume),
          barMaxWidth: 24,
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS['negative'],
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    };
  }, [selectedPublisherData]);

  return (
    <DashboardCard
      title='Publisher Focus'
      description='Top organizations covered by each publisher based on article volume.'
      headerActions={
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <Select
            placeholder='Select Publisher'
            value={selectedPublisher}
            onChange={onChangePublisher}
            data={selectOptions}
            w={180}
            size='sm'
            allowDeselect={false}
          />
        </Group>
      }
    >
      <Flex direction='column' h='100%' gap='sm'>
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No publisher coverage data were found for this publisher.'
            />
          )}
        </Box>
        <PublisherFocusLegends />
      </Flex>
    </DashboardCard>
  );
};

export default PublisherFocusChart