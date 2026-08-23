import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';

export const getConnectionStabilityData = (data: PowerCouple[]) => {
  return data.map((d) => ({
    value: [d.avgSentiment, d.volatility],
    person: d.person,
    organization: d.organization,
  }));
};