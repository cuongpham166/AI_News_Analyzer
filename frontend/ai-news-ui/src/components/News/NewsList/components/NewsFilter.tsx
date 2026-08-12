import {
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Text,
  Select,
  Group,
  SegmentedControl,
  Button,
  Collapse,
  ActionIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  ArrowDownIcon,
  ArrowSquareDownIcon,
  ArrowSquareUpIcon,
  ArrowsVerticalIcon,
  ArrowUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
const NewsFilter = () => {
  const sources = ['DW', 'UN'];
  const languages = ['en'];
  const [opened, { toggle }] = useDisclosure(false);
  const [value, setValue] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  return (
    <Paper
      p='lg'
      radius='lg'
      withBorder
      style={{
        background: ThemeColors.third,
        borderColor: ThemeColors.border,
      }}
    >
      <Stack gap='md'>
        <Group align='center' gap='sm' wrap='nowrap' justify='space-between'>
          <TextInput
            flex={1}
            placeholder='Search articles...'
            leftSection={<MagnifyingGlassIcon size={16} />}
          />
          <ActionIcon
            variant='filled'
            color='gray'
            size='input-sm'
            onClick={toggle}
            aria-label={opened ? 'Hide filters' : 'Show filters'}
          >
            {opened ? <ArrowUpIcon size={15} /> : <ArrowDownIcon size={15} />}
          </ActionIcon>
        </Group>

        <Collapse expanded={opened}>
          <Stack pt='xs' gap='md'>
            <SimpleGrid
              cols={{
                base: 1,
                sm: 3,
              }}
            >
              <Select
                label='Source'
                placeholder='All sources'
                data={[
                  {
                    value: '287',
                    label: 'DW',
                  },
                ]}
                clearable
              />

              <Select
                label='Language'
                placeholder='All languages'
                data={languages}
                clearable
              />

              <DatePickerInput
                type='range'
                label='Pick dates range'
                placeholder='Pick dates range'
                value={value}
                onChange={setValue}
              />
            </SimpleGrid>

            <Group justify='space-between' align='center'>
              <SegmentedControl
                data={[
                  { label: 'All', value: 'all' },
                  { label: 'Today', value: 'today' },
                  { label: '7 days', value: '7d' },
                  { label: '30 days', value: '30d' },
                ]}
              />
              <Group justify='flex-end' gap='sm'>
                <Button variant='filled' leftSection={<FunnelIcon size={15} />}>
                  Filter
                </Button>
                <Button
                  variant='filled'
                  color='gray'
                  leftSection={<XIcon size={15} />}
                >
                  Reset
                </Button>
              </Group>
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default NewsFilter;