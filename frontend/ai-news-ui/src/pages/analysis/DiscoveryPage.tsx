import { Grid, Stack } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';

function DiscoveryPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle={'Discovery'} />
      <Grid gap='md'>
        <Grid.Col span={9} style={{ height: '90%' }}>

        </Grid.Col>
        <Grid.Col span={3} style={{ height: '90%' }}>

        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default DiscoveryPage;
