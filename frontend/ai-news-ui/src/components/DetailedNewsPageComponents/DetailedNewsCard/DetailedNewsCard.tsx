import { Blockquote, Paper, Stack, Text, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors';


function DetailedNewsCard() {
  return (
    <Paper
      p='lg'
      h='calc(100vh - 120px)'
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: ThemeColors.third,
      }}
    >
      <Stack>
        {/*Headline Seaction */}
        <Stack>
          <Title order={3} style={{ color: ThemeColors.primary }}>
            Test
          </Title>
          <Text size='md'>ddd</Text>
        </Stack>

        <Blockquote
          color={ThemeColors.primary}
          radius='md'
          cite='– Summarized by distilbart-cnn-12-6'
          mt='xs'
        >

        </Blockquote>
        <Text size='md'></Text>
      </Stack>
    </Paper>
  );
}

export default DetailedNewsCard;
