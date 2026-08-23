export const VOLATILITY_LEVELS = ['low', 'moderate', 'high'] as const;

export type VolatilityLevel = (typeof VOLATILITY_LEVELS)[number];

export const VOLATILITY_COLORS: Record<VolatilityLevel, string> = {
  low: '#16A34A',
  moderate: '#D97706',
  high: '#DC2626',
};

export const VOLATILITY_THRESHOLDS = {
  moderate: 0.005,
  high: 0.01,
} as const;