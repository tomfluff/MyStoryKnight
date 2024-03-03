import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Flex,
  Text,
  Skeleton,
  Box,
  Group,
  Paper,
  Button,
  Stack,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import StoryPart from "./StoryPart";

type Props = {};

const StoryView = (props: Props) => {
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>();

  useEffect(() => {
    scrollIntoView();
  }, []);

  return (
    <Group align="center" justify="center">
      <Flex
        w={{ xs: "100%", sm: "80%", md: "70%" }}
        direction="column"
        justify="flex-end"
        gap="sm"
      >
        <Stack>
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <StoryPart key={i} />
            ))}
        </Stack>
        <Paper ref={targetRef}>
          <Group justify="center">
            <Skeleton height={64} w={128} />
            <Skeleton height={64} w={128} />
          </Group>
        </Paper>
      </Flex>
    </Group>
  );
};

export default StoryView;
