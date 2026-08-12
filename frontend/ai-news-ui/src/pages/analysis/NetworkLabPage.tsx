import { Grid, Stack } from '@mantine/core';

import Taskbar from '@/components/generic/Taskbar';
import OrganizationConnections from '@/components/NetworkLab/OrganizationConnections';
import InfluencerDiscoveryCard from '@/components/NetworkLab/InfluencerDiscovery';
import EntityPolarizationSentimentCard from '@/components/NetworkLab/EntityPolarizationSentiment';
import PowerCouplesCard from '@/components/NetworkLab/PowerCouples';
import CoOccurrenceMatrixCard from '@/components/NetworkLab/CoOccurrenceMatrix';
function NetworkLabPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle='Publisher & Story Tracking' />
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <InfluencerDiscoveryCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <EntityPolarizationSentimentCard />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <PowerCouplesCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <CoOccurrenceMatrixCard />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 12 }}>
          <OrganizationConnections />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default NetworkLabPage;
