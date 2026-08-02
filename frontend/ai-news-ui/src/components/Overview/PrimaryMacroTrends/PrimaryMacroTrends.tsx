import { Grid } from '@mantine/core';
import GlobalTrendsCard from '@/components/Overview/PrimaryMacroTrends/GlobalTrends';
import DateHistogramSentimentTrendCard from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend';
function PrimaryMacroTrends() {
  return (
    <Grid gutter='md'>
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <DateHistogramSentimentTrendCard/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <GlobalTrendsCard />
      </Grid.Col>
    </Grid>
  );
}

export default PrimaryMacroTrends;