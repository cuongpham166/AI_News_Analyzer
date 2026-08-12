import type { SignificantTerms } from '@/shared/types/analysis';

export interface SignificantTermsDistribution {
  docCount: number;
  score: number;
  size: number;
  term: string;
  historicalSharePercentage: number;
  type: string;
}

export const getSignificantTermsDistributionData = (
  data: SignificantTerms[],
): SignificantTermsDistribution[] => {
  return data.map((item) => {
    return {
      docCount: item.docCount,
      score: item.score,
      size: item.score * Math.log1p(item.docCount),
      term:item.term,
      historicalSharePercentage:item.historicalSharePercentage,
      type:item.entityType
    };
  });
};