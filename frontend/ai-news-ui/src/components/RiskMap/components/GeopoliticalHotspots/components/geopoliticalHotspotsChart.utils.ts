import type { HotspotChartData } from '@/components/RiskMap/components/GeopoliticalHotspots/components/GeopoliticalHotspotsChart.tsx';
import { RISK_LEVEL_COLORS } from '@/shared/constants/RiskLevel.ts';

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const getRiskLevelColor = (riskScore: number): string => {
  if (riskScore >= 0.6) return RISK_LEVEL_COLORS['high'];
  if (riskScore >= 0.3) return RISK_LEVEL_COLORS['moderate'];
  return RISK_LEVEL_COLORS['low'];
};

export const getRiskLevelLabel = (riskScore: number): string => {
  if (riskScore >= 0.6) return 'High Crisis';
  if (riskScore >= 0.3) return 'Elevated';
  return 'Low Threat';
};

export const buildRichTooltip = (params: any) => {
  const data = params.data as HotspotChartData;
  if (!data) return '';

  const riskPercent = Math.round(data.riskScore * 100);
  const riskColor = getRiskLevelColor(data.riskScore);
  const riskLabel = getRiskLevelLabel(data.riskScore);

  const topTopics = data.topics.slice(0, 3);

  const countryDisplay = data.country
    ? `${escapeHtml(data.country)}${
        data.countryCode ? ` (${escapeHtml(data.countryCode)})` : ''
      }`
    : 'Unspecified Region';

  const topicsHtml =
    topTopics.length > 0
      ? topTopics
          .map(
            (t) =>
              `<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px; margin-top: 2px;">
                        <span style="color: #475569;">${escapeHtml(t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase())}</span>
                        <strong style="color: #0F172A;">${t.articleCount}</strong>
                      </div>`,
          )
          .join('')
      : '<div style="font-size: 11px; color: #94A3B8;">No topic metrics</div>';

  return `
            <div style="min-width: 210px; font-family: sans-serif; line-height: 1.4; color: #0F172A;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-weight: 600; font-size: 13px;">${escapeHtml(data.location)}</span>
              </div>
              <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
                ${countryDisplay}
              </div>

              <div style="border-top: 1px solid #F1F5F9; padding-top: 8px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #64748B;">Risk Score:</span>
                  <strong style="color: ${riskColor};">
                    ${riskPercent}% (${riskLabel})
                  </strong>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #64748B;">News Volume:</span>
                  <strong>${data.articleCount} articles</strong>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #64748B;">Avg Sentiment:</span>
                  <strong>${data.avgSentiment > 0 ? `+${data.avgSentiment.toFixed(2)}` : data.avgSentiment.toFixed(2)}</strong>
                </div>

                <div style="border-top: 1px dashed #E2E8F0; padding-top: 6px; margin-top: 4px;">
                  <div style="font-size: 11px; font-weight: 600; color: #64748B; margin-bottom: 4px;">
                    Key Topics
                  </div>
                  ${topicsHtml}
                </div>
              </div>
            </div>
          `;
};
