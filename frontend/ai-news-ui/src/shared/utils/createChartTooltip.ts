import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

export const escapeHtml = (value: unknown): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) => htmlEntities[char] ?? char,
  );
};

type TooltipMetric = {
  label: string;
  value: string | number;
  color?: string;
};

type DistributionSegment = {
  label: string;
  percentage: number;
  color: string;
};

type TooltipColors = {
  neutral?: string;
};

type CustomChartTooltipOptions = {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeBgColor?: string;
  metrics?: TooltipMetric[];
  distribution?: {
    segments: DistributionSegment[];
  };
  customContent?: any;
  minWidth?: number;
  colors?: TooltipColors;
};

export const createCustomChartTooltip = ({
  title,
  subtitle,
  badge,
  badgeBgColor,
  metrics = [],
  distribution,
  customContent,
  minWidth = 230,
  colors = NEWS_SENTIMENT_COLORS,
}: CustomChartTooltipOptions): string => {
  const metricRows = metrics
    .map(
      (metric) => `
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 4px;
    ">
      <span style="color: ${colors.neutral || '#64748B'};">
        ${escapeHtml(metric.label)}
      </span>
      <strong style="
        color: ${metric.color || '#0F172A'};
        text-align: right;
      ">
        ${escapeHtml(metric.value)}
      </strong>
    </div>
  `,
    )
    .join('');

  const distributionHtml = distribution?.segments?.length
    ? `
      <div style="margin-top: 10px; font-size: 11px;">
        <div style="
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 3px;
        ">
          ${distribution.segments
            .map(
              (segment) => `
            <span style="color: ${segment.color};">
              ${escapeHtml(segment.label)}: ${segment.percentage.toFixed(1)}%
            </span>
          `,
            )
            .join('')}
        </div>

        <div style="
          display: flex;
          width: 100%;
          height: 6px;
          overflow: hidden;
          border-radius: 3px;
          background: #E2E8F0;
        ">
          ${distribution.segments
            .map(
              (segment) => `
            <div style="
              width: ${Math.max(0, Math.min(100, segment.percentage))}%;
              height: 100%;
              background: ${segment.color};
            "></div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const badgeTextColor = badgeBgColor ? '#f9f5f1' : '#64748B';
  const badgeBackgroundColor = badgeBgColor ? badgeBgColor : '#f9f5f1';

  return `
    <div style="
      min-width: ${minWidth}px;
      font-family: sans-serif;
      line-height: 1.5;
      color: #0F172A;
    ">
      <div style="font-weight: 600; font-size: 13px;">
        ${escapeHtml(title)}
        ${
          badge
            ? `
          <span style="
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            background: ${badgeBackgroundColor};
            color: ${badgeTextColor};
            margin-left: 6px;
          ">${escapeHtml(badge)}</span>
        `
            : ''
        }
      </div>

      ${
        subtitle
          ? `
        <div style="
          color: #64748B;
          font-size: 11px;
          margin-bottom: 8px;
        ">${escapeHtml(subtitle)}</div>
      `
          : ''
      }

      <div style="
        border-top: 1px solid #F1F5F9;
        padding-top: 8px;
        font-size: 12px;
      ">
        ${customContent ?? `${metricRows}${distributionHtml}`}
      </div>
    </div>
  `;
};
