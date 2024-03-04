import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Box,
  Flex,
  Paper,
  useMantineColorScheme,
  Avatar,
  Group,
  Stack,
} from "@mantine/core";
import { useId, useMediaQuery } from "@mantine/hooks";
import ReadController from "./ReadController";

type Props = {
  id: number;
};

const StoryPart = ({ id }: Props) => {
  const alignLeft = Math.random() > 0.5;
  const { colorScheme } = useMantineColorScheme();
  const isSm = useMediaQuery("(max-width: 48em)");

  return (
    <Flex
      direction={isSm ? "column" : alignLeft ? "row-reverse" : "row"}
      gap="sm"
    >
      <Group
        gap="sm"
        align="start"
        justify={alignLeft ? "flex-start" : "flex-end"}
      >
        <Avatar src="https://via.assets.so/img.jpg?w=48&h=48&tc=white&bg=gray" />
      </Group>
      <Box maw={{ sm: "100%", md: "50%" }}>
        <Stack gap="xs">
          <Paper
            radius="md"
            p="sm"
            bg={colorScheme === "dark" ? "violet.8" : "violet.4"}
            c={"white"}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            convallis libero et nunc dictum, non vestibulum nunc dictum.
          </Paper>
          <ReadController
            id={id}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero et nunc dictum, non vestibulum nunc dictum."
          />
        </Stack>
      </Box>
      <Group
        gap="sm"
        align="start"
        justify={alignLeft ? "flex-end" : "flex-start"}
      >
        <Image
          src="https://via.assets.so/img.jpg?w=200&h=200&tc=white&bg=gray"
          alt="placeholder"
          radius="md"
          w={200}
          h="auto"
        />
      </Group>
    </Flex>
  );
};

export default StoryPart;
