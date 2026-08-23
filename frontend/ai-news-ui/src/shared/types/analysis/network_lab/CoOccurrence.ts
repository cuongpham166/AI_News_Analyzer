export interface CoOccurrence {
  entityA: string;
  typeA: string;
  entityB: string;
  typeB: string;
  sharedCount: number;
  avgSentiment: number;
}