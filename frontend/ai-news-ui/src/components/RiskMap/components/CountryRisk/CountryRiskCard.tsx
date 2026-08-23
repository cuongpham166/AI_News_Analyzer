import DashboardSection from '@/components/generic/DashboardSection';
import { CountryRiskChart, CountryRiskMetrics } from './components';
import { Stack } from '@mantine/core';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';

interface Props {
  countryRisk?: CountryRisk[];
}
const CountryRiskCard = ({ countryRisk }: Props) => {
  return (
    <DashboardSection
      title='Country Risk'
      description=' Maps country-level coverage and sentiment signals to identify regions receiving heightened or potentially adverse attention.'
      children={
        <Stack>
          <CountryRiskMetrics countryRisk={countryRisk}/>
          <CountryRiskChart countryRisk={countryRisk}/>
        </Stack>
      }
    />
  );
};

export default CountryRiskCard