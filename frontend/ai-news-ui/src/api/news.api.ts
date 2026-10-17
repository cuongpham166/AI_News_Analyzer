import { publicApi } from '@/api/config.ts';
import type { News } from '@/shared/types/news/News.ts';
import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import type { SimilarNews } from '@/shared/types/news/SimilarNews.ts';
import type { GraphNews } from '@/shared/types/news/GraphNews.ts';

export const getNewsList = async (limit: number): Promise<News[]> => {
  const { data } = await publicApi.get(`news/all?limit=${limit}`);
  return data.data;
};

export const getNewsById = async (id: string): Promise<DetailedNews> => {
  const { data } = await publicApi.get(`news/detail?id=${id}`);
  return data.data;
};

export const getNewsByContentHash = async (
  contentHash: string,
): Promise<DetailedNews> => {
  const { data } = await publicApi.get(
    `news/detail?contentHash=${contentHash}`,
  );
  return data.data;
};

export const getSimilarNewsById = async (
  id: string,
  limit: number,
): Promise<SimilarNews[]> => {
  const { data } = await publicApi.get(
    `news/similar?limit=${limit}&currentArticleLink=${id}`,
  );
  return data;
};

export const getSimilarNewsByContentHash = async (
  contentHash: string,
  limit: number,
): Promise<SimilarNews[]> => {
  const { data } = await publicApi.get(
    `news/similar?limit=${limit}&contentHash=${contentHash}`,
  );
  return data;
};

export const getCountryGraphNews = async (
  intervalUnit: string,
  amount: number,
  countryName: string,
): Promise<GraphNews[]> => {
  if (countryName && countryName.trim() !== '') {
    const { data } = await publicApi.get(
      `analysis/risk-map/country-graph-news?intervalUnit=${intervalUnit}&amount=${amount}&countryName=${encodeURIComponent(countryName)}`,
    );
    return data;
  }
  return [];
};

export const getLocationGraphNews = async (
  intervalUnit: string,
  amount: number,
  locationName: string,
): Promise<GraphNews[]> => {
  if (locationName && locationName.trim() !== '') {
    const { data } = await publicApi.get(
      `analysis/risk-map/location-graph-news?intervalUnit=${intervalUnit}&amount=${amount}&locationName=${encodeURIComponent(locationName)}`,
    );
    return data;
  }
  return [];
};

export const getEventGraphNews = async (
  intervalUnit: string,
  amount: number,
  eventName: string,
): Promise<GraphNews[]> => {
  if (eventName && eventName.trim() !== '') {
    const { data } = await publicApi.get(
      `analysis/risk-map/event-graph-news?intervalUnit=${intervalUnit}&amount=${amount}&eventName=${encodeURIComponent(eventName)}`,
    );
    return data;
  }
  return [];
};
