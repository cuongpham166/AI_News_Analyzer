export interface CloudWord {
  text: string;
  value: number;
}

export interface TooltipState {
  data: SignificantTerms;
  x: number;
  y: number;
}

export interface SignificantTerms {
  term: string;
  entityType: string;
  score: number;
  docCount: number;
  bgCount: number;
  historicalSharePercentage: number;
}


