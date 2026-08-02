import type { DeepVelocityType } from '@/shared/interfaces/analysis/ExecutiveOverview/DeepVelocityType.ts';
import {
  DEFAULT_TRENDS_COLORS,
  TRENDS_COLORS,
} from '@/components/Overview/DeepVelocity/components/DeepVelocityChart/deepVelocity.config.ts';

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

export function buildTooltip(item: DeepVelocityType) {
  return `
     <div style="font-weight: 600; margin-bottom: 4px;">${item.entity}</div>
     <div style="font-size: 12px;">
        • <strong>Current Mentions:</strong> ${item.currentMentions}<br/>
        • <strong>Previous Mentions:</strong> ${item.previousMentions}<br/>
        • <strong>Velocity Percentage:</strong> ${item.velocityPercentage}<br/>
        • <strong>Momentum Score:</strong> ${item.momentumScore}<br/>
        • <strong>Trend Direction:</strong> ${item.trendDirection}<br/>
     </div>
  `;
}

export const createMarkLine = (
  mentionThreshold: number,
  velocityThreshold: number,
) => ({
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