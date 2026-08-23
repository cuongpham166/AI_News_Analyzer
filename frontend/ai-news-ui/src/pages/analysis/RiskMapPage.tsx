import { Grid, Stack } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import RiskMapCard from '@/components/RiskMap';
import { notifications } from '@mantine/notifications';
import {useRiskMapDetailDashboard} from '@/hooks/queries/dashboard.query.ts';
import { useRef, useEffect, useState } from 'react';
import PageLoader from '@/components/generic/PageLoader';

function RiskMapPage() {
  const { data, isLoading, isFetching, error } = useRiskMapDetailDashboard();

  const wasFetching = useRef(false);

  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && data) {
      notifications.show({
        title: 'Risk & Map Dashboard updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, data]);

  if (isLoading && !data) {
    return <PageLoader />;
  }

  if (error && !data) {
    return <div>Error loading dashboard</div>;
  }


  return (
    <Stack>
      <Taskbar taskbarTitle={'Risk & Map'} />
      <Grid gap='md'>
        <Grid.Col span={12} style={{ height: '90%' }}>
          <RiskMapCard data={data}/>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default RiskMapPage;
