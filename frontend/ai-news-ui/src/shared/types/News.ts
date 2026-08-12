export interface News {
  id: string;
  title: string;
  link: string;
  lang: string;
  publishDate: string;
  source: {
    id: number;
    name: string;
  }
}