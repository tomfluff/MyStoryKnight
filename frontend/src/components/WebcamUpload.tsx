import React from "react";
import useWebcam from "../hooks/useWebcam";
import { Box, Grid, Stack, Button, Container, Image } from "@mantine/core";
import Webcam from "react-webcam";
import { useDisclosure } from "@mantine/hooks";

type Props = {};

const WebcamUpload = (props: Props) => {
  const { webcamRef, base64Capture, capture, clear } = useWebcam();
  const [click, { toggle }] = useDisclosure(false);

  const handleCapture = () => {
    capture();
    toggle();
  };

  const handleRetake = () => {
    clear();
    toggle();
  };

  const handleSend = () => {
    console.log(base64Capture);
  };

  return (
    <Container bg="blue">
      <Stack>
        {!click && <Webcam ref={webcamRef} />}
        {click && base64Capture && (
          <Image src={base64Capture} alt="placeholder" />
        )}
        <Grid>
          {click && (
            <Grid.Col span={8}>
              <Button onClick={handleSend} fullWidth>
                Send
              </Button>
            </Grid.Col>
          )}
          {click && (
            <Grid.Col span={4}>
              <Button onClick={handleRetake} fullWidth>
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
      </Stack>
    </Container>
  );
};

export default WebcamUpload;
