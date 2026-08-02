import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';

const RankingChart = () => {
  return (
    <Stack gap='xs'>
      <Title order={6} mb='xs' c={ThemeColors.primary}>
        Most Mentioned Entities
      </Title>
      <Text c='dimmed'>
        Entities ranked by total mentions across the returned time buckets.
      </Text>
    </Stack>
  );
};

export default RankingChart;
