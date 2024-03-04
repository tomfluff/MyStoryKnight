import React, { useCallback, useEffect, useRef } from "react";
import {
  Group,
  Tooltip,
  Button,
  Text,
  Badge,
  Loader,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";

type Props = {
  id?: number;
  text: string;
  autoPlay?: boolean;
};

const ReadController = ({ id, text, autoPlay }: Props) => {
  const instance = getAxiosInstance();
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const sourceBuffer = useRef<SourceBuffer | undefined>(undefined);

  const [playing, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          console.log("Playing audio");
        });
      }
    },
    onClose: () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
  });

  const read = async (text: string, signal: AbortSignal) => {
    console.log("Reading text:", text);
    const response = await fetch(`${instance.defaults.baseURL}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
      }),
      signal: signal,
    });
    return response.body;
  };

  const {
    data: audioStream,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["audio", { id, text }],
    queryFn: ({ signal }) => read(text, signal),
    refetchOnWindowFocus: false,
    enabled: !!text,
    staleTime: Infinity,
  });

  useEffect(() => {
    const reader = audioStream?.getReader();

    if (audioRef.current && reader) {
      const mediaSource = new MediaSource();
      audioRef.current.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener(
        "sourceopen",
        () => {
          sourceBuffer.current = mediaSource.addSourceBuffer("audio/mpeg");
          sourceBuffer.current.mode = "sequence";

          // Update source buffer when it's ready for more data
          sourceBuffer.current.addEventListener("updateend", () => {
            if (!sourceBuffer.current?.updating) {
              reader.read().then(({ done, value }) => {
                if (done) {
                  mediaSource.endOfStream();
                  return;
                }
                sourceBuffer.current!.appendBuffer(value);
              });
            }
          });

          // Initial read
          reader.read().then(({ done, value }) => {
            if (!done) sourceBuffer.current!.appendBuffer(value);
          });
        },
        { once: true }
      );
    }
  }, [audioStream]);

  return (
    <Group justify="space-between" align="center">
      <Tooltip label="Click to read" position="bottom" withArrow>
        {isError ? (
          <Badge size="xs" color="red">
            Error: {error?.message}
          </Badge>
        ) : (
          <Group gap="xs">
            <Button
              variant="filled"
              size="xs"
              radius="xl"
              disabled={audioStream === undefined}
              onClick={playing ? () => audioRef.current?.pause() : open}
              color={"gray"}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </Button>
            {audioStream ? (
              <Button
                variant="filled"
                size="xs"
                radius="xl"
                color="red"
                onClick={close}
              >
                <FaStop />
              </Button>
            ) : null}
            {isLoading ? <Loader size="xs" color="gray.3" /> : null}
          </Group>
        )}
      </Tooltip>
      <audio ref={audioRef} autoPlay={autoPlay} onPlay={open} onPause={close} />
    </Group>
  );
};

export default ReadController;
