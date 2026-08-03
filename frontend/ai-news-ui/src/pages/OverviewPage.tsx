import { Stack } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import KpiMetricsHeader from '@/components/Overview/KpiMetricsHeader';
import PrimaryMacroTrends from '@/components/Overview/PrimaryMacroTrends';
import EntityTopicIntelligenceBreakdown from '@/components/Overview/EntityTopicIntelligenceBreakdown';
import DeepVelocityCard from '@/components/Overview/DeepVelocity';
function OverviewPage() {
  return (
    <Stack>
      <Taskbar taskbarTitle='Macro Pulse' />
      <KpiMetricsHeader />
      <PrimaryMacroTrends />
      <EntityTopicIntelligenceBreakdown />
      <DeepVelocityCard/>
    </Stack>
  );
}

export default OverviewPage;
