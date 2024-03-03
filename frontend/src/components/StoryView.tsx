import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Flex,
  Skeleton,
  Box,
  Group,
  Paper,
  Button,
  Stack,
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
    <Box>
      <Group align="center" justify="center">
        <Flex
          w={{ xs: "100%", sm: "80%", md: "70%" }}
          direction="column"
          justify="flex-end"
          gap="sm"
        >
          <Stack>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <StoryPart key={i} />
              ))}
          </Stack>
          <Paper>
            <Group justify="center" ref={targetRef}>
              <Skeleton height={64} w={128} />
              <Skeleton height={64} w={128} />
              <Button onClick={increment}>Load more</Button>
            </Group>
          </Paper>
        </Flex>
      </Group>
    </Box>
  );
};

export default StoryView;
