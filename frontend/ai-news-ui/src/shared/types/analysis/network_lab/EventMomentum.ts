interface EventMomentumTimeline {
  date: string,
  volume: number
}

export interface EventMomentum {
  event: string;
  timeline: EventMomentumTimeline[];
  totalVolume: number;
}