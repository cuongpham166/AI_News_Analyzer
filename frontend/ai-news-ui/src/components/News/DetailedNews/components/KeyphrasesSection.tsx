import type { DetailedNews } from '@/shared/types/DetailedNews.ts';
import { Badge, Group, Stack, Text } from '@mantine/core';

const KeyphrasesSection = ({
  keyphrases,
}: DetailedNews['inference']['keyphrases']) => {
  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Keyphrases
      </Text>

      <Group gap='xs'>
        {keyphrases.map((phrase) => (
          <Badge key={phrase.id} variant='light' color='gray'>
            {phrase.value}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};


export default KeyphrasesSection;