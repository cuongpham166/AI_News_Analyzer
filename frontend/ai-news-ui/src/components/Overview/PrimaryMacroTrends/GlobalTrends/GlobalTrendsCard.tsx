import GlobalTrendsChart from './components/GlobalTrendsChart/GlobalTrendsChart.tsx';
import {
  Box,
  Paper,
  Title,
  Group,
  Text,
  SegmentedControl,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import globalTrendsData from '@/shared/test_data/GlobalTrendsData.ts';
function GlobalTrendsCard() {
  return (
    <MetricCard>
      <Group justify='space-between'>
        <Title order={5} mb='xs' c={ThemeColors.primary}>
          Global Topic Trends
        </Title>
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <SegmentedControl data={['Day', 'Month', 'Year']} />
        </Group>
      </Group>

      <Box style={{ flex: 1, minHeight: 0 }}>
        <GlobalTrendsChart data={globalTrendsData.data} />
      </Box>
    </MetricCard>
  );
}

export default GlobalTrendsCard;
