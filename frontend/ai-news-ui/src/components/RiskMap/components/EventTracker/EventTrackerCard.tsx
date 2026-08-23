import DashboardCard from '@/components/generic/DashboardCard';
import {EventTrackerChart, EventTrackerMetrics} from './components';
import { Stack } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';

interface Props {
  event?: EventTracker[];
  eventMetrics?:EventTrackerMetrics;
}
const EventTrackerCard = (props:Props) => {
  const { event, eventMetrics } = props;
  return (
    <DashboardSection
      title='Event Tracker'
      description='Tracks notable events and their geographic coverage, sentiment, and volatility to identify emerging developments and areas of interest.'
      children={
        <Stack>
          <EventTrackerMetrics event={event} eventMetrics={eventMetrics} />
          <EventTrackerChart  event={event} />
        </Stack>
      }
    />
  );
}

export default EventTrackerCard;