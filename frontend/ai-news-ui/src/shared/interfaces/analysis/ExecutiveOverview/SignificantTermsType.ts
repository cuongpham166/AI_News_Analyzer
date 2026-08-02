import { useState } from 'react';

export interface SignificantTermsType {
  term: string;
  entityType:string;
  score: number;
  docCount: number;
  bgCount: number;
  historicalSharePercentage: number;
}

export interface CloudWord {
  text: string;
  value: number;
}

export interface TooltipState {
  data: SignificantTermsType;
  x: number;
  y: number;
}