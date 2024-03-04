import React, { useState } from "react";
import useWebcam from "../hooks/useWebcam";
import {
  Box,
  Text,
  Grid,
  Stack,
  Button,
  Container,
  Image,
  Modal,
} from "@mantine/core";
import Webcam from "react-webcam";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { useCharacterStore, setCharacter } from "../stores/characterStore";

type Props = {
  display: boolean;
  finalAction: () => void;
};

const WebcamUploadModal = ({ display, finalAction }: Props) => {
  const { webcamRef, base64Capture, capture, clear } = useWebcam();
  const [click, { toggle: toggleClick }] = useDisclosure(false);
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const uploadImage = useMutation({
    mutationKey: ["webcam"],
    mutationFn: (capture: string) => {
      return instance
        .post("/character", { image: capture, type: "jpeg" })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      const id = data.data.id;
      const image = data.data.image;
      const character = data.data.character;
      setCharacter(id, image, character);
      finalAction();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleCapture = () => {
    capture();
    toggleClick();
  };

  const handleRetake = () => {
    clear();
    toggleClick();
  };

  const handleSend = () => {
    if (!base64Capture) return;
    uploadImage.mutate(base64Capture);
  };

  return (
    <Modal
      size="lg"
      opened={display}
      onClose={finalAction}
      title="Capture Drawing"
      centered
      fullScreen={isMobile}
      closeOnEscape={!uploadImage.isPending}
      withCloseButton={!uploadImage.isPending}
      closeOnClickOutside={!uploadImage.isPending}
    >
      <Container>
        <Stack>
          {!click && <Webcam ref={webcamRef} />}
          {click && base64Capture && (
            <Image src={base64Capture} alt="placeholder" />
          )}
          <Grid>
            {click && (
              <Grid.Col span={8}>
                <Button
                  onClick={handleSend}
                  disabled={uploadImage.isPending}
                  fullWidth
                >
                  {uploadImage.isPending ? "Sending..." : "Send"}
                </Button>
              </Grid.Col>
            )}
            {click && (
              <Grid.Col span={4}>
                <Button
                  onClick={handleRetake}
                  disabled={uploadImage.isPending}
                  fullWidth
                >
                  Retake
                </Button>
              </Grid.Col>
            )}
            {!click && (
              <Grid.Col span={12}>
                <Button onClick={handleCapture} fullWidth>
                  Capture
                </Button>
              </Grid.Col>
            )}
          </Grid>
          {uploadImage.isError && (
            <Text c="red">{uploadImage.error.message}</Text>
          )}
        </Stack>
      </Container>
    </Modal>
  );
};

export default WebcamUploadModal;
