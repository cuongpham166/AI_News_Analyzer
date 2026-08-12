interface Entity {
  value:string;
  entity_type:string;
}

export interface ImpactArticle {
  sentiment: number;
  topic: string;
  entities: Entity[];
  summary: string;
  link: string;
  title: string;
  source: string;
  ['@timestamp']: string;
  sentiment_label: string;
  publish_date: number;
  full_text: string | null;
}