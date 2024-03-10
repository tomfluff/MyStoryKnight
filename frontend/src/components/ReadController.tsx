import { useEffect, useRef } from "react";
import { Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import getAxiosInstance from "../utils/axiosInstance";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";

type Props = {
  id?: string;
  text: string;
  autoPlay?: boolean;
};

const ReadController = ({ text, autoPlay }: Props) => {
  const instance = getAxiosInstance();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      if (audioRef.current) {
        audioRef.current.play();
      } else {
        audioRef.current = new Audio(
          `${instance.defaults.baseURL}/read?text=${text}`
        );
        audioRef.current.oncanplay = () => {
          audioRef.current?.play();
        };
      }
    },
    onClose: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
  });

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    audioRef.current = null;
  }, [text]);

  if (!text) return null;

  return (
    <Group justify="space-between" align="center">
      <Group gap="xs">
        <Button
          variant="filled"
          size="xs"
          radius="xl"
          onClick={playing ? close : open}
          color={"gray"}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </Button>

        <Button
          variant="filled"
          size="xs"
          radius="xl"
          color="gray"
          disabled={!playing}
          onClick={reset}
        >
          <FaRotateLeft />
        </Button>
      </Group>
      <audio
        ref={audioRef}
        autoPlay={autoPlay}
        onPlay={open}
        onPause={close}
        onEnded={close}
        preload="none"
      />
    </Group>
  );
};

export default ReadController;
