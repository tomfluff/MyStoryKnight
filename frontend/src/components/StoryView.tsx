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

interface IStoryView {}

const StoryView: React.FC<IStoryView> = (props) => {
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>();

  useEffect(() => {
    scrollIntoView();
  }, []);

  return (
    <Flex direction="column" justify="flex-end" gap="sm">
      <Stack>
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Box key={i}>
              <StoryPart />
            </Box>
          ))}
      </Stack>
      <Paper p="sm" ref={targetRef}>
        <Group justify="center">
          <Skeleton height={64} w={128} />
          <Skeleton height={64} w={128} />
        </Group>
      </Paper>
    </Flex>
  );
};

export default StoryView;
