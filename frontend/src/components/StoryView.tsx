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
} from "@mantine/core";
import { useScrollIntoView, useCounter } from "@mantine/hooks";
import StoryPart from "./StoryPart";
import { useMutation, useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { startStory, useAdventureStore } from "../stores/adventureStore";
import { TAction } from "../types/Story";
import ActionButton from "./ActionButton";

type Props = {};

const StoryView = (props: Props) => {
  const instance = getAxiosInstance();
  const { id, character, premise, story } = useAdventureStore();

  const actions = useMutation({
    mutationKey: ["actions"],
    mutationFn: (context: any) => {
      return instance
        .post("/story/actions", { ...context })
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { isError, isLoading, isSuccess } = useQuery({
    queryKey: ["init-story", id],
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
          startStory(Date.now(), res.data.data);
          actions.mutate({ character, ...res.data.data });
          return res.data;
        });
    },
    enabled: !!character && !!premise,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    duration: 250,
  });

  useEffect(() => {
    scrollIntoView({
      alignment: "start",
    });
  }, [story?.parts.length]);

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

  return (
    <Box component={Group} align="center" justify="center">
      <Grid w="100%">
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          <Stack>
            {story &&
              story.parts.map((part, i) => (
                <StoryPart key={i} text={part.text} />
              ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          {actions.isPending && (
            <Center>
              <Loader color="gray" size="lg" type="dots" />
            </Center>
          )}
          {actions.isSuccess && (
            <Group justify="center" ref={targetRef}>
              {actions.data.list.map((item: TAction, i: number) => (
                // <Button key={i}>{item.action}</Button>
                <ActionButton key={i} {...item} />
              ))}
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default StoryView;
