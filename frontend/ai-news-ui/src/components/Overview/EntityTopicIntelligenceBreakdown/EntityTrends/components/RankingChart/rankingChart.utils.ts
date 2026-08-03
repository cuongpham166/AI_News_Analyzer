import type {
  GlobalEntitiesTrendsType,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import {
  getEntityImpactData
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntityImpactMatrix/entityImpactMatrix.utils.ts';


interface RankingChartData {
  entity: string;
  mentions: number;
  sentiment: number;
}

export const getRankingChartData = (
  data: GlobalEntitiesTrendsType,
): RankingChartData[] => {
  return [...getEntityImpactData(data)].sort((a, b) => b.mentions - a.mentions);
};

