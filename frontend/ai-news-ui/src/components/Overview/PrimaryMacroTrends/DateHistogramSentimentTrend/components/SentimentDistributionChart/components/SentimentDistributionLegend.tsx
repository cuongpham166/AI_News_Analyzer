import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { ColorSwatch, Group, SimpleGrid, Text } from '@mantine/core';
import { topicColors } from '@/shared/constants/ChartColors.ts';
import { SENTIMENT_DISTRIBUTION_COLORS } from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentDistributionChart/sentimentDistribution.config.ts';
const SentimentDistributionLegend = () => {
  return (
    <CustomChartLegend legendName='Sentiment Guide'>
      <SimpleGrid cols={2} spacing='xs'>
        <Group gap='xs' wrap='nowrap' style={{ cursor: 'pointer' }}>
          <ColorSwatch
            color={SENTIMENT_DISTRIBUTION_COLORS['positive']}
            size={12}
          />
          <Text size='sm' fw={500}>
            Positive Sentiment
          </Text>
        </Group>
        <Group gap='xs' wrap='nowrap' style={{ cursor: 'pointer' }}>
          <ColorSwatch
            color={SENTIMENT_DISTRIBUTION_COLORS['negative']}
            size={12}
          />
          <Text size='sm' fw={500}>
            Negative Sentiment
          </Text>
        </Group>
      </SimpleGrid>
    </CustomChartLegend>
  );
}


export default SentimentDistributionLegend;