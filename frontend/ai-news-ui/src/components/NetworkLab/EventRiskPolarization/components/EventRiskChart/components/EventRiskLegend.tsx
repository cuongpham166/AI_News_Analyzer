import {
  Box,
  ColorSwatch,
  Group,
  Text,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
const EventRiskLegend = () => {
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
          Positive Volume
        </Text>
      </Group>
      <Group key={2} gap={6} wrap='nowrap'>
        <ColorSwatch color={NEWS_SENTIMENT_COLORS['negative']} size={10} />
        <Text size='sm' c={ThemeColors.text} style={{ whiteSpace: 'nowrap' }}>
          Negative Volume
        </Text>
      </Group>
    </Box>
  );
};


export default EventRiskLegend;