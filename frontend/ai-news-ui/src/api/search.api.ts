import { publicApi } from '@/api/config.ts';
import type { SearchedNewsResult } from '@/shared/types/news/SearchedNews.ts';

export const searchNews = async (
  searchText: string,
): Promise<SearchedNewsResult[]> => {
  const { data } = await publicApi.get(`search/all?searchText=${searchText}`);
  return data;
};
