import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';

export const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

interface ConnectionSentimentData {
  person: string;
  organization: string;
  value: number;
}

export const getConnectionSentimentData = (
  data: PowerCouple[],
  limit = 10,
): ConnectionSentimentData[] => {
  return data
    .slice()
    .sort((a, b) => b.avgSentiment - a.avgSentiment)
    .slice(0, limit)
    .map((d) => ({
      person: d.person,
      organization: d.organization,
      value: d.avgSentiment,
    }));
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const buildChartTooltip = (data) => {
  if (!data) {
    return '';
  }

  const sentiment = data.value.toFixed(2);

  return `
            <div style="
              min-width: 220px;
              line-height: 1.5;
            ">
              <div style="
                font-weight: 600;
                margin-bottom: 3px;
              ">
                ${escapeHtml(data.person)}
              </div>

              <div style="
                color: #6B7280;
                margin-bottom: 10px;
              ">
                ${escapeHtml(data.organization)}
              </div>

              <div style="
                border-top: 1px solid #E5E7EB;
                padding-top: 8px;
                display: flex;
                justify-content: space-between;
                gap: 20px;
              ">
                <span>Joint sentiment</span>
                <strong> ${sentiment}</strong>
              </div>
            </div>
          `;
}