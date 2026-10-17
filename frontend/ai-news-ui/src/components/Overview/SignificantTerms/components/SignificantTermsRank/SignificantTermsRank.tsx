import React, { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Group,
  Select,
  Text,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import type { SignificantTerms } from '@/shared/types/analysis';
import {
  getSignificantTermsRankData,
} from '@/components/Overview/SignificantTerms/components/SignificantTermsRank/significantTermsRank.utils.ts';
import type { EChartsOption } from 'echarts';
import {
  GRAPHIC_DATA,
  SECTION_CONFIG,
} from './significantTermsRank.config.ts';
import SignificantTermsLegend from '@/components/Overview/SignificantTerms/components/SignificantTermsLegend.tsx';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';

interface SignificantTermsRankProps {
  data?: SignificantTerms[];
  height?: number | string;
}
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

const SignificantTermsRank = ({
  data,
  height = 450
}: SignificantTermsRankProps) => {
  const [metric, setMetric] = useState<'all' | 'person' | 'organization' | 'event' | 'location'>('all');

  const hasData = (data?.length ?? 0) > 0;

  const chartOption = useMemo<EChartsOption>(() => {
    if (!hasData) {
      return undefined;
    }

    const significantTermsRankData = getSignificantTermsRankData(data);
    const filteredSignificantTermsRankData =
      metric === 'all'
        ? significantTermsRankData
        : significantTermsRankData.filter((term) => term.entityType === metric);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const item = params[0];
          const term = filteredSignificantTermsRankData[item.dataIndex];
          const customContent = `
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Rank Score</span>
              <strong style="text-align:right;white-space:nowrap;">${term.rankScore.toFixed(2)}</strong>
            </div>
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Score</span>
              <strong style="text-align:right;white-space:nowrap;">${term.score.toFixed(2)}</strong>
            </div>
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Documents</span>
              <strong style="text-align:right;white-space:nowrap;">${term.docCount}</strong>
            </div>
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Historical Share</span>
              <strong style="text-align:right;white-space:nowrap;">${term.historicalSharePercentage}%</strong>
            </div>
          `;

          return createCustomChartTooltip({
            title: term.term,
            minWidth: 260,
            badge: String(term.entityType).toUpperCase(),
            badgeBgColor: NEWS_ENTITY_COLORS[term.entityType],
            customContent: customContent,
          });
        },
      },

      grid: GRID_CONFIG,

      xAxis: {
        type: 'value',
        show: hasData,
        name: 'Rank Score',
      },

      yAxis: {
        type: 'category',
        inverse: true,
        show: hasData,
        data: filteredSignificantTermsRankData.map((_, index) => _.term),
        hasData: hasData
          ? filteredSignificantTermsRankData.map((d) => d.term)
          : [],
      },

      series: [
        {
          type: 'bar',
          data: hasData
            ? filteredSignificantTermsRankData.map((d) => ({
                value: d.rankScore,
                itemStyle: {
                  color: NEWS_ENTITY_COLORS[d.entityType],
                },
              }))
            : [],
          barMaxWidth: 24,

          label: {
            show: true,
            position: 'right',
            formatter: (params) => {
              return Number(params.value).toFixed(2);
            },
          },
        },
      ],

      graphic: !hasData ? GRAPHIC_DATA : undefined,
    };
  }, [data, hasData, metric]);
  return (
    <>
      <DashboardSection
        title={SECTION_CONFIG.title}
        description={SECTION_CONFIG.description}
        actions={
          <Group gap='xs'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              View by:
            </Text>
            <Select
              value={metric}
              onChange={(val) =>
                setMetric(
                  val as
                    | 'all'
                    | 'person'
                    | 'organization'
                    | 'event'
                    | 'location',
                )
              }
              data={SECTION_CONFIG.control_options}
            />
          </Group>
        }
        children={
          <Flex direction='column' h='100%' gap='sm'>
            {hasData && chartOption ? (
              <>
                <Box style={{ flex: 1, minHeight: 0 }}>
                  <EChartContainer option={chartOption} height={height} />
                </Box>
                <SignificantTermsLegend />
              </>
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No significant terms were found for this selection.'
                height={height}
              />
            )}
          </Flex>
        }
      />
    </>
  );
};

export default SignificantTermsRank;
