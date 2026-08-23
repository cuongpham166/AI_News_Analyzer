import { Box, Divider, Grid, Stack, Text } from '@mantine/core';
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
import { notifications } from '@mantine/notifications';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { useMacroPulseDetailDashboard } from '@/hooks/queries/dashboard.query.ts';
import { useRef, useEffect, useState } from 'react';
import PageLoader from '@/components/generic/PageLoader';

function OverviewPage() {
  const { data, isLoading, isFetching, error } = useMacroPulseDetailDashboard();

  const wasFetching = useRef(false);

  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && data) {
      notifications.show({
        title: 'Macro Pulse Dashboard updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, data]);

  if (isLoading && !data) {
    return <PageLoader/>
  }

  if (error && !data) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <Stack gap='xl'>
      <Taskbar
        taskbarTitle='Macro Pulse'
      />
      <MetricsHeader />
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
              SECTION 1: TIME-SERIES & GLOBAL MOMENTUM
            </Text>
          }
          labelPosition='left'
        />
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateHistogramSentimentTrendCard
              data={data?.sentimentVolumeTimeline}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <GlobalTrendsCard data={data?.globalTrend.timeline ?? []} />
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
              SECTION 2: ENTITY & VELOCITY DYNAMICS
            </Text>
          }
          labelPosition='left'
        />
        <Stack gap='md'>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <EntityTrendsCard data={data?.globalEntityTrend} />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <DeepVelocityCard data={data?.entityVelocity} />
            </Grid.Col>
          </Grid>
        </Stack>
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
              SECTION 3: TOPIC DISCOVERY & SIGNIFICANT TERMS
            </Text>
          }
          labelPosition='left'
        />
        <Grid>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <SignificantTermsCard data={data?.significantTerms} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <TopicRadarCard data={data?.topicRadar} />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  );
}

export default OverviewPage;
