import { Grid, Stack } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import {
  MetricsHeader,
  DateHistogramSentimentTrendCard,
  DeepVelocityCard,
  GlobalTrendsCard,
  EntityTrendsCard,
  SignificantTermsCard,
  TopicRadarCard,
} from '@/components/Overview';

function OverviewPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle='Macro Pulse' />
      <MetricsHeader />
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <DateHistogramSentimentTrendCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <GlobalTrendsCard />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 12 }}>
          <EntityTrendsCard />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SignificantTermsCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <TopicRadarCard />
        </Grid.Col>
      </Grid>
      <DeepVelocityCard />
    </Stack>
  );
}

export default OverviewPage;
