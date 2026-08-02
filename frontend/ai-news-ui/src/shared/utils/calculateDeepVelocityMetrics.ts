export const calculateMomentumScore = (currentMentions: number,velocityPercentage: number):number => {
  const volumeScore = Math.log10(currentMentions + 1) * 40;
  const velocityScore = Math.min(velocityPercentage, 1000) / 10;
  return Math.min(Math.round(volumeScore + velocityScore), 100);
}

export const calculateTrendDirection = (currentMentions: number,previousMentions: number): 'Rising' | 'Falling' | 'Stable' => {
  if(currentMentions > previousMentions){
    return "Rising";
  }
  if (currentMentions < previousMentions) {
    return 'Falling';
  }
  return 'Stable';
};