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
import { useMutation, useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";

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

  const [playing, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      if (!speech.data) speech.mutate(text);
      else if (audioRef.current) audioRef.current.play();
    },
    onClose: () => {
      console.log("onClose")
      if (audioRef.current) audioRef.current.pause();
    },
  });

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }};

  const read = async (text: string) => {
    const response = await fetch(`${instance.defaults.baseURL}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
      }),
    });
    return response.body;
  };

  const speech = useMutation({
    mutationKey: ["audio"],
    mutationFn: (text: string) => read(text),
    onSuccess: (data) => {
      const audioStream = data;
      console.log("audioStream", audioStream);
      if (!audioStream?.locked) readerRef.current = audioStream?.getReader();

      if (audioRef.current && readerRef.current) {
        const mediaSource = new MediaSource();
        audioRef.current.src = URL.createObjectURL(mediaSource);
        audioRef.current.oncanplay = () => {
          audioRef.current.play();
        };

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
    },
    onError: (error) => {
      increment();
    },
  });

  const appendChunk = (sourceBuffer: SourceBuffer, value: Uint8Array) => {
    try {
      sourceBuffer.appendBuffer(value);
    } catch (e) {
      console.error(errorCnt, e);
      increment();
    }
  };


  useEffect(() => {
    return () => {
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
    };
  }, [text]);

  useEffect(() => {
    console.log("autoPlay", autoPlay)
    if (autoPlay) {
      open();
    }
  }, [autoPlay]);

  return (
    <Group justify="space-between" align="center">
      {speech.isError ? (
        <Badge size="xs" color="red">
          Error: {speech.error?.message}
        </Badge>
      ) : (
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
          {speech.isSuccess ? (
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
          ) : null}
          {speech.isPending ? <Loader size="xs" color="gray.3" /> : null}
        </Group>
      )}
      <audio ref={audioRef} onPlay={open} onPause={close} />
    </Group>
  );
};

export default ReadController;
