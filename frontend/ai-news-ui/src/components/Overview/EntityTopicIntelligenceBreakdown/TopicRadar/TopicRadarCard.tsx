import { Box, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';
import TopicRadarChart from '@/components/Overview/EntityTopicIntelligenceBreakdown/TopicRadar/components/TopicRadarChart';
import TopicRadarData from '@/shared/test_data/TopicRadarData.ts';
function TopicRadarCard() {
  return (
    <MetricCard>
      <Title order={5} mb='xs' c={ThemeColors.primary}>
        Topic Radar
      </Title>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <TopicRadarChart data={TopicRadarData.data} />
      </Box>
    </MetricCard>
  );
}

export default TopicRadarCard;
