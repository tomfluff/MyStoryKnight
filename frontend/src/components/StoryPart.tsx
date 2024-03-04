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
import { TStoryPart } from "../types/Story";


const StoryPart = ({ text, trigger, image }: TStoryPart) => {
  const { colorScheme } = useMantineColorScheme();
  const isSm = useMediaQuery("(max-width: 48em)");

  return (
    <Flex
      direction={isSm ? "column" : "row"}
      gap="sm"
    >
      <Group
        gap="sm"
        align="start"
        justify={"flex-start"}
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
            {text}
          </Paper>
          <ReadController
            text={text}
          />
        </Stack>
      </Box>
      <Group
        gap="sm"
        align="start"
        justify={"flex-end"}
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
