import { Grid, Stack, Text } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import {
  SourceCoverageSentiment,
  TrendingKeywordClusters,
  ContentDuplication,
  PublisherFocusChart,
  ImpactNewsList,
} from '@/components/MediaBias';
import PublisherFocusData from '@/shared/test_data/PublisherFocusData.ts';
function MediaBiasPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle='Media Bias' />
      <Grid gap='md'>
        <Grid.Col span={{ base: 12, lg: 6 }} style={{ height: '90%' }}>
          <SourceCoverageSentiment />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} style={{ height: '90%' }}>
          <TrendingKeywordClusters />
        </Grid.Col>
      </Grid>

      <Grid gap='md'>
        <Grid.Col span={{ base: 12, lg: 6 }} style={{ height: '90%' }}>
          <ContentDuplication />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} style={{ height: '90%' }}>
          <PublisherFocusChart data={PublisherFocusData.data} />
        </Grid.Col>
      </Grid>

      <Grid gap='md'>
        <Grid.Col span={{ base: 12, lg: 12 }} style={{ height: '90%' }}>
          <ImpactNewsList />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default MediaBiasPage;
