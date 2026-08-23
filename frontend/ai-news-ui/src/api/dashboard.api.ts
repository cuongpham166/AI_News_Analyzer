import type Response from '@/shared/types/Response.ts';
import { publicApi } from '@/api/config.ts';
import type { RequestInterval } from '@/shared/types/DashboardInterval.ts';
import type {
  MacroPulseDetail,
  MacroPulseOverview,
} from '@/shared/types/analysis/dashboard/MacroPulse.ts';
import type { RiskMapDetail } from '@/shared/types/analysis/dashboard/RiskMap.ts';
import type { MediaBiasDetail } from '@/shared/types/analysis/dashboard/MediaBias.ts';
import type { NetworkLabDetail } from '@/shared/types/analysis/dashboard/NetworkLab.ts';

export const getMacroPulseOverviewDashboard = async (): Promise<
  Response<MacroPulseOverview>
> => {
  const { data } = await publicApi.get(
    'analysis/macro-pulse/dashboard/overview',
  );
  return data.data;
};

export const getMacroPulseDetailDashboard = async (
  requestInterval: RequestInterval,
): Promise<MacroPulseDetail> => {
  const { intervalUnit, amount, calendarInterval } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/macro-pulse/dashboard/detail?calendarInterval=${calendarInterval}&intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};

export const getRiskMapDetailDashboard = async (
  requestInterval: RequestInterval,
): Promise<RiskMapDetail> => {
  const { intervalUnit, amount } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/risk-map/dashboard?intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};

export const getMediaBiasDetailDashboard = async (
  requestInterval: RequestInterval,
): Promise<MediaBiasDetail> => {
  const { intervalUnit, amount } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/media-bias/dashboard?intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};

export const getNetworkLabDetailDashboard = async (
  requestInterval: RequestInterval,
): Promise<NetworkLabDetail> => {
  const { intervalUnit, amount } = requestInterval;
  const { data } = await publicApi.get(
    `analysis/network-lab/dashboard?intervalUnit=${intervalUnit}&amount=${amount}`,
  );
  return data.data;
};