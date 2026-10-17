import { useQuery } from '@tanstack/react-query';
import {
  getCountryGraphNews,
  getEventGraphNews,
  getLocationGraphNews,
  getNewsByContentHash,
  getNewsById,
  getNewsList,
  getSimilarNewsByContentHash,
  getSimilarNewsById,
} from '@/api/news.api.ts';
import { useDashboardIntervalStore } from '@/stores/dashboard.store.ts';

export const useNewsList = (limit: number) => {
  return useQuery({
    queryKey: ['newsList'],
    queryFn: () => getNewsList(limit),
  });
};

export const useDetailNews = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['detailNews', id],
    queryFn: () => getNewsById(id),
    enabled: enabled && !!id,
  });
};

export const useDetailNewsByContentHash = (
  contentHash: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['detailNewsByContentHash', contentHash],
    queryFn: () => getNewsByContentHash(contentHash),
    enabled: enabled && !!contentHash,
  });
};

export const useSimilarNews = (id: string, limit: number, enabled = true) => {
  return useQuery({
    queryKey: ['similarNews', id, limit],
    queryFn: () => getSimilarNewsById(id, limit),
    enabled: enabled && !!id,
  });
};

export const useSimilarNewsByContentHash = (
  contentHash: string,
  limit: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['similarNewsByContentHash', contentHash, limit],
    queryFn: () => getSimilarNewsByContentHash(contentHash, limit),
    enabled: enabled && !!contentHash,
  });
};

export const useLocationGraphNews = (locationName: string) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );

  return useQuery({
    queryKey: [
      'locationGraphNews',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      locationName,
    ],
    queryFn: () =>
      getLocationGraphNews(
        appliedInterval.intervalUnit,
        appliedInterval.amount,
        locationName,
      ),
    enabled: Boolean(locationName && locationName.trim() !== ''),
  });
};

export const useCountryGraphNews = (countryName: string) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );

  return useQuery({
    queryKey: [
      'countryGraphNews',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      countryName,
    ],
    queryFn: () =>
      getCountryGraphNews(
        appliedInterval.intervalUnit,
        appliedInterval.amount,
        countryName,
      ),
    enabled: Boolean(countryName && countryName.trim() !== ''),
  });
};

export const useEventGraphNews = (eventName: string) => {
  const appliedInterval = useDashboardIntervalStore(
    (state) => state.appliedInterval,
  );

  return useQuery({
    queryKey: [
      'eventGraphNews',
      appliedInterval.intervalUnit,
      appliedInterval.amount,
      eventName,
    ],
    queryFn: () =>
      getEventGraphNews(
        appliedInterval.intervalUnit,
        appliedInterval.amount,
        eventName,
      ),
    enabled: Boolean(eventName && eventName.trim() !== ''),
  });
};
