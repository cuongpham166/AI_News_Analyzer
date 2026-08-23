import type { SourceCoverage } from '@/shared/types/analysis/media_bias/SourceCoverage.ts';
import type { PublisherFocus } from '@/shared/types/analysis/media_bias/PublisherFocus.ts';
import type { EchoChamber } from '@/shared/types/analysis/media_bias/EchoChamber.ts';
import type { TrendingKeywords } from '@/shared/types/analysis/media_bias/TrendingKeywords.ts';

export interface MediaBiasDetail {
  sourceCoverage: SourceCoverage[];
  publisherFocus: PublisherFocus[];
  echoChamber: EchoChamber[];
  trendingKeyword: TrendingKeywords[];
}