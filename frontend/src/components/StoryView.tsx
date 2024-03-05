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
  Center,
  Loader,
  Text,
  Title,
  Divider,
  rem,
} from "@mantine/core";
import StoryPart from "./StoryPart";
import { useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { startStory, useAdventureStore } from "../stores/adventureStore";

type Props = {};

const StoryView = (props: Props) => {
  const instance = getAxiosInstance();
  const { id, character, premise, story } = useAdventureStore();

  const { isError, isLoading, isSuccess } = useQuery({
    queryKey: ["story-init", id],
    queryFn: ({ signal }) => {
      return instance
        .post(
          "/story/init",
          {
            ...character,
            ...premise,
          },
          { signal }
        )
        .then((res) => {
          startStory({ start: Date.now(), ...res.data.data });
          return res.data.data;
        });
    },
    enabled: !!id && !!character && !!premise && !story,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Center>
        <Loader color="gray" size="xl" type="dots" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center>
        <Text c="red">Error loading story</Text>
      </Center>
    );
  }

  if (!story) {
    return (
      <Center>
        <Paper withBorder p="xl" radius="lg">
          <Stack align="center" gap="sm">
            <Title order={3} fs="italic">
              YOUR ADVENTURE AWAITS
            </Title>
            <Divider size="sm" w={rem(128)} />
            {!character && (
              <Text>Make sure to start the session and create a character</Text>
            )}
            {character && !premise && (
              <Text>
                Make sure to select a story premise, and start your adventure!
              </Text>
            )}
          </Stack>
        </Paper>
      </Center>
    );
  }

  return (
    <Box component={Group} align="center" justify="center">
      <Grid w="100%">
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          <Stack>
            {story &&
              story.parts.length > 0 &&
              story.parts.map((part, i) => (
                <StoryPart
                  key={i}
                  isNew={i === story.parts.length - 1}
                  part={part}
                />
              ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default StoryView;
