export interface DeepVelocity {
  entity: string;
  currentMentions: number;
  previousMentions: number;
  velocityPercentage: number;
}

interface DeepVelocityDetail extends DeepVelocity {
  momentumScore: number;
  trendDirection: 'Rising' | 'Falling' | 'Stable';
}