import { Box, Divider, Grid, Stack, Text } from '@mantine/core';

import Taskbar from '@/components/generic/Taskbar';
import OrganizationConnections from '@/components/NetworkLab/OrganizationConnections';
import InfluencerDiscoveryCard from '@/components/NetworkLab/InfluencerDiscovery';
import EntityPolarizationSentimentCard from '@/components/NetworkLab/EntityPolarizationSentiment';
import PowerCouplesCard from '@/components/NetworkLab/PowerCouples';
import CoOccurrenceMatrixCard from '@/components/NetworkLab/CoOccurrenceMatrix';
import NarrativeBridgeCard from '@/components/NetworkLab/NarrativeBridge';
import EventMomentum from "@/components/NetworkLab/EventMomentum";
import EventRiskPolarization from "@/components/NetworkLab/EventRiskPolarization";
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { useNetworkLabDetailDashboard } from '@/hooks/queries/dashboard.query.ts';
import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import PageLoader from '@/components/generic/PageLoader';

function NetworkLabPage() {
  const { data, isLoading, isFetching, error } = useNetworkLabDetailDashboard();

  const wasFetching = useRef(false);

  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && data) {
      notifications.show({
        title: 'Network Lab Dashboard updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, data]);

  if (isLoading && !data) {
    return <PageLoader />;
  }

  if (error && !data) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <Stack>
      <Taskbar taskbarTitle='Publisher & Story Tracking' />
      <Stack gap='xl'>
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
                SECTION 1: INFLUENCERS & KEY FIGURES
              </Text>
            }
            labelPosition='left'
          />
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <InfluencerDiscoveryCard
                influencerNetwork={data?.influencerNetwork}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <EntityPolarizationSentimentCard
                entityPolarization={data?.entityPolarization}
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
                SECTION 2: INTER-ENTITY NETWORKS & MESSAGING
              </Text>
            }
            labelPosition='left'
          />
          <Stack gap='md'>
            <Grid>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <PowerCouplesCard powerCouple={data?.powerCouple} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <CoOccurrenceMatrixCard coOccurrence={data?.coOccurrenceCell} />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <NarrativeBridgeCard narrativeBridge={data?.narrativeBridge} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <OrganizationConnections
                  allianceNetwork={data?.allianceNetwork}
                />
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
                SECTION 3: EVENT RISK & CROSS-ENTITY IMPACT
              </Text>
            }
            labelPosition='left'
          />
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <EventRiskPolarization eventRisk={data?.eventRiskRadar} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <EventMomentum eventMomentum={data?.eventMomentum} />
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Stack>
  );
}

export default NetworkLabPage;
