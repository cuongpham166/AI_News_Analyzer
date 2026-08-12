import { Center, Stack, Text, ThemeIcon } from '@mantine/core';


function EmptyChartState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Center h={500}>
      <Stack align='center' gap='xs' maw={420} ta='center'>
        <ThemeIcon size={48} radius='xl' variant='light' color='gray'>

        </ThemeIcon>

        <Text fw={600} size='sm'>
          {title}
        </Text>

        <Text c='dimmed' size='sm'>
          {description}
        </Text>
      </Stack>
    </Center>
  );
}

export default EmptyChartState;
