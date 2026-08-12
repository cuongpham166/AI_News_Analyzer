import type { PowerCouple } from '@/shared/types/analysis/PowerCouple.ts';

export const getConnectionSentimentData = (data: PowerCouple[])=> {
  return data
    .slice()
    .sort((a, b) => b.avgSentiment - a.avgSentiment)
    .map((d) => ({
      name: `${d.person} → ${d.organization}`,
      value: d.avgSentiment,
    }));
}