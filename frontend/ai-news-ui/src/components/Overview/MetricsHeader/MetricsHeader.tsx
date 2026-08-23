import {SimpleGrid} from '@mantine/core';
import CenteredKpiCard from '@/components/Overview/MetricsHeader/CenteredKpiCard';
import {
  AmplificationRatioCard,
  StoryUniquenessCard,
  ExtractionPipelineStatusCard,
  NewsSourceDistributionCard,
  NewsTopicDistributionCard,
  EntityTypeBreakdownCard,
} from '@/components/Overview/MetricsHeader/CenteredKpiCard/components';
import {
  useMacroPulseOverviewDashboard,
} from '@/hooks/queries/dashboard.query.ts';
import type { MacroPulseDetail } from '@/shared/types/analysis/dashboard/MacroPulse.ts';
function MetricsHeader() {
  const amplificationTooltipText = 'Measures media repetition by calculating how many times each unique story is republished across outlets, ' +
    'exposing whether high news volume is driven by genuine breaking events or echo-chamber syndication.';

  const { data, isLoading, error } =
    useMacroPulseOverviewDashboard<MacroPulseDetail>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
      <CenteredKpiCard
        title='Amplification Ratio'
        children={<AmplificationRatioCard data={data.amplificationRatio} />}
        tooltip={amplificationTooltipText}
      />

      <CenteredKpiCard
        title='Story Uniqueness'
        children={
          <StoryUniquenessCard
            totalArticles={data.totalArticles}
            uniqueStories={data.uniqueStories}
          />
        }
      />

      <CenteredKpiCard
        title='Extraction Pipeline Status'
        children={
          <ExtractionPipelineStatusCard
            totalNews={data.totalNews}
            totalInference={data.totalInference}
          />
        }
      />

      <CenteredKpiCard
        title='News Source Distribution'
        children={<NewsSourceDistributionCard data={data.sourceNewsCounts} />}
      />

      <CenteredKpiCard
        title='Topic Distribution'
        children={<NewsTopicDistributionCard data={data.topicNewsCounts} />}
      />

      <CenteredKpiCard
        title='Entity Type Distribution'
        children={<EntityTypeBreakdownCard data={data.entityTypeCounts} />}
      />
    </SimpleGrid>
  );
}

export default MetricsHeader;
