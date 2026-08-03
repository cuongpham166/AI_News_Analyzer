import { Grid,Stack } from '@mantine/core';
import SignificantTermsAggregationCard
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/SignificantTermsAggregation';
import TopicRadarCard from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar';
import EntityTrendsCard from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends';
function EntityTopicIntelligenceBreakdown() {
  return (
    <Stack>
      <Grid gutter='md'>
        <Grid.Col span={{ base: 12, md: 12 }}>
          <EntityTrendsCard />
        </Grid.Col>
      </Grid>
      <Grid gutter='md'>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SignificantTermsAggregationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <TopicRadarCard />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default EntityTopicIntelligenceBreakdown;