interface TopicDistribution {
  name: string;
  count: number;
}

export interface TopicTooltipItem {
  name: string;
  value: string | number;
}
export interface TopicRadar {
  count: number;
  distribution: TopicDistribution[];
}

export interface TopicRadarLegendTooltip {
  title: string;
  items: TopicTooltipItem[];
}

