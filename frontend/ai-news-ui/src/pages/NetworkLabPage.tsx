import {Stack } from '@mantine/core';

import Taskbar from '@/components/generic/Taskbar';
import InfluenceHub from '@/components/NetworkLab/InfluenceHub';
import FlowNMatrix from '@/components/NetworkLab/FlowNMatrix';
import RelationshipMapping from '@/components/NetworkLab/RelationshipMapping';
function NetworkLabPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle='Publisher & Story Tracking' />
      <InfluenceHub />
      <FlowNMatrix />
      <RelationshipMapping />
    </Stack>
  );
}

export default NetworkLabPage;
