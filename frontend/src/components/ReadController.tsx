import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Group,
  Tooltip,
  Button,
  Text,
  Badge,
  Loader,
  rem,
} from "@mantine/core";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";

type Props = {
  id?: string;
  text: string;
  autoPlay?: boolean;
};

const ReadController = ({ id, text, autoPlay }: Props) => {
  const [errorCnt, { increment }] = useCounter(0);
  const instance = getAxiosInstance();
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array>>();
  const [connection, { open: openConnection, close: closeConnection }] =
    useDisclosure(false);

  const [playing, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play();
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
    enabled: !!text,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const appendChunk = (sourceBuffer: SourceBuffer, value: Uint8Array) => {
    try {
      sourceBuffer.appendBuffer(value);
      closeConnection();
    } catch (e) {
      console.error(errorCnt, e);
      increment();
    }
  };

  useEffect(() => {
    openConnection();
    if (!audioStream?.locked) readerRef.current = audioStream?.getReader();

    if (audioRef.current && readerRef.current) {
      const mediaSource = new MediaSource();
      audioRef.current.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener(
        "sourceopen",
        () => {
          const sourceBuffer = mediaSource!.addSourceBuffer("audio/mpeg");
          sourceBuffer.mode = "sequence";

          // Update source buffer when it's ready for more data
          sourceBuffer.addEventListener("updateend", () => {
            if (!sourceBuffer?.updating) {
              readerRef.current!.read().then(({ done, value }) => {
                if (done) {
                  mediaSource!.endOfStream();
                  return;
                }
                appendChunk(sourceBuffer, value);
              });
            }
          });

          // Initial read
          readerRef.current!.read().then(({ done, value }) => {
            if (!done) {
              appendChunk(sourceBuffer, value);
            }
          });
        },
        { once: true }
      );
    }
  }, [audioStream]);

  const cleanup = useCallback(() => {
    console.log("cleanup", text);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (readerRef.current && !readerRef.current.closed) {
      readerRef.current.cancel();
      readerRef.current.releaseLock();
      readerRef.current = undefined;
    }
  }, [text]);

  useEffect(() => {
    return () => cleanup();
  }, [text]);

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
              disabled={connection || audioStream === undefined}
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
                disabled={connection || audioStream === undefined}
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
