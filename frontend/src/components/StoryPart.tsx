import { useEffect } from "react";
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
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks";
import ReadController from "./ReadController";
import { TAction, TStoryPart } from "../types/Story";
import ActionButton from "./ActionButton";
import getAxiosInstance from "../utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  appendStory,
  chooseAction,
  getStoryText,
  setFinished,
  updateActions,
  updateStoryImage,
  useAdventureStore,
} from "../stores/adventureStore";
import { usePreferencesStore } from "../stores/preferencesStore";
import useTranslation from "../hooks/useTranslation";
import { createCallContext } from "../utils/llmIntegration";
import { useSessionStore } from "../stores/sessionStore";
import { useDisclosure } from "@mantine/hooks";
import MotionUploadModal from "./MotionUploadModal";

type Props = {
  part: TStoryPart;
  isNew: boolean;
};

const StoryPart = ({ part, isNew }: Props) => {
  const instance = getAxiosInstance();
  const { colorScheme } = useMantineColorScheme();
  const isSm = useMediaQuery("(max-width: 48em)");
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    duration: 500,
  });

  const user_avatar = useSessionStore.use.avatar();

  const { data: text, isLoading: textLoading } = useTranslation(part.text);

  const autoReadStorySections = usePreferencesStore.use.autoReadStorySections();
  const includeStoryImages = usePreferencesStore.use.includeStoryImages();

  const finished = useAdventureStore.use.finished();

  const { isLoading: actionLoading } = useQuery({
    queryKey: ["actions", part.id],
    queryFn: ({ signal }) => {
      const character = useAdventureStore.getState().character;
      return instance
        .post("/story/actions", createCallContext({ part, character }), {
          signal,
        })
        .then((res) => {
          updateActions(res.data.data.list);
          scrollIntoView();
          return res.data.data.list;
        });
    },
    enabled:
      !finished &&
      (!part.actions || (!!part.actions && part.actions.length === 0)),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { isLoading: imageLoading } = useQuery({
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
          updateStoryImage(res.data.data.image_url);
          return res.data.data;
        });
    },
    enabled: !part.image && includeStoryImages,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const outcome = useMutation({
    mutationKey: ["story-part"],
    mutationFn: (context: any) => {
      scrollIntoView();
      return instance
        .post("/story/part", createCallContext({ ...context }))
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      appendStory(data);
    },
  });

  const ending = useMutation({
    mutationKey: ["story-end"],
    mutationFn: (context: any) => {
      return instance
        .post("/story/end", createCallContext(context))
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      appendStory(data);
      setFinished();
    },
  });

  const handleActionClick = (action: TAction) => {
    if (!action.active) return;
    chooseAction(action);
    const story = getStoryText()?.join(" ");
    if (!story) return;
    if (action.title.toLowerCase() === "ending") {
      ending.mutate({
        story: story,
      });
    } else {
      outcome.mutate({
        premise: useAdventureStore.getState().premise?.desc,
        action: action,
        story: story,
      });
    }
  };

  useEffect(() => {
    if (isNew) {
      scrollIntoView();
    }
  }, [isNew, text]);

  const [captureModal, { open: openCapture, close: closeCapture }] = useDisclosure();

  return (
    <>
    <Stack gap="sm">
      <Flex direction={isSm ? "column" : "row"} gap="sm">
        <Group gap="sm" align="start" justify={"flex-start"}>
          <Avatar
            src={
              part.sentiment
                ? `avatar/bot/bot${part.sentiment}.png`
                : "avatar/bot/botneutral.png"
            }
            radius="sm"
          />
        </Group>
        {includeStoryImages && (
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
        )}
        <Box maw={{ sm: "100%", md: "50%" }}>
          <Stack gap="xs">
            <Paper
              radius="md"
              p="sm"
              bg={colorScheme === "dark" ? "violet.8" : "violet.4"}
              c={"white"}
            >
              {textLoading && (
                <Loader color="white" size="sm" type="dots" p={0} m={0} />
              )}
              {text && text}
            </Paper>
            <ReadController
              id={part.id}
              text={text}
              autoPlay={isNew && autoReadStorySections}
            />
          </Stack>
        </Box>
      </Flex>
      <Flex
        ref={targetRef}
        direction={isSm ? "column" : "row-reverse"}
        justify="flex-start"
        align="flex-end"
        gap="sm"
      >
        <Avatar src={`avatar/user/${user_avatar}`} radius="sm" />
        {finished && isNew && (
          <Paper
            radius="md"
            p="sm"
            bg={colorScheme === "dark" ? "violet.8" : "violet.4"}
            c={"white"}
          >
            The story has ended
          </Paper>
        )}
        {part.actions &&
          part.actions.map((action: TAction, i: number) => {
            if (action.title.toLowerCase() === "motion capture") {
              return  <ActionButton
              key={i}
              action={action}
              handleClick={() => openCapture()}
            />
            }
            else {
            return <ActionButton
              key={i}
              action={action}
              handleClick={() => handleActionClick(action)}
            />
          }
          })}
        {(actionLoading || outcome.isPending || ending.isPending) && (
          <Loader color="gray" size="md" />
        )}
      </Flex>
    </Stack>
    <MotionUploadModal display={captureModal} finalAction={closeCapture}/>
    </>
  );
};

export default StoryPart;
