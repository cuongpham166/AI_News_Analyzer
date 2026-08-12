import { Autocomplete, Group, NativeSelect } from '@mantine/core';
import { CaretDownIcon } from '@phosphor-icons/react';
import { ThemeColors } from '@/shared/constants/Colors';

const Searchbar = () => {
  return (
    <Autocomplete
      placeholder='Search articles, entities...'
      w={365}
      size='md'
      radius='md'
    />
  );
};

export default Searchbar;
