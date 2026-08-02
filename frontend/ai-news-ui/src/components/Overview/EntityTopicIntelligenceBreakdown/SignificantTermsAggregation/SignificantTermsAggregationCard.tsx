import {
  Box,
  Title,
  Group,
  Text,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import SignificantTermsAggregationChart
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/SignificantTermsAggregation/SignificantTermsAggregationChart';
import SignificantTermsData from '@/shared/test_data/SignificantTermsData.ts';
function SignificantTermsAggregationCard() {
  return (
    <MetricCard>
      <Stack gap="sm">
        <Title order={5} mb='xs' c={ThemeColors.primary}>
          Significant Terms
        </Title>
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <SegmentedControl
            data={['All', 'Location', 'Person', 'Organization', 'Event']}
          />
        </Group>
      </Stack>
      <Box style={{ width: '100%', height: '100%', minHeight: 0 }}>
        <SignificantTermsAggregationChart data={SignificantTermsData.data} />
      </Box>
    </MetricCard>
  );
}

export default SignificantTermsAggregationCard;