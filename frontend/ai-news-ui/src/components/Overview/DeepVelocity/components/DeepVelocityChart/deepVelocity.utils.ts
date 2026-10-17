import type { DeepVelocityType } from '@/shared/interfaces/analysis/ExecutiveOverview/DeepVelocityType.ts';
import {
  DEFAULT_TRENDS_COLORS,
  TRENDS_COLORS,
} from '@/components/Overview/DeepVelocity/components/DeepVelocityChart/deepVelocity.config.ts';
import { RISK_LEVEL_COLORS } from '@/shared/constants/RiskLevel.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';

export function calculateChartMetrics(data: DeepVelocityType[]) {
  const isEmpty = data.length === 0;

  const mentionThreshold = isEmpty
    ? 50
    : data.map((d) => d.currentMentions).sort((a, b) => a - b)[
        Math.floor(data.length / 2)
      ];

  const velocityThreshold = isEmpty
    ? 50
    : data.map((d) => d.velocityPercentage).sort((a, b) => a - b)[
        Math.floor(data.length / 2)
      ];

  const maxMentions = isEmpty
    ? 100
    : Math.max(...data.map((d) => d.currentMentions));

  const maxVelocity = isEmpty
    ? 100
    : Math.max(...data.map((d) => d.velocityPercentage));

  return {
    maxMentions,
    maxVelocity,
    mentionThreshold,
    velocityThreshold,
  };
}

export function buildScatterData(data: DeepVelocityType[]) {
  const isEmpty = data.length === 0;
  if (isEmpty) {
    return [];
  }
  return data.map((item) => {
    const pointColor =
      TRENDS_COLORS[item.trendDirection] || DEFAULT_TRENDS_COLORS;
    return {
      name: item.entity,
      value: [
        item.currentMentions,
        item.velocityPercentage,
        item.momentumScore,
        item.trendDirection,
      ],

      itemStyle: {
        color: pointColor,
        opacity: 0.85,
      },
      ...item,
    };
  });
}

export const buildDeepVelocityTooltip = (params: any) => {
  const item = params.data as DeepVelocityType;
  const entityName = item.entity;
  let trendDirectionColor;
  if (item.trendDirection == 'Rising') {
    trendDirectionColor = RISK_LEVEL_COLORS['low'];
  } else if (item.trendDirection == 'Falling') {
    trendDirectionColor = RISK_LEVEL_COLORS['high'];
  } else {
    trendDirectionColor = RISK_LEVEL_COLORS['moderate'];
  }

  const customContent = `
    <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:5px;
    ">
        <span style="color:#475569;">Current Mentions</span>
        <strong style="text-align:right;white-space:nowrap;">${item.currentMentions}</strong>
    </div>
    
    <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:5px;
    ">
        <span style="color:#475569;">Previous Mentions</span>
        <strong style="text-align:right;white-space:nowrap;">${item.previousMentions}</strong>
    </div>
    
    <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:5px;
    ">
        <span style="color:#475569;">Velocity Percentage</span>
        <strong style="text-align:right;white-space:nowrap;">${item.velocityPercentage}</strong>
    </div>
    
    <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:5px;
    ">
        <span style="color:#475569;">Momentum Score</span>
        <strong style="text-align:right;white-space:nowrap;">${item.momentumScore}</strong>
    </div>
  `;

  return createCustomChartTooltip({
    title: entityName,
    minWidth: 260,
    customContent: `
        ${
          customContent ||
          '<span style="color:#64748B;">No data available</span>'
        }
        
              <div style="
                border-top:1px solid #F1F5F9;
                margin-top:8px;
                padding-top:6px;
                display:flex;
                justify-content:space-between;
              ">
                <strong>Trend Direction:</strong>
                <strong style="color:${trendDirectionColor};">${item.trendDirection}</strong>
              </div>
            `,
  });
};

export const createMarkLine = (
  mentionThreshold: number,
  velocityThreshold: number,
) => ({
  symbol: ['none', 'none'],
  tooltip: {
    show: false,
  },
  data: [{ xAxis: mentionThreshold }, { yAxis: velocityThreshold }],
});

export const createMarkArea = (
  mentionThreshold: number,
  velocityThreshold: number,
  maxMentions: number,
  maxVelocity: number,
) => ({
  silent: true,
  data: [
    // Breakout Leaders: high volume + high velocity
    [
      {
        xAxis: mentionThreshold,
        yAxis: velocityThreshold,
        itemStyle: {
          color: 'rgba(255, 99, 132, 0.15)',
        },
      },
      {
        xAxis: maxMentions * 1.2,
        yAxis: maxVelocity * 1.2,
      },
    ],

    // Emerging Signals: low volume + high velocity
    [
      {
        xAxis: 0,
        yAxis: velocityThreshold,
        itemStyle: {
          color: 'rgba(54, 162, 235, 0.15)',
        },
      },
      {
        xAxis: mentionThreshold,
        yAxis: maxVelocity * 1.2,
      },
    ],

    // Low Attention: low volume + low velocity
    [
      {
        xAxis: 0,
        yAxis: 0,
        itemStyle: {
          color: 'rgba(144, 238, 144, 0.15)',
        },
      },
      {
        xAxis: mentionThreshold,
        yAxis: velocityThreshold,
      },
    ],

    // High Volume / Low Velocity
    [
      {
        xAxis: mentionThreshold,
        yAxis: 0,
        itemStyle: {
          color: 'rgba(255, 215, 0, 0.15)',
        },
      },
      {
        xAxis: maxMentions * 1.2,
        yAxis: velocityThreshold,
      },
    ],
  ],
});
