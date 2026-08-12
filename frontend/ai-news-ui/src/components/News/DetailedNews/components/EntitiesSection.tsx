import type { DetailedNews } from '@/shared/types/DetailedNews.ts';
import { Group, Stack, Text, Badge } from '@mantine/core';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

const EntitiesSection = ({
  entities,
}: DetailedNews['inference']['entities']) => {
  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Entities
      </Text>

      <Group gap='xs'>
        {entities.map((entity) => (
          <Badge
            key={entity.id}
            variant='light'
            color={NEWS_ENTITY_COLORS[entity.type]}
          >
            {entity.value}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};

export default EntitiesSection;