import {
  Center,
  Paper,
  Stack,
  Title,
  Divider,
  rem,
  Text,
  Button,
  Box,
} from "@mantine/core";
import { useAdventureStore } from "../stores/adventureStore";
import { initSession, useSessionStore } from "../stores/sessionStore";
import getAxiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import WebcamUploadModal from "./WebcamUploadModal";
import PremiseSelectModal from "./PremiseSelectModal";

const InstructionView = () => {
  const instance = getAxiosInstance();
  const session = useSessionStore.use.id();
  const character = useAdventureStore.use.character();
  const premise = useAdventureStore.use.premise();

  const [captureModal, { open: openCapture, close: closeCapture }] =
    useDisclosure();
  const [premiseModal, { open: openPremise, close: closePremise }] =
    useDisclosure();

  const newSession = useMutation({
    mutationKey: ["session"],
    mutationFn: () => {
      return instance.get("/session").then((res) => res.data);
    },
    onSuccess: (data) => {
      initSession(data.data.id);
    },
  });

  return (
    <>
      <Center>
        <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
          <Stack align="center" mb={rem(20)}>
            <Title order={3} fs="italic">
              Your Adventure Awaits
            </Title>
            <Divider size="sm" w={rem(128)} />
          </Stack>
          <Stack align="start" gap="sm">
            <Box opacity={!session ? 1 : 0.5}>
              <Text>
                1. Start a{" "}
                <Button
                  m="xs"
                  size="compact-md"
                  onClick={() => newSession.mutate()}
                  disabled={session != null}
                >
                  New Session
                </Button>{" "}
                to set up the system, and feel free to change the settings.
              </Text>
            </Box>

            <Box opacity={session != null && !character ? 1 : 0.5}>
              <Text>
                2. Upload and{" "}
                <Button
                  m="xs"
                  size="compact-md"
                  onClick={openCapture}
                  disabled={session == null || character != null}
                >
                  Capture your Drawing
                </Button>{" "}
                of a character to be the hero of your story.
              </Text>
            </Box>
            <Box
              opacity={
                session != null && character != null && !premise ? 1 : 0.5
              }
            >
              <Text>
                3. Select a{" "}
                <Button
                  m="xs"
                  size="compact-md"
                  onClick={openPremise}
                  disabled={character == null || premise != null}
                >
                  Premise
                </Button>{" "}
                to set the stage for your story.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Center>
      <WebcamUploadModal display={captureModal} finalAction={closeCapture} />
      <PremiseSelectModal
        character={character}
        display={premiseModal}
        finalAction={closePremise}
      />
    </>
  );
};

export default InstructionView;
