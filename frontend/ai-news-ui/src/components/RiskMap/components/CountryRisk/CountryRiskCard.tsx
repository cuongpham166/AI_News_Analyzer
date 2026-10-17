import DashboardSection from '@/components/generic/DashboardSection';
import {
  CountryRiskChart,
  CountryRiskMetrics,
  CountryRiskNewsSidebar,
} from './components';
import { Stack } from '@mantine/core';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

interface Props {
  countryRisk?: CountryRisk[];
}
const CountryRiskCard = ({ countryRisk }: Props) => {
  const [countryName, setCountryName] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);

  const handleLocationClick = (locationData: CountryRisk) => {
    setCountryName(locationData.country);
    open();
  };

  const onClose = () => {
    close();
  }

  return (
    <DashboardSection
      title='Country Risk'
      description=' Maps country-level coverage and sentiment signals to identify regions receiving heightened or potentially adverse attention.'
      children={
        <Stack>
          <CountryRiskMetrics countryRisk={countryRisk} />
          <CountryRiskChart
            countryRisk={countryRisk}
            onLocationClick={handleLocationClick}
          />
          <CountryRiskNewsSidebar
            locationName={countryName}
            opened={opened}
            onClose={onClose}
          />
        </Stack>
      }
    />
  );
};

export default CountryRiskCard