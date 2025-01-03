import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import useWebcam from "../hooks/useWebcam";
import getAxiosInstance from "../utils/axiosInstance";
import { useInterval } from "@mantine/hooks";
import Webcam from "react-webcam";
import ImageSlideshow from "./ImageSlideshow";
import { useMutation } from "@tanstack/react-query";
import { TMotion } from "../types/Story";

type Props = {
  display: boolean;
  handleMotion: (motion: TMotion) => void;
  finalAction: () => void;
};

const MotionUploadModal = ({ display, handleMotion, finalAction }: Props) => {
  const { webcamRef, capture } = useWebcam();
  const [userDevices, setUserDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const interval = useInterval(() => {
    const frame = capture();
    if (frame) {
      setFrames((prevFrames) => [...prevFrames, frame]);
    }
  }, 300);

  const instance = getAxiosInstance();
  const uploadMotion = useMutation({
    mutationKey: ["motion"],
    mutationFn: (frames: string[]) => {
      return instance
        .post("/story/motion", {
          frames,
        })
        .then((res) => {
          return res.data.data as TMotion;
        });
    },
    onSuccess: (data: TMotion) => {
      handleMotion(data);
      setFrames([]);
      finalAction();
    },
  });

  const handleStartRecording = () => {
    setFrames([]);
    setIsCapturing(true);
    interval.start();
    // Stop automatically after 3 seconds
    setTimeout(() => {
      handleStopRecording();
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsCapturing(false);
    interval.stop();
  };

  const handleUpload = () => {
    if (frames.length === 0) return;
    uploadMotion.mutate(frames);
  };

  const handleClose = () => {
    setFrames([]);
    finalAction();
  };

  return (
    <Box className="motion-upload__wrapper">
      <Box className="motion-upload__content">
        <Modal
          opened={display}
          onClose={handleClose}
          size="lg"
          title="Capture Motion"
          centered
        >
          <Container>
            <Stack>
              <Box className="motion-upload__devices">
                <Select
                  data={userDevices.map((device) => ({
                    value: device.deviceId,
                    label: device.label,
                  }))}
                  value={activeDevice}
                  onChange={(value) => setActiveDevice(value)}
                  placeholder="Select device"
                />
              </Box>
              <Box
                className="motion-upload__webcam"
                style={{
                  position: "relative",
                }}
              >
                <Box
                  className="motion-upload__overview"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  hidden={frames.length === 0 || isCapturing}
                >
                  <ImageSlideshow interval={300} images={frames} />
                </Box>
                <Webcam
                  ref={webcamRef}
                  width="100%"
                  videoConstraints={{
                    deviceId: activeDevice ?? undefined,
                  }}
                  onUserMedia={() => {
                    if (userDevices.length === 0)
                      navigator.mediaDevices
                        .enumerateDevices()
                        .then((devices) => {
                          const videoDevices = devices.filter(
                            (device) => device.kind === "videoinput"
                          );
                          setUserDevices(videoDevices);
                          setActiveDevice(videoDevices[0].deviceId);
                        });
                  }}
                />
              </Box>
              <Grid>
                <Grid.Col span={6}>
                  {isCapturing && (
                    <Button
                      onClick={handleStopRecording}
                      fullWidth
                      color="red"
                      disabled={!isCapturing}
                    >
                      Stop Recording
                    </Button>
                  )}
                  {!isCapturing && (
                    <Button
                      onClick={handleStartRecording}
                      fullWidth
                      color={frames.length > 0 ? "orange" : "violet"}
                      disabled={isCapturing}
                    >
                      {isCapturing
                        ? "Recording..."
                        : frames.length > 0
                        ? "Retake"
                        : "Start Recording"}
                    </Button>
                  )}
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button
                    onClick={handleUpload}
                    fullWidth
                    disabled={frames.length === 0 || isCapturing}
                    loading={uploadMotion.isPending}
                    loaderProps={{
                      color: "white",
                      size: "md",
                      type: "dots",
                    }}
                  >
                    Send
                  </Button>
                </Grid.Col>
              </Grid>
              {uploadMotion.isError && (
                <Text c="red">{uploadMotion.error.message}</Text>
              )}
            </Stack>
          </Container>
        </Modal>
      </Box>
    </Box>
  );
};

export default MotionUploadModal;
