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
  TextInput,
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
  clear3ThingsStore,
  getLastStoryText,
  printState,
  setFinished,
  tryAgain,
  usePractice3ThingsStore,
} from "../stores/practice3ThingsStore";
import { resetPreferences, usePreferencesStore } from "../stores/preferencesStore";
import useTranslation from "../hooks/useTranslation";
import { createCallContext } from "../utils/llmIntegration";
import { resetSession, useSessionStore } from "../stores/sessionStore";
import { useDisclosure } from "@mantine/hooks";
import MotionUploadModal from "./MotionUploadModal";
import PracticeEndImprovModal from "./PracticeEndImprovModal";
import { clearStore } from "../stores/adventureStore";
import { useEffect, useState } from "react";

type Props = {
  part: TStoryPart;
  isNew: boolean;
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
};

const Practice3ThingsPart = ({part, isNew, setNext, reset }: Props) => {
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

  const finished = usePractice3ThingsStore.use.finished();

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  const validateInput = () => {
    const parts = value.split(',').map(part => part.trim());
    if (parts.length !== 3 || parts.some(part => part === '')) {
        setError('Please enter 3 items separated by commas');
        return false;
    }
    else {
        setError('');
        return true;
    }
  }

  const handleBlur = () => {
    validateInput();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        if (validateInput()) {
            // setValue('');
            setNext(true);
        }
    }
  };

  useEffect(() => {
    if (isNew) {
      scrollIntoView();
    }
  }, [isNew, text]);

  const handleEndClick = () => {
    reset();
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
        <Flex direction="row" gap="sm">
          <ActionButton
              key={"Finish"}
              action={{id: "", title: "Finish", desc: "Finish the practice and return to the main screen!", active: true, used: false}}
              handleClick={() => handleEndClick()}/>
          <TextInput
              placeholder="A cat, a dog, a mouse"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              error={error}
              style={{ width: '100%' }}
              disabled={!isNew}/>
        </Flex>
      </Flex>
    </Stack>
    </>
  );
};

export default Practice3ThingsPart;
