import { Autocomplete, Group, NativeSelect } from '@mantine/core';
import { CaretDownIcon } from '@phosphor-icons/react';
import { ThemeColors } from '@/shared/constants/Colors';

const Searchbar = () => {
  return (
    <Group gap='sm' align='center' style={{ flex: 2 }}>
      <Autocomplete placeholder='Search' radius='sm' style={{ flex: 1 }} />
    </Group>
  );
};

export default Searchbar;
