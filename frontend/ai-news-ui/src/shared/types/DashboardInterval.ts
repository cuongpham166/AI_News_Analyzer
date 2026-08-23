export interface Interval {
  intervalUnit: 'day' | 'week' | 'month' | 'year';
  amount: number;
}

export interface DashboardInterval {
  interval: Interval;
  setInterval: (interval: Interval) => void;
}

export interface RequestInterval {
  intervalUnit: string;
  amount: number;
  calendarInterval?: string;
  topN?: number;
  isPositive?:boolean
}

export type CalendarInterval = 'day' | 'month' | 'year';