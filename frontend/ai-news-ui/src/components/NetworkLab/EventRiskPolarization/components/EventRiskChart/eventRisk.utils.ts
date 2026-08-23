import {
  VOLATILITY_THRESHOLDS,
  VOLATILITY_COLORS,
} from '@/shared/constants/VolatilityLevel.ts';

export const getVolatilityLevel = (volatility: number): VolatilityLevel => {
  if (volatility >= VOLATILITY_THRESHOLDS.high) {
    return 'high';
  }

  if (volatility >= VOLATILITY_THRESHOLDS.moderate) {
    return 'moderate';
  }

  return 'low';
};

export const getVolatilityColor = (volatility: number): string =>
  VOLATILITY_COLORS[getVolatilityLevel(volatility)];