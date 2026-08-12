import MetricCard from '@/components/generic/MetricCard';
import { Box, Grid, SegmentedControl, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import DashboardCard from '@/components/generic/DashboardCard';

const CoOccurrenceMatrixCard = () => {
  return (
    <DashboardCard
      title=' Co-Occurrence Matrix (2D Heatmap Grid)'
      description=''
      children={<></>}
    />
  );
};


export default CoOccurrenceMatrixCard;