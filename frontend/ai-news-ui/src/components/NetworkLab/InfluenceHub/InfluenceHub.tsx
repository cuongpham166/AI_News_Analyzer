import { Grid } from '@mantine/core';
import EntityPolarizationSentimentCard from '@/components/NetworkLab/InfluenceHub/EntityPolarizationSentiment';
import InfluencerDiscoveryCard from '@/components/NetworkLab/InfluenceHub/InfluencerDiscovery';
function InfluenceHub() {
  return (
    <Grid gutter='md'>
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <InfluencerDiscoveryCard/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <EntityPolarizationSentimentCard/>
      </Grid.Col>
    </Grid>
  );
}

export default InfluenceHub;
