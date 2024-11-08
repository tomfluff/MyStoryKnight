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
  getLastStoryText,
  printState,
  setFinished,
  usePracticeEndingsStore,
} from "../stores/practiceEndingsStore";
import { usePreferencesStore } from "../stores/preferencesStore";
import useTranslation from "../hooks/useTranslation";
import { createCallContext } from "../utils/llmIntegration";
import { useSessionStore } from "../stores/sessionStore";
import { useDisclosure } from "@mantine/hooks";
import MotionUploadModal from "./MotionUploadModal";
import PracticeEndImprovModal from "./PracticeEndImprovModal";

type Props = {
  part: TStoryPart;
  isNew: boolean;
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
};

const PracticeEndPart = ({part, isNew, setNext }: Props) => {
  const instance = getAxiosInstance();
  const { colorScheme } = useMantineColorScheme();
  const isSm = useMediaQuery("(max-width: 48em)");
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    duration: 500,
  });

  const user_avatar = useSessionStore.use.avatar();

//   console.log("PracticeEndPart - part & isNew:", part, isNew);
//   console.log("PracticeEndPart - part.text:", part.text);

  const { data: text, isLoading: textLoading } = useTranslation(part.text);
//   console.log("PracticeEndPart - text:", text);
//   console.log("PracticeEndPart - textLoading:", textLoading);


  const autoReadStorySections = usePreferencesStore.use.autoReadStorySections();
//   const includeStoryImages = usePreferencesStore.use.includeStoryImages();

  const finished = usePracticeEndingsStore.use.finished();

  const outcome = useMutation({
    mutationKey: ["story-part"],
    mutationFn: () => {
      scrollIntoView();
      return instance
        .post("/practice/generate_storytoend")
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      console.log("Ending generated: ", data);
      appendStory(data, true); //TODO: remove story id
    },
  });

  useEffect(() => {
    if (isNew) {
      scrollIntoView();
    }
  }, [isNew, text]);

  const [captureModal, { open: openCapture, close: closeCapture }] = useDisclosure();

  const handleMotionClick =  (action: TAction) => {
    if (!action.active) return;
    openCapture();
    printState();
  };

  const handleActionClick = (action: TAction) => {
    if (!action.active) return;
    chooseAction(action);
    const story = getLastStoryText();
    if (!story) return;
    if (action.title.toLowerCase() === "finish") {
    //   ending.mutate({
    //     story: story,
    //   });
    } else if(action.title.toLowerCase() === "next") {
    //   outcome.mutate({
    //     premise: usePracticeEndingsStore.getState().premise?.desc,
    //     action: action,
    //     story: story,
    //   });
      setNext(true);
    } else { //try again
         
    }
    printState();
  };

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
        <Box maw={{ sm: "100%", md: "100%" }}>
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
              handleClick={() => handleMotionClick(action)}
            />
            }
            else {
            return <ActionButton
              key={i}
              action={action}
              handleClick={() => handleActionClick(action)}
            />
          }})}
        {(outcome.isPending) && (
          <Loader color="gray" size="md" />
        )}
      </Flex>
    </Stack>
    <PracticeEndImprovModal display={captureModal} finalAction={closeCapture}/>
    </>
  );
};

export default PracticeEndPart;
