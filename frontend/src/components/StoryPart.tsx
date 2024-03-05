import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Box,
  Flex,
  Paper,
  useMantineColorScheme,
  Avatar,
  Group,
  Stack,
  Loader,
  Skeleton,
} from "@mantine/core";
import { useId, useMediaQuery, useScrollIntoView } from "@mantine/hooks";
import ReadController from "./ReadController";
import { TAction, TStoryPart } from "../types/Story";
import ActionButton from "./ActionButton";
import getAxiosInstance from "../utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  appendStory,
  chooseAction,
  getStoryText,
  updateActions,
  updateStoryImage,
  useAdventureStore,
} from "../stores/adventureStore";

type Props = {
  part: TStoryPart;
  isLast: boolean;
};

const StoryPart = ({ part, isLast }: Props) => {
  const instance = getAxiosInstance();
  const { colorScheme } = useMantineColorScheme();
  const isSm = useMediaQuery("(max-width: 48em)");
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    duration: 500,
  });

  const { isLoading: actionLoading, isError: actionError } = useQuery({
    queryKey: ["actions", part.id],
    queryFn: ({ signal }) => {
      const character = useAdventureStore.getState().character;
      return instance
        .post("/story/actions", { part, character }, { signal })
        .then((res) => {
          console.log(res.data.data);
          updateActions(res.data.data.list);
          scrollIntoView();
          return res.data.data.list;
        });
    },
    enabled: !part.actions || (!!part.actions && part.actions.length === 0),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { isLoading: imageLoading, isError: imageError } = useQuery({
    queryKey: ["story-image", part.id],
    queryFn: ({ signal }) => {
      return instance
        .post(
          "/story/image",
          {
            content: part.keymoment,
            style: useAdventureStore.getState().image?.style,
          },
          { signal }
        )
        .then((res) => {
          console.log(res.data.data);
          updateStoryImage(res.data.data.image_url);
          return res.data.data;
        });
    },
    enabled: !part.image,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const outcome = useMutation({
    mutationKey: ["story-part"],
    mutationFn: (context: any) => {
      scrollIntoView();
      return instance
        .post("/story/part", { ...context })
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      appendStory(data);
    },
  });

  const handleActionClick = (action: TAction) => {
    if (!action.active) return;
    chooseAction(action);
    const story = getStoryText()?.join(" ");
    if (!story) return;
    outcome.mutate({
      action: action,
      story: story,
    });
  };

  useEffect(() => {
    if (isLast) {
      scrollIntoView();
    }
  }, [isLast]);

  return (
    <Stack gap="sm">
      <Flex direction={isSm ? "column" : "row"} gap="sm">
        <Group gap="sm" align="start" justify={"flex-start"}>
          <Avatar src="https://placehold.jp/50x50.png" />
        </Group>
        <Box maw={{ sm: "100%", md: "50%" }}>
          <Stack gap="xs">
            <Paper
              radius="md"
              p="sm"
              bg={colorScheme === "dark" ? "violet.8" : "violet.4"}
              c={"white"}
            >
              {part.text}
            </Paper>
            <ReadController text={part.text} />
          </Stack>
        </Box>
        <Group gap="sm" align="start" justify="center">
          {part.image ? (
            <Image
              src={part.image}
              alt={part.keymoment}
              radius="md"
              w={240}
              h={240}
            />
          ) : (
            imageLoading && <Skeleton radius="md" w={240} h={240} />
          )}
        </Group>
      </Flex>
      <Flex
        ref={targetRef}
        direction={isSm ? "column" : "row-reverse"}
        justify="flex-start"
        align="flex-end"
        gap="sm"
      >
        <Avatar src="https://placehold.jp/50x50.png" />
        {part.actions &&
          part.actions.map((action: TAction, i: number) => (
            <ActionButton
              key={i}
              action={action}
              handleClick={() => handleActionClick(action)}
            />
          ))}
        {(actionLoading || outcome.isPending) && (
          <Loader color="gray" type="dots" size="md" />
        )}
      </Flex>
    </Stack>
  );
};

export default StoryPart;
