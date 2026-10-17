import type { SignificantTerms } from '@/shared/types/analysis';

interface RankedSignificantTerm extends SignificantTerms {
  rankScore: number;
}

const calculateRankScore = (term: SignificantTerms): number => {
  const historicalWeight = 0.5 + 0.5 * (term.historicalSharePercentage / 100);
  return term.score * Math.log1p(term.docCount) * historicalWeight;
};

export const entityColors: Record<string, string> = {
  person: '#EE6666',
  organization: '#5470C6',
  location: '#3BA272',
  event: '#FAC858',
};

export const getSignificantTermsRankData = (
  data: SignificantTerms[],
): RankedSignificantTerm[] => {
  return data
    .map((d) => ({
      ...d,
      rankScore: calculateRankScore(d),
    }))
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0,20)
};