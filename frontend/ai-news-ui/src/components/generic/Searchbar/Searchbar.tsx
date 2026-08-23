import { Autocomplete, Group, NativeSelect } from '@mantine/core';
import {MagnifyingGlassIcon } from '@phosphor-icons/react';
import { ThemeColors } from '@/shared/constants/Colors';

const Searchbar = () => {
  return (
    <Autocomplete
      placeholder='Search articles, entities, topics...'
      w={{ base: '100%', sm: 365 }}
      size='md'
      radius='md'
      leftSection={<MagnifyingGlassIcon size={18} />}
    />
  );
};

export default Searchbar;
