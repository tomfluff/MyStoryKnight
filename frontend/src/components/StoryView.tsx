import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Flex,
  Skeleton,
  Box,
  Group,
  Paper,
  Button,
  Stack,
  Grid,
} from "@mantine/core";
import { useScrollIntoView, useCounter } from "@mantine/hooks";
import StoryPart from "./StoryPart";

type Props = {};

const StoryView = (props: Props) => {
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    duration: 250,
  });
  const [count, { increment }] = useCounter(0);

  useEffect(() => {
    scrollIntoView({
      alignment: "start",
    });
  }, [count]);

  return (
    <Box component={Group} align="center" justify="center">
      <Grid w="100%">
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          <Stack>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <StoryPart key={i} />
              ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          <Group justify="center" ref={targetRef}>
            <Skeleton height={64} w={128} />
            <Skeleton height={64} w={128} />
            <Skeleton height={64} w={128} />
            <Button onClick={increment}>Load more</Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default StoryView;
