import { Box, ColorSwatch, Group, Text } from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { NEWS_SOURCES_COLORS, NEWS_SOURCES, NEWS_SOURCES_NAMES } from '@/shared/constants/NewsSources.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const SourceCoverageSentimentLegend = () => {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px 12px',
      }}
    >
      {NEWS_SOURCES.map((item) => (
        <Group key={item} gap={6} wrap='nowrap'>
          <ColorSwatch color={NEWS_SOURCES_COLORS[item]} size={10} />
          <Text size='sm' c={ThemeColors.text}>
            {NEWS_SOURCES_NAMES[item]}
          </Text>
        </Group>
      ))}
    </Box>
  );
};


export default SourceCoverageSentimentLegend;