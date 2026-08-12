export interface Interval {
  intervalUnit: 'day' | 'week' | 'month' | 'year';
  amount: number;
}

export interface DashboardInterval {
  interval: Interval;
  setInterval: (interval: Interval) => void;
}



