interface EventMomentumTimeline {
  date: string;
  volume: number;
  positiveVolume: number;
  negativeVolume: number;
}

export interface EventMomentum {
  event: string;
  timeline: EventMomentumTimeline[];
  totalVolume: number;
}