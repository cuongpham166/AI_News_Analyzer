import { useQuery } from '@tanstack/react-query';
import { searchNews } from '@/api/search.api.ts';

export const useSearchNews = (searchText: string) => {
  return useQuery({
    queryKey: ['searchNews', searchText],
    queryFn: () => searchNews(searchText),
    enabled: searchText.trim().length >= 2,
  });
};
