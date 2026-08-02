import { Grid } from '@mantine/core';
import CoOccurrenceMatrixCard from '@/components/NetworkLab/FlowNMatrix/components/CoOccurrenceMatrix';
import PowerCouplesCard from '@/components/NetworkLab/FlowNMatrix/components/PowerCouples';
function FlowNMatrix() {
  return (
    <Grid gutter='md'>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <PowerCouplesCard/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <CoOccurrenceMatrixCard />
      </Grid.Col>
    </Grid>
  );
}

export default FlowNMatrix;
