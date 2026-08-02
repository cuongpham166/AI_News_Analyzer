import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
{
  /*Bubble size = mentions • Color = average article sentiment*/
}
const BubbleTimelineChart = () => {
  return (
    <Stack gap='xs'>
      <Title order={6} mb='xs' c={ThemeColors.primary}>
        Global Entity Trends Over Time
      </Title>
      <Text c='dimmed'>
        Top entities by news mentions for each time period. Bubble size
        represents mention count; color represents average article sentiment.
      </Text>
    </Stack>
  );
};

export default BubbleTimelineChart;
