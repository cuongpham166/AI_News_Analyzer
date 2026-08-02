export interface DeepVelocityType {
  entity: string;

  currentMentions: number;
  previousMentions: number;

  velocityPercentage: number;
  momentumScore: number;

  trendDirection: 'Rising' | 'Falling' | 'Stable';
}
