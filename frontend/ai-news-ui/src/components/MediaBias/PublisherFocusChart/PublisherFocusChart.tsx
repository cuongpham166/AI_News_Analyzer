import type { PublisherFocus } from '@/shared/types/analysis/media_bias/PublisherFocus.ts';
import React, { useEffect, useMemo, useState } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import { Box, Flex, Group, Select, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import type { EChartsOption } from 'echarts';
import {
  NEWS_SOURCES_NAMES,
  NEWS_SOURCES,
} from '@/shared/constants/NewsSources.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface PublisherFocusChartProps {
  publisherFocus?: PublisherFocus[];
  height?: number | string;
}

const PublisherFocusChart = ({
  publisherFocus,
  height = 450,
}: PublisherFocusChartProps) => {

  const hasData = publisherFocus && publisherFocus.length > 0;
  const [selectedPublisher, setSelectedPublisher] = useState<string>('DW');
  const TOP_N = 10;

  const selectOptions = useMemo(
    () =>
      [...NEWS_SOURCES]
        .sort((a, b) =>
          NEWS_SOURCES_NAMES[a].localeCompare(NEWS_SOURCES_NAMES[b]),
        )
        .map((item) => ({
          label: NEWS_SOURCES_NAMES[item],
          value: item,
        })),
    [],
  );


  const onChangePublisher = (publisher: string) => {
      setSelectedPublisher(publisher);
  };

  const selectedPublisherData = useMemo(() => {
    if (!hasData) {
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

    const organizations = selectedPublisherData.map(
      (item) => item.organization,
    );

    const volumes = selectedPublisherData.map((item) => item.coverageVolume);

    return {
      animationDuration: 500,

      grid: GRID_CONFIG,

      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          const item = selectedPublisherData[params.dataIndex];

          return `
            <strong>${item.organization}</strong>
            <div style="margin-top: 6px">
              Publisher:
              ${NEWS_SOURCES_NAMES[item.publisher]}
            </div>
            <div>
              Coverage volume:
              <strong>${item.coverageVolume}</strong>
            </div>
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

        axisLabel: {
          color: '#64748B',
        },

        splitLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0.35,
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: organizations,

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },

        axisLabel: {
          color: '#475569',
          fontSize: 12,
        },
      },

      series: [
        {
          name: 'Coverage',
          type: 'bar',
          data: volumes,
          barMaxWidth: 30,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            position: 'right',
            fontWeight: 600,
            formatter: '{c}',
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
    </DashboardCard>
  );
};

export default PublisherFocusChart