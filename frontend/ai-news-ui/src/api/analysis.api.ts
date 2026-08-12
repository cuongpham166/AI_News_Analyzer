import { publicApi} from '@/api/config.ts';
import type Response from '@/shared/types/Response.ts';
import type {
  GlobalTrends,
  TopicRadar,
  GlobalEntitiesTrends,
} from '@/shared/types/analysis';


export const getPowerCouples = async ():Promise<Response<any>> => {
  const { data } = await publicApi.get('/power_couple');
  return data;
};

export const getGlobalTrends = async (): Promise<Response<GlobalTrends>> => {
  const { data } = await publicApi.get('/global_trends');
  return data;
};

export const getTopicRadars = async (): Promise<Response<TopicRadar[]>> => {
  const { data } = await publicApi.get('/top_radar');
  return data;
}

export const getGlobalEntitiesTrends = async (): Promise<Response<GlobalEntitiesTrends>> => {
  const { data } = await publicApi.get('/global_entity_trends');
  return data;
};