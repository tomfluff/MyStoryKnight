/*
 * useAudioStream.tsx
 * This hook is used to stream audio from the backend to the frontend.
 * It uses the MediaSource API to stream the audio.
 * Using the TTS functionality from the backend.
 * Audio is streammed as soon as a playable audio chunk is available.
 *
 * @example
 * const { audioRef, isPlaying, isStreaming, playAudioStream, stopAudioStream } = useAudioStream();
 * <button onClick={() => handlePlayText(TEXT)}>Play Text</button>
 * <audio ref={audioRef} controls />
 *
 */
import { useCallback, useRef, useState } from "react";

// TODO: Fix the issue where buffer overflows and an error occures

const useAudioStream = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const mediaSource = useRef<MediaSource | undefined>(undefined);
  const sourceBuffer = useRef<SourceBuffer | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const mimeType = "audio/mpeg";
  const abortController = useRef<AbortController | undefined>(undefined); // Add AbortController

  const abortHandleCallback = async (callback: () => Promise<void>) => {
    try {
      await callback();
    } catch (e: any) {
      if (e instanceof DOMException && e.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error aborting fetch:", e);
      }
    }
  };

  const setUpMediaSource = useCallback(() => {
    if (!mediaSource.current) console.log("No media source, creating...");
    mediaSource.current = new MediaSource();

    const url = URL.createObjectURL(mediaSource.current);
    audioRef.current.oncanplay = () => {
      // Only try to play when there's enough data to start playing
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => console.error("Error playing audio:", error));
    };
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
    audioRef.current.src = url;
  }, []);

  const playAudioStream = useCallback(
    async (text: string) => {
      abortController.current = new AbortController();

      const streamUrl = "/api/read";
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: abortController.current.signal,
      };

      abortHandleCallback(async () => {
        const response = await fetch(streamUrl, fetchOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const reader = response.body?.getReader();
        const pump = async () => {
          abortHandleCallback(async () => {
            console.log("Pumping!");
            const { done, value } = await reader!.read();
            if (done) {
              mediaSource.current?.endOfStream(); // Properly end the MediaSource stream
              setIsStreaming(false);
              return;
            }

            if (sourceBuffer.current && mediaSource.current) {
              if (sourceBuffer.current.updating) {
                // Wait for the 'updateend' event before appending more data
                sourceBuffer.current.addEventListener(
                  "updateend",
                  () => {
                    sourceBuffer.current!.appendBuffer(value);
                    pump();
                  },
                  { once: true }
                );
              } else {
                sourceBuffer.current.appendBuffer(value);
                pump();
              }
            }
          });
        };

        setUpMediaSource();
        mediaSource.current?.addEventListener(
          "sourceopen",
          () => {
            console.log("Source open, adding source buffer");
            setIsStreaming(true);
            sourceBuffer.current =
              mediaSource.current?.addSourceBuffer(mimeType);
            pump();
          },
          { once: true }
        );
      });
    },
    [setUpMediaSource, mimeType]
  );

  const stopAudioStream = useCallback(() => {
    if (audioRef.current) {
      if (abortController.current) {
        abortController.current.abort();
      }

      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      audioRef.current.src = "";
      setIsPlaying(false);
      setIsStreaming(false);
    }
  }, []);

  return { audioRef, isPlaying, isStreaming, playAudioStream, stopAudioStream };
};

export default useAudioStream;
