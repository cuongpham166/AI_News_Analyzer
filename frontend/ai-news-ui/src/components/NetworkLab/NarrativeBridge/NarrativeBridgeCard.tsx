import DashboardCard from '@/components/generic/DashboardCard';
import type { NarrativeBridge } from '@/shared/types/analysis/network_lab/NarrativeBridge.ts';
import NarrativeBridgeChart from "@/components/NetworkLab/NarrativeBridge/components/NarrativeBridgeChart";

interface Props {
  narrativeBridge?: NarrativeBridge[];
}
const NarrativeBridgeCard = ({ narrativeBridge }:Props) => {
  return (
    <DashboardCard
      title='Narrative Bridge'
      description='Connect key figures directly to their core narrative phrases to evaluate messaging stability, frequency, and sentiment.'
      children={<NarrativeBridgeChart narrativeBridge={narrativeBridge} />}
    />
  );
};

export default NarrativeBridgeCard;