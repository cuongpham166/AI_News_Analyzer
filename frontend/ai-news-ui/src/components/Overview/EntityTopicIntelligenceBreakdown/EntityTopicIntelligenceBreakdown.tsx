import { Grid } from '@mantine/core';
import SignificantTermsAggregationCard
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/SignificantTermsAggregation';
import TopicRadarCard from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar';
import EntityTrendsCard from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends';
function EntityTopicIntelligenceBreakdown() {
  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <SignificantTermsAggregationCard/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TopicRadarCard/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <EntityTrendsCard/>
      </Grid.Col>
    </Grid>
  );
}

export default EntityTopicIntelligenceBreakdown;