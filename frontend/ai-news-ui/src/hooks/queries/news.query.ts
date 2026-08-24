import { useQuery } from '@tanstack/react-query';
import {
  getNewsById,
  getNewsList,
  getSimilarNewsById,
} from '@/api/news.api.ts';

export const useNewsList = (limit:number) => {
  return useQuery({
    queryKey: ['newsList'],
    queryFn: () => getNewsList(limit),
  });
};

export const useDetailNews = (id: string) => {
  return useQuery({
    queryKey: ['detailNews',id],
    queryFn: () => getNewsById(id),
  });
};

export const useSimilarNews = (id: string, limit: number) => {
  return useQuery({
    queryKey: ['similarNews', id, limit],
    queryFn: () => getSimilarNewsById(id, limit),
  });
};