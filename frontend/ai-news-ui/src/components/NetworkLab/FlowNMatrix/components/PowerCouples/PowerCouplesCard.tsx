import MetricCard from '@/components/generic/MetricCard';
import { Box, Grid, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const PowerCouplesCard = () => {
  return (
    <MetricCard>
      <Title order={5} mb='xs' c={ThemeColors.primary}>
        Power Couples (Sankey Diagram)
      </Title>
      <Box style={{ flex: 1, minHeight: 0 }}></Box>
    </MetricCard>
  );
};

export default PowerCouplesCard;
