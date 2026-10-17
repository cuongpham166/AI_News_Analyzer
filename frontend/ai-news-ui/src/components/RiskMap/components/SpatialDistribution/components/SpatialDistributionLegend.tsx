import {
  Box,
  ColorSwatch,
  Group,
  Text,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
const SpatialDistributionLegend = () => {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, max-content)',
        gap: '8px 12px',
      }}
    >
      <Group key={1} gap={6} wrap='nowrap'>
        <ColorSwatch color={NEWS_SENTIMENT_COLORS['positive']} size={10} />
        <Text size='sm' c={ThemeColors.text} style={{ whiteSpace: 'nowrap' }}>
          Positive Sentiment (≥ 0.10)
        </Text>
      </Group>
      <Group key={2} gap={6} wrap='nowrap'>
        <ColorSwatch color={NEWS_SENTIMENT_COLORS['default']} size={10} />
        <Text size='sm' c={ThemeColors.text} style={{ whiteSpace: 'nowrap' }}>
          Neutral Sentiment
        </Text>
      </Group>
      <Group key={2} gap={6} wrap='nowrap'>
        <ColorSwatch color={NEWS_SENTIMENT_COLORS['negative']} size={10} />
        <Text size='sm' c={ThemeColors.text} style={{ whiteSpace: 'nowrap' }}>
          Negative Sentiment (≤ -0.10)
        </Text>
      </Group>
    </Box>
  );
};


export default SpatialDistributionLegend;