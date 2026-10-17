import { SimpleGrid } from '@mantine/core';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';
import React, { useMemo } from 'react';
import type { EventTrackerMetrics } from '@/shared/types/analysis/risk_map/EventTrackerMetrics.ts';

interface EventTrackerMetricsProps {
  metrics?: EventTrackerMetrics;
}

const EventTrackerMetrics = ({ metrics }: EventTrackerMetricsProps) => {
  const formattedData = useMemo(() => {
    if (!metrics) {
      return {
        eventsTracked: '0',
        totalMentions: '0',
        avgSentimentDisplay: '0.00',
        avgVolatilityDisplay: '0.00',
        highRiskEvents: '0',
        overallRiskDisplay: '0%',
      };
    }

    const {
      eventsTracked = 0,
      totalMentions = 0,
      positiveVolume = 0,
      negativeVolume = 0,
      avgSentiment = 0,
      avgVolatility = 0,
      highRiskEvents = 0,
    } = metrics;

    const riskIndex =
      totalMentions > 0 ? (negativeVolume / totalMentions) * 100 : 0;

    return {
      eventsTracked: eventsTracked.toLocaleString(),
      totalMentions: totalMentions.toLocaleString(),
      avgSentimentDisplay:
        avgSentiment > 0
          ? `+${avgSentiment.toFixed(2)}`
          : avgSentiment.toFixed(2),
      avgVolatilityDisplay: avgVolatility.toFixed(2),
      highRiskEvents: highRiskEvents.toLocaleString(),
      overallRiskDisplay: `${Math.round(riskIndex)}%`,
    };
  }, [metrics]);

  const cards = [
    {
      title: 'Events Tracked',
      value: formattedData.eventsTracked,
      tooltip:
        'Total distinct events identified across geographic news coverage.',
    },
    {
      title: 'Total Mentions',
      value: formattedData.totalMentions,
      tooltip: 'Volume of news articles associated with tracked events.',
    },
    {
      title: 'Avg. Sentiment',
      value: formattedData.avgSentimentDisplay,
      tooltip: 'Average sentiment score across all tracked event coverage.',
    },
    {
      title: 'Avg. Volatility',
      value: formattedData.avgVolatilityDisplay,
      tooltip:
        'Average sentiment standard deviation indicating coverage stability.',
    },
    {
      title: 'High Risk Events',
      value: formattedData.highRiskEvents,
      tooltip: 'Number of events with risk index (negative share) ≥ 50%.',
    },
    {
      title: 'Overall Risk Index',
      value: formattedData.overallRiskDisplay,
      tooltip: 'Share of overall event coverage driven by negative news.',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 3 }} spacing='md'>
      {cards.map((item, index) => (
        <MapMetricsCard
          key={item.title}
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