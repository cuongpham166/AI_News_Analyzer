import type { EchoChamber } from '@/shared/types/analysis/EchoChamber.ts';

export const getArticleCount = (item: EchoChamber) =>
  item.publishers.reduce((sum, publisher) => sum + publisher.articleCount, 0);

export const getPublisherCount = (item: EchoChamber) => {
  return item.publishers.length;
};

export const hasCrossPublisherPropagation = (item: EchoChamber) =>
  item.publishers.length > 1;

export const hasCrossPublisherDuplication = (data: EchoChamber[]) =>
  data.some(hasCrossPublisherPropagation);

export const truncate = (value: string, length = 70) =>
  value.length > length ? `${value.slice(0, length)}…` : value;


