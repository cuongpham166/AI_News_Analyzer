import MetricCard from '@/components/generic/MetricCard';
import { Box, Grid, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import InfluencerDiscoveryChart
  from '@/components/NetworkLab/InfluenceHub/InfluencerDiscovery/components/InfluencerDiscoveryChart.tsx';
import TopInfluencersBarRanking
  from '@/components/NetworkLab/InfluenceHub/InfluencerDiscovery/components/TopInfluencersBarRanking.tsx';
import InfluencerNetworkData from '@/shared/test_data/InfluencerNetworkData.ts';
const InfluencerDiscoveryCard = () => {
  return (
    <MetricCard>
      <Title order={5} mb='xs' c={ThemeColors.primary}>
        Influencer & Discovery
      </Title>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <Grid>
          <Grid.Col span={8}>
            <InfluencerDiscoveryChart data={InfluencerNetworkData.data} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TopInfluencersBarRanking data={InfluencerNetworkData.data} />
          </Grid.Col>
        </Grid>
      </Box>
    </MetricCard>
  );
}

export default InfluencerDiscoveryCard;