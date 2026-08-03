import { Box, Grid, Title } from '@mantine/core';
import MetricCard from '@/components/generic/MetricCard';
import { ThemeColors } from '@/shared/constants/Colors.ts';


function RelationshipMapping() {
  return (
    <MetricCard>
      <Title order={5} mb='xs' c={ThemeColors.primary}>
        Relationship Mapping (Alliance Network (Bipartite / Force Graph))
      </Title>
      <Box style={{ flex: 1, minHeight: 0 }}></Box>
    </MetricCard>
  );
}

export default RelationshipMapping;