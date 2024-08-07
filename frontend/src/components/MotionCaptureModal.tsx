import useMotionCapture from "../hooks/useMotionCapture";
import {
  Text,
  Grid,
  Stack,
  Button,
  Container,
  Modal,
  Loader,
} from "@mantine/core";
import Webcam from "react-webcam";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { createCallContext } from "../utils/llmIntegration";
import { useMemo, useEffect, useState } from "react";

type Props = {
  display: boolean;
  finalAction: () => void;
};

const MotionCaptureModal = ({ display, finalAction }: Props) => {
  const { 
    webcamRef, 
    videoBlob, 
    startRecording, 
    stopRecording, 
    clear, 
    isRecording 
  } = useMotionCapture();
  const [click, { toggle: toggleClick }] = useDisclosure(false);
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [webcamDirection, { toggle: toggleWebcamDirection }] = useDisclosure(
    !isMobile
  );

  const videoConstraints = useMemo(() => {
    return {
      facingMode: webcamDirection ? "user" : { exact: "environment" },
    };
  }, [webcamDirection]);

  const uploadVideo = useMutation({
    mutationKey: ["motion"],
    mutationFn: async (video: Blob) => {
      const video_base64 = await new Promise<string | ArrayBuffer | undefined>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(video);
        reader.onloadend = function () {
          const base64data = reader.result;
          console.log("Converted:", base64data);
  
          const result = base64data?.slice("data:video/mp4;base64,".length);
          console.log("Fixed: ", result);
  
          if (result) {
            resolve(result);
          } else {
            reject("Failed to convert video to Base64");
          }
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
  
      console.log("Video before sending request:", video_base64);
      console.log("createCallContext result: ", createCallContext({ video: video_base64, type: "mp4" }));
  
      try {
        const response = await instance.post("/story/motion", createCallContext({ video: video_base64, type: "mp4" }));
        return response.data;
      } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Processed data in MotionCaptureModal: ", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
    //   return () => URL.revokeObjectURL(url); // Clean up the URL object
    }
  }, [videoBlob]);

  const handleStartRecording = () => {
    startRecording();
    toggleClick();
  };

  const handleStopRecording = () => {
    stopRecording();
    toggleClick();
  };

  const handleRetake = () => {
    clear();
    setVideoUrl(null);
    toggleClick();
  };

  const handleUpload = () => {
    if (videoBlob) {
      uploadVideo.mutate(videoBlob);
    }
  };

  return (
    <Modal
      size="lg"
      opened={display}
      onClose={handleRetake}
      title="Capture Motion"
      centered
      fullScreen={isMobile}
      closeOnEscape={!uploadVideo.isPending}
      withCloseButton={!uploadVideo.isPending}
      closeOnClickOutside={!uploadVideo.isPending}
    >
      <Container>
        <Stack>
          {videoUrl == null && (
            <Webcam ref={webcamRef} videoConstraints={videoConstraints} />
          )}
          {!isRecording && videoUrl && (
            <video controls src={videoUrl} width="100%" />
          )}
          <Grid>
            {!videoUrl && (
             <Grid.Col span={isMobile ? 8 : 12}>
              <Button onClick={isRecording ? handleStopRecording : handleStartRecording} fullWidth>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
             </Grid.Col>
            )}
            {!isRecording && videoUrl && (
             <Grid.Col span={8}>
                <Button 
                    onClick={handleUpload}
                    disabled={uploadVideo.isPending || !videoBlob}
                    fullWidth
                    >
                    {isRecording ? (
                        <Loader color="gray" type="dots" size="md" />
                    ) : (
                        "Send"
                    )}
                </Button>
             </Grid.Col>
            )}
            {!isRecording && videoUrl && (
              <Grid.Col span={4}>
                <Button
                  onClick={handleRetake}
                  disabled={uploadVideo.isPending}
                  fullWidth
                >
                  {isRecording ? (
                        <Loader color="gray" type="dots" size="md" />
                    ) : (
                        "Retake"
                    )}
                </Button>
              </Grid.Col>
            )}
            {!isRecording && isMobile && (
              <Grid.Col span={4}>
                <Button onClick={toggleWebcamDirection} fullWidth>
                  Flip
                </Button>
              </Grid.Col>
            )}
          </Grid>
          {uploadVideo.isError && (
            <Text c="red">{uploadVideo.error.message}</Text>
          )}
        </Stack>
      </Container>
    </Modal>
  );
};

export default MotionCaptureModal;