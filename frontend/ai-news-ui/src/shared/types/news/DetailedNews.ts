interface EntityType {
  id: number;
  name: string;
}

interface Entity{
  id: number;
  value:string;
  type:EntityType
}

interface Keyphrase {
  id: number;
  value:string;
}

export interface DetailedNews {
  id: string;
  title: string;
  publishDate: string;
  link: string;
  language: string;
  fullText: string;
  source: {
    id: number;
    name: string;
  };
  inference: {
    summary: string;
    sentiment: {
      label: string;
      score: number;
    };
    topic: {
      id: number;
      name: string;
    };
    keyphrases: Keyphrase[];
    entities: Entity[];
  };
}