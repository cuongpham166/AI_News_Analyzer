import DashboardCard from '@/components/generic/DashboardCard';
import {EventTrackerChart, EventTrackerMetrics, EventTrackerNewsSidebar} from './components';
import { Stack } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

interface Props {
  event?: EventTracker[];
  eventMetrics?:EventTrackerMetrics;
}
const EventTrackerCard = (props:Props) => {
  const { event, eventMetrics } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const [eventName, setEventName] = useState<string>('');

  const handleEventClick = (eventData: EventTracker) => {
    setEventName(eventData.name);
    open();
  };

  const onClose = () => {
    close();
  }
  ;
  return (
    <DashboardSection
      title='Event Tracker'
      description='Tracks notable events and their geographic coverage, sentiment, and volatility to identify emerging developments and areas of interest.'
      children={
        <Stack>
          <EventTrackerMetrics metrics={eventMetrics} />
          <EventTrackerChart
            events={event}
            onLocationClick={handleEventClick}
          />
          <EventTrackerNewsSidebar
            eventName={eventName}
            opened={opened}
            onClose={onClose}
          />
        </Stack>
      }
    />
  );
}

export default EventTrackerCard;