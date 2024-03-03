import React from "react";
import { Group, Tooltip, Button, Text, Badge } from "@mantine/core";
import useAudioStream from "../hooks/useAudioStream";
import { useDisclosure } from "@mantine/hooks";
import { FaPlay, FaStop } from "react-icons/fa";

type Props = {
  content: string;
};

const ReadSection = ({ content }: Props) => {
  const { isPlaying, audioRef, playAudioStream, stopAudioStream } =
    useAudioStream();
  const [_, { toggle }] = useDisclosure(false, {
    onOpen: () => {
      playAudioStream(content);
    },
    onClose: () => {
      stopAudioStream();
    },
  });
  const handleReadContent = () => {
    toggle();
  };
  return (
    <Group justify="space-between" align="center">
      <Tooltip label="Click to read" position="bottom" withArrow>
        <Button
          variant="filled"
          size="xs"
          radius="xl"
          onClick={handleReadContent}
          color={isPlaying ? "red" : "gray"}
        >
          {isPlaying ? <FaStop /> : <FaPlay />}
        </Button>
      </Tooltip>
      <audio ref={audioRef} />
    </Group>
  );
};

export default ReadSection;
