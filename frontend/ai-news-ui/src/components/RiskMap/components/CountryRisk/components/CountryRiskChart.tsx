import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useCallback, useMemo } from 'react';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
import {buildCountryRiskChartTooltip, } from './countryRiskChart.utils.ts';


interface CountryRiskChartProps {
  countryRisk?: CountryRisk[];
  height?: number | string;
  onLocationClick?: (location: CountryRisk) => void;
}

const CountryRiskChart = ({
  countryRisk,
  height = 500,
  onLocationClick,
}: CountryRiskChartProps) => {
  const hasData = Boolean(countryRisk && countryRisk.length > 0);

  const handleChartClick = useCallback(
    (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        const clickedCountry = params.data.rawItem as CountryRisk;
        if (onLocationClick && clickedCountry) {
          onLocationClick(clickedCountry);
        }
      }
    },
    [onLocationClick],
  );

  const onEvents = useMemo(
    () => ({
      click: handleChartClick,
    }),
    [handleChartClick],
  );

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !countryRisk) {
      return undefined;
    }

    const mapData = countryRisk
      .filter((item) => Number.isFinite(item.frequency) && item.frequency > 0)
      .map((item) => ({
        name: item.country,
        value: Number.isFinite(item.riskScore) ? item.riskScore : 0,
        rawItem: item,
      }));

    return {
      animationDuration: 500,
      visualMap: {
        min: 0,
        max: 1.0,
        calculable: true,
        orient: 'vertical',
        top: 'center',
        left: 10,
        text: ['High Risk (100%)', 'Low Risk (0%)'],
        textStyle: {
          color: '#64748B',
          fontSize: 11,
        },
        inRange: {
          color: ['#10B981', '#34D399', '#FBBF24', '#F87171', '#EF4444'],
        },
      },

      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',

        formatter: (params: any) => buildCountryRiskChartTooltip(params),
      },

      series: [
        {
          type: 'map',
          map: 'world',
          roam: true,
          zoom: 1.2,
          center: [15, 20],

          data: mapData,

          itemStyle: {
            areaColor: '#F1F5F9',
            borderColor: '#CBD5E1',
            borderWidth: 0.6,
          },

          emphasis: {
            itemStyle: {
              areaColor: '#38BDF8',
            },
            label: {
              show: true,
              color: '#0F172A',
              fontWeight: 600,
            },
          },
        },
      ],
    };
  }, [hasData, countryRisk]);
  return (
    <EChartContainer option={chartOption} height={height} onEvents={onEvents} />
  );
};

export default CountryRiskChart;