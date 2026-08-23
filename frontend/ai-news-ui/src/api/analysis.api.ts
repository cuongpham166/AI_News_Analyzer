import { publicApi } from '@/api/config.ts';
import type {RequestInterval} from '@/shared/types/DashboardInterval.ts'

export const getSentimentVolumeTimeline = async (requestInterval: RequestInterval) => {
  const { intervalUnit, amount, calendarInterval } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/macro-pulse/sentiment-volume-timeline?calendarInterval=${calendarInterval}&intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};

export const getGlobalTrend = async (requestInterval: RequestInterval) => {
  const { intervalUnit, amount, calendarInterval } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/macro-pulse/global-trends?calendarInterval=${calendarInterval}&intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data.timeline;
};

export const getGlobalEntityTrend = async (requestInterval:RequestInterval) => {
  const { intervalUnit, amount, calendarInterval } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/macro-pulse/global-entity-trends?calendarInterval=${calendarInterval}&intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};


export const getImpactArticles = async (requestInterval:RequestInterval) => {
  const {intervalUnit, amount, topN, isPositive} = requestInterval;
  const { data } = await publicApi.get(
    `analysis/media-bias/impact-articles?intervalUnit=${intervalUnit}&amount=${amount}&isPositive=${isPositive}&topN=${topN}`,
  );
  return data.data;
}


