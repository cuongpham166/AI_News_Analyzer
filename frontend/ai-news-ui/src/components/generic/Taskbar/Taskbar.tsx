import React, { type ReactNode, useState } from 'react';
import Searchbar from '../Searchbar';
import { Button, Group, NativeSelect, NumberInput, Paper, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors';
import { useGlobalInterval } from '@/shared/custom_hooks';
import { ArrowRightIcon, CaretDownIcon } from '@phosphor-icons/react';

type Props = {
  taskbarTitle: string;
};

const Taskbar: React.FC<Props> = ({ taskbarTitle }) => {
  const [intervalUnit, setIntervalUnit] = useState<string>('month');
  const [intervalAmount, setIntervalAmount] = useState<number>(6);
  const { globalInterval, setGlobalInterval } = useGlobalInterval();

  const onChangeNumberInterval = (value) => {
    setIntervalAmount(parseInt(value));
  };

  const onChangeTypeInterval = (value) => {
    switch (value) {
      case 'Days ago':
        setIntervalUnit('day');
        break;
      case 'Weeks ago':
        setIntervalUnit('week');
        break;
      case 'Months ago':
        setIntervalUnit('month');
        break;
      case 'Years ago':
        setIntervalUnit('year');
        break;
      default:
        break;
    }
  };

  const onChangeGlobalInterval = () => {
    setGlobalInterval({
      ...globalInterval,
      ...{ intervalUnit: intervalUnit, amount: intervalAmount },
    });
  };

  return (
    <Paper p='md' style={{ background: ThemeColors.third }}>
      <Group align='center' gap='lg' style={{ width: '100%' }}>
        <Title order={3} style={{ color: ThemeColors.primary }}>
          {taskbarTitle}
        </Title>
        <Group
          gap='md'
          align='center'
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Searchbar />
          <Group gap='sm' align='center'>
            <NumberInput
              name='time_value'
              defaultValue={6}
              min={1}
              max={10}
              style={{ width: 80 }}
              onChange={(value) => onChangeNumberInterval(value)}
            />
            <NativeSelect
              variant=''
              data={['Days ago', 'Weeks ago', 'Months ago', 'Years ago']}
              defaultValue='Months ago'
              rightSection={
                <CaretDownIcon size={16} color={ThemeColors.primary} />
              }
              style={{
                minWidth: 120,
                background: ThemeColors.secondary,
                color: ThemeColors.primary,
                borderRadius: 'calc(0.5rem * 1)',
              }}
              onChange={(event) =>
                onChangeTypeInterval(event.currentTarget.value)
              }
            />
            <Button
              variant='filled'
              rightSection={<ArrowRightIcon size={14} />}
              styles={{
                root: {
                  backgroundColor: ThemeColors.primary,
                  color: ThemeColors.secondary,
                  border: 'none',
                  '&:hover': {
                    backgroundColor: '#1864ab !important',
                  },
                },
              }}
              onClick={onChangeGlobalInterval}
            >
              Update
            </Button>
          </Group>
        </Group>
      </Group>
    </Paper>
  );
};

export default Taskbar;
