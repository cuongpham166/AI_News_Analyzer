import { SimpleGrid } from '@mantine/core';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';
import React from 'react';
import type { EventTrackerMetrics } from '@/shared/types/analysis/risk_map/EventTrackerMetrics.ts';
import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';


interface EventTrackerMetricsProps {
  event?: EventTracker[];
  eventMetrics?: EventTrackerMetrics;
}
const EventTrackerMetrics = (props: EventTrackerMetricsProps) => {
  const { event, eventMetrics } = props;

  const eventLocations = event
    ? new Set(event.map((item) => item.location)).size
    : 0;

  const cardData = [
    {
      title: 'Events Tracked',
      value: eventMetrics ? eventMetrics.eventsTracked : 0,
      tooltip:
        'Total number of distinct events mentioned in news coverage during the selected period.',
    },
    {
      title: 'Total Event Coverage',
      value: eventMetrics ? eventMetrics.totalEventCoverage : 0,
      tooltip:
        'Total number of unique news articles mentioning at least one tracked event during the selected period.',
    },
    {
      title: 'Avg. Sentiment',
      value: eventMetrics ? eventMetrics.avgSentiment : 0,
      tooltip:
        'Average sentiment across news articles mentioning tracked events during the selected period.',
    },
    {
      title: 'Event Locations',
      value: eventLocations,
      tooltip:
        'Number of distinct locations associated with tracked events during the selected period.',
    },
  ];
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing='md'>
      {cardData.map((item, index) => (
        <MapMetricsCard
          title={item.title}
          value={item.value}
          tooltip={item.tooltip}
          index={index}
        />
      ))}
    </SimpleGrid>
  );
};

export default EventTrackerMetrics;