import { publicApi } from '@/api/config.ts';
import type { News } from '@/shared/types/news/News.ts';
import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import type { SimilarNews } from '@/shared/types/news/SimilarNews.ts';

export const getNewsList = async (limit:number): Promise<News[]> => {
  const { data } = await publicApi.get(`news/all?limit=${limit}`);
  return data.data;
};

export const getNewsById = async (id:string): Promise<DetailedNews> => {
  const { data } = await publicApi.get(`news/detail?Id=${id}`);
  return data.data;
}

export const getSimilarNewsById = async (id: string, limit:number): Promise<SimilarNews[]> => {
  const { data } = await publicApi.get(
    `news/similar?limit=${limit}&currentArticleLink=${id}`,
  );
  console.log("getSimilarNewsById", data)
  return data;
};