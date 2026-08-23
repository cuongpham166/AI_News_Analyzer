import { Box, Divider, Grid, Stack, Text } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import {
  SourceCoverageSentiment,
  TrendingKeywordClusters,
  ContentDuplication,
  PublisherFocusChart,
  ImpactNewsList,
} from '@/components/MediaBias';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { useImpactArticles } from '@/hooks/queries/analysis.query.ts';
import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { useMediaBiasDetailDashboard } from '@/hooks/queries/dashboard.query.ts';
import PageLoader from '@/components/generic/PageLoader';
function MediaBiasPage() {

  const impactArticlesQuery = useImpactArticles({ isPositive: true, topN: 10 });
  const mediaBiasDetailQuery = useMediaBiasDetailDashboard();

  const wasFetching = useRef(false);

  const isLoading = impactArticlesQuery.isLoading && mediaBiasDetailQuery.isLoading;
  const isFetching = impactArticlesQuery.isFetching && mediaBiasDetailQuery.isFetching;
  const hasData = impactArticlesQuery.data != null && mediaBiasDetailQuery.data != null
  const hasError = impactArticlesQuery.error && mediaBiasDetailQuery.error;

  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && hasData) {
      notifications.show({
        title: 'Media Bias Dashboard updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, hasData]);

  if (isLoading && !hasData) {
    return <PageLoader />;
  }

  if (hasError && !hasData) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <Stack gap='xl'>
      <Taskbar taskbarTitle='Media Bias' />
      <Box>
        <Divider
          mb='md'
          label={
            <Text
              fw={700}
              size='sm'
              c={ThemeColors.primary}
              style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              SECTION 1: SOURCE SENTIMENT & PUBLISHER BIAS
            </Text>
          }
          labelPosition='left'
        />
        <Grid gap='md'>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <SourceCoverageSentiment
              sourceCoverage={mediaBiasDetailQuery.data?.sourceCoverage}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PublisherFocusChart
              publisherFocus={mediaBiasDetailQuery.data?.publisherFocus}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Divider
          mb='md'
          label={
            <Text
              fw={700}
              size='sm'
              c={ThemeColors.primary}
              style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              SECTION 2: CONTENT CLUSTERING & DUPLICATION NETWORKS
            </Text>
          }
          labelPosition='left'
        />
        <Grid gap='md'>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TrendingKeywordClusters
              trendingKeyword={mediaBiasDetailQuery.data?.trendingKeyword}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ContentDuplication
              echoChamber={mediaBiasDetailQuery.data?.echoChamber}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Divider
          mb='md'
          label={
            <Text
              fw={700}
              size='sm'
              c={ThemeColors.primary}
              style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              SECTION 3: HIGH-IMPACT ARTICLES & FEED ANALYSIS
            </Text>
          }
          labelPosition='left'
        />
        <Grid gap='md'>
          <Grid.Col span={{ base: 12, lg: 12 }}>
            <ImpactNewsList impactArticles={impactArticlesQuery.data} />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  );
}

export default MediaBiasPage;
