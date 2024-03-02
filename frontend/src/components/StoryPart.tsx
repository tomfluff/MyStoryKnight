import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Box,
  Flex,
  Paper,
  Skeleton,
  useMantineColorScheme,
  Avatar,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface IStoryPart {}

const StoryPart: React.FC<IStoryPart> = (props) => {
  const alignLeft = Math.random() > 0.5;
  const { colorScheme } = useMantineColorScheme();
  const isXs = useMediaQuery("(max-width: 36em)");

  return (
    <Flex
      direction={isXs ? "column" : alignLeft ? "row-reverse" : "row"}
      gap="sm"
    >
      <Flex justify={alignLeft ? "flex-end" : "flex-start"}>
        <Avatar src="https://via.assets.so/img.jpg?w=48&h=48&tc=white&bg=gray" />
      </Flex>
      <Box maw={{ sm: "100%", md: "50%" }}>
        <Paper
          radius="md"
          p="sm"
          bg={colorScheme === "dark" ? "violet.8" : "violet.4"}
          c={"white"}
        >
          {alignLeft} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nulla convallis libero et nunc dictum, non vestibulum nunc dictum.
        </Paper>
      </Box>
      <Image
        src="https://via.assets.so/img.jpg?w=200&h=200&tc=white&bg=gray"
        alt="placeholder"
        radius="md"
      />
    </Flex>
  );
};

export default StoryPart;
